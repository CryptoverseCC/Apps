import { h, Component } from 'preact';

import { web3 } from '@userfeeds/utils';
import Svg from '@userfeeds/apps-components/src/Svg';
import Link from '@userfeeds/apps-components/src/Link';
import Paper from '@userfeeds/apps-components/src/Paper';
import Loader from '@userfeeds/apps-components/src/Loader';
import Button from '@userfeeds/apps-components/src/Button';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import Steps from './components/Steps';

import * as style from './Status.scss';

const heartSvg = require('../../../images/heart.svg');

const getTransactionReceipt = (tx: string) => {
  return new Promise((resolve, reject) => {
    web3.eth.getTransactionReceipt(tx, (error, result) => {
      if (error) {
        return reject(error);
      }

      resolve(result);
    });
  });
};

const getBlockNumber: () => Promise<number> = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, currentBlockNumber) => {
      if (error) {
        return reject(error);
      }

      resolve(currentBlockNumber);
    });
  });
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface IStatusProps {
  location: any;
}

interface IStatusState {
  link?: any;
  linkId: string;
  context: string;
  algorithm: string;
  whitelist: string;
  publisherNote: string;
  widgetLocation: string;
  blockchain: {
    web3Available: boolean;
    blockNumber: number | null;
    currentBlockNumber: number | null;
  };
}

export default class Status extends Component<IStatusProps, IStatusState> {

  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);

    const context = params.get('context') || '';
    const algorithm = params.get('algorithm') || '';
    const whitelist = params.get('whitelist') || '';
    const linkId = params.get('linkId') || '';
    const publisherNote = params.get('publisherNote') || '';
    const widgetLocation = params.get('widgetLocation') || '';

    this.state = {
      linkId,
      context,
      algorithm,
      whitelist,
      publisherNote,
      widgetLocation,
      blockchain: {
        web3Available: false,
        blockNumber: null,
        currentBlockNumber: null,
      },
    };

    this._observeBlockchainState(linkId);
    this._fetchLinks(context, algorithm, whitelist)
      .then(this._findLinkById(linkId))
      .then((link) => {
        if (!link) {
          const setTimeoutForFetch = () => {
            setTimeout(() => {
              this._fetchLinks(context, algorithm, whitelist)
                .then(this._findLinkById(linkId))
                .then((link) => !link && setTimeoutForFetch());
            }, 5000);
          };

          setTimeoutForFetch();
        }
      });
  }

  render() {
    if (!this.state.context) {
      return null;
    }

    const { linkId, context, link, blockchain, widgetLocation } = this.state;
    return (
      <div class={style.self}>
        <Paper class={style.preview}>
          {link && <Link link={link} />}
          {!link && <div class={style.loader}><Loader /></div>}
        </Paper>
        <Paper class={style.content}>
          <img src={heartSvg} />
          <h2>Your link has been succesfully submited!</h2>
          <p>In order to track its progress please save the link</p>
          <TextWithLabel class={style.label} label="Link status:">
            <div class={style.linkLabel}>
              <a class={style.link} href={window.location.href}>{window.location.href}</a>
              <Button secondary class={style.addBookmark}>Add to bookmarks</Button>
            </div>
          </TextWithLabel>
          <TextWithLabel class={style.label} label="Widget location:">
            <a href={widgetLocation}>{widgetLocation}</a>
          </TextWithLabel>
          <Steps
            linkId={linkId}
            context={context}
            link={link}
            blockchainState={blockchain}
          />
        </Paper>
      </div>
    );
  }

  _fetchLinks = async (context, algorithm, whitelist) => {
    const baseURL = 'https://api.userfeeds.io/ranking';

    try {
      const allLinksRequest = fetch(`${baseURL}/${context}/${algorithm}/`)
        .then((res) => res.json());
      const whitelistedLinksRequest = fetch(`${baseURL}/${context}/${algorithm}/?whitelist=${whitelist}`)
        .then((res) => res.json());

      const [allLinks, whitelistedLinks] = await Promise.all([allLinksRequest,
        whitelistedLinksRequest]);
      const links = allLinks.items.map((link) => {
        const whitelisted = whitelistedLinks.items.find((a) => link.id === a.id);

        return {
          ...link,
          whitelisted: !!whitelisted,
        };
      });

      return links;
    } catch (_) {
      return [];
    }
  }

  _observeBlockchainState = async (linkId: string) => {
    if (!web3.isConnected()) {
      return this.setState({ blockchain: { ...this.state.blockchain, web3Available: false }});
    }
    this.setState({ blockchain: { ...this.state.blockchain, web3Available: true }});

    const [, tx] = linkId.split(':');

    let receipt;
    do {
      receipt = await getTransactionReceipt(tx);
      await wait(1000);
    } while (!receipt);

    const currentBlockNumber = await getBlockNumber();
    this.setState({
      blockchain: {
        ...this.state.blockchain,
        blockNumber: receipt.blockNumber,
        currentBlockNumber,
      },
    });

    while (true) {
      await wait(10000);
      const currentBlockNumber = await getBlockNumber();
      this.setState({ blockchain: { ...this.state.blockchain, currentBlockNumber }});
    }
  }

  _findLinkById = (linkId) => (links) => {
    const link = links.find((l) => l.id === linkId);
    this.setState({ link });

    return link;
  }
}

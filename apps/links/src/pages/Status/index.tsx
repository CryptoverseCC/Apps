import React, { Component } from 'react';
import { Location } from 'history';

import web3 from '@userfeeds/utils/src/web3';

import { mobileOrTablet } from '@userfeeds/utils/src/userAgent';
import Svg from '@userfeeds/apps-components/src/Svg';
import Link from '@userfeeds/apps-components/src/Link';
import Paper from '@userfeeds/apps-components/src/Paper';
import Loader from '@userfeeds/apps-components/src/Loader';
import Button from '@userfeeds/apps-components/src/Button';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';
import Intercom from '@userfeeds/apps-components/src/Intercom';
import A from '@userfeeds/apps-components/src/A';

import Steps from './components/Steps';

import * as style from './status.scss';

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
  location: Location;
}

interface IStatusState {
  mobileOrTablet: boolean;
  apiUrl: string;
  link?: any;
  linkId: string;
  asset: string;
  recipientAddress: string;
  algorithm: string;
  whitelist: string;
  location: string;
  blockchain: {
    web3Available: boolean;
    blockNumber: number | null;
    currentBlockNumber: number | null;
  };
}

export default class Status extends Component<IStatusProps, IStatusState> {
  constructor(props: IStatusProps) {
    super(props);
    const params = new URLSearchParams(props.location.search);

    const apiUrl = params.get('apiUrl') || 'https://api.userfeeds.io';
    const recipientAddress = params.get('recipientAddress') || '';
    const asset = params.get('asset') || '';
    const algorithm = params.get('algorithm') || '';
    const whitelist = params.get('whitelist') || '';
    const linkId = params.get('linkId') || '';
    const location = params.get('location') || '';

    this.state = {
      mobileOrTablet: mobileOrTablet(),
      apiUrl,
      linkId,
      recipientAddress,
      asset,
      algorithm,
      whitelist,
      location,
      blockchain: {
        web3Available: false,
        blockNumber: null,
        currentBlockNumber: null,
      },
    };
  }

  componentDidMount() {
    const { linkId, apiUrl, recipientAddress, asset, algorithm, whitelist } = this.state;
    this._observeBlockchainState(linkId);

    const setTimeoutForFetch = (timeout: number | undefined) => {
      setTimeout(() => {
        this._fetchLinks(apiUrl, recipientAddress, asset, algorithm, whitelist)
          .then(this._findLinkById(linkId))
          .then((link) => link && !link.whitelisted && setTimeoutForFetch(5000));
      }, timeout);
    };

    setTimeoutForFetch(0);
  }

  render() {
    if (!this.state.recipientAddress) {
      return null;
    }

    const { mobileOrTablet, linkId, asset, recipientAddress, link, blockchain, location } = this.state;
    return (
      <div className={style.self}>
        <Intercom settings={{ app_id: 'xdam3he4' }} />
        <div>
          <p className={style.previewTitle}>Link preview:</p>
          <Paper className={style.preview}>
            {link && <Link link={link} />}
            {!link && (
              <div className={style.loader}>
                <Loader />
              </div>
            )}
          </Paper>
        </div>
        <Paper className={style.content}>
          <div className={style.introduction}>
            <img src={heartSvg} />
            <h2>Your link has been successfully submitted!</h2>
            <p>In order to track its progress please save the link</p>
          </div>
          <div className={style.info}>
            <div className={style.label}>Link status:</div>
            <div className={style.text}>
              <A className={style.link} href={window.location.href}>
                {window.location.href}
              </A>
              {!mobileOrTablet && (
                <Button secondary className={style.addBookmark} onClick={this._bookmarkIt}>
                  Add to bookmarks
                </Button>
              )}
            </div>
            <div className={style.label}>Widget location:</div>
            <div className={style.text}>
              <A href={location}>{location}</A>
            </div>
          </div>
          <Steps link={link} blockchainState={blockchain} />
        </Paper>
      </div>
    );
  }

  // ToDo fix - when network is unavailable
  _fetchLinks = async (apiUrl, recipientAddress, asset, algorithm, whitelist) => {
    try {
      const rankingApiUrl = `${apiUrl}/ranking/${asset}:${recipientAddress}/${algorithm}/`;
      const allLinksRequest = fetch(rankingApiUrl, { cache: 'no-store' }).then((res) => res.json());
      const whitelistQueryParam = whitelist ? `?whitelist=${whitelist}` : '';
      const whitelistedLinksRequest = fetch(`${rankingApiUrl}${whitelistQueryParam}`, { cache: 'no-store' })
        .then((res) => res.json());

      const [allLinks, whitelistedLinks] = await Promise.all([allLinksRequest, whitelistedLinksRequest]);
      // suboptimal: make a map id to link before mapping links instead
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
      return this.setState({ blockchain: { ...this.state.blockchain, web3Available: false } });
    }
    this.setState({ blockchain: { ...this.state.blockchain, web3Available: true } });

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
  }

  _findLinkById = (linkId) => (links) => {
    const link = links.find((l) => l.id.startsWith(linkId));
    this.setState({ link });

    return link;
  }

  _bookmarkIt = (e) => {
    e.preventDefault();
    const bookmarkURL = window.location.href;
    const bookmarkTitle = document.title;
    if (!this.state.mobileOrTablet) {
      // Other browsers (mainly WebKit - Chrome/Safari)
      const commandKey = /Mac/i.test(navigator.userAgent) ? 'CMD' : 'Ctrl';
      alert(`Please press ${commandKey} D to add this page to your bookmarks.`);
    }
  }
}

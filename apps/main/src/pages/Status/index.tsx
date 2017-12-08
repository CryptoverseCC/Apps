import React, { Component } from 'react';
import { Location } from 'history';

import web3 from '@linkexchange/utils/web3';
import Web3StateProvider from '@linkexchange/web3-state-provider';

import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import Svg from '@linkexchange/components/src/Svg';
import Link from '@linkexchange/components/src/Link';
import Paper from '@linkexchange/components/src/Paper';
import Loader from '@linkexchange/components/src/Loader';
import Button from '@linkexchange/components/src/Button';
import TextWithLabel from '@linkexchange/components/src/TextWithLabel';
import Intercom from '@linkexchange/components/src/Intercom';
import A from '@linkexchange/components/src/A';

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
    web3UnavailableReason?: string;
    transationBlockNumber?: number;
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
      },
    };
  }

  componentDidMount() {
    const { linkId, apiUrl, recipientAddress, asset, algorithm, whitelist } = this.state;

    const setTimeoutForFetch = (timeout: number | undefined) => {
      setTimeout(() => {
        this._fetchLinks(apiUrl, recipientAddress, asset, algorithm, whitelist)
          .then(this._findLinkById(linkId))
          .then((link) => {
            if (!link || !link.whitelisted) {
              setTimeoutForFetch(5000);
            }
          });
      }, timeout);
    };

    setTimeoutForFetch(0);
  }

  render() {
    if (!this.state.recipientAddress) {
      return null;
    }

    const { mobileOrTablet, linkId, asset, recipientAddress, link, blockchain, location } = this.state;
    const [disaredNetwork] = asset.split(':');

    return (
      <div className={style.self}>
        <Intercom settings={{ app_id: 'xdam3he4' }} />
        <Web3StateProvider
          disaredNetwork={disaredNetwork}
          render={this._onWeb3State}
        />
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

  _onWeb3State = (state) => {
    this._observeBlockchainState(state);
    return null;
  }

  _observeBlockchainState = async ({ enabled, reason }) => {
    const disabled = !enabled && (reason && reason !== 'Your wallet is locked');

    if (disabled) {
      return this.setState({ blockchain: { web3Available: false, web3UnavailableReason: reason } });
    }
    const [, tx] = this.state.linkId.split(':');

    const receipt = await getTransactionReceipt(tx);
    this.setState({
      blockchain: {
        web3Available: true,
        transationBlockNumber: receipt.status === '0x1' ? receipt.blockNumber : null,
      },
    });
  }

  _findLinkById = (linkId) => (links) => {
    const link = links.find((l) => l.id.startsWith(linkId));
    this.setState({ link });

    return link;
  }
}

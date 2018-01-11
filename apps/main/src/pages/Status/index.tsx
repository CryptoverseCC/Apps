import React, { Component } from 'react';
import Web3 from 'web3';
import { Location } from 'history';

import wait from '@linkexchange/utils/wait';
import { getInfura, TNetwork } from '@linkexchange/utils/web3';
import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import Svg from '@linkexchange/components/src/Svg';
import Link from '@linkexchange/components/src/Link';
import Paper from '@linkexchange/components/src/Paper';
import Loader from '@linkexchange/components/src/Loader';
import Button from '@linkexchange/components/src/Button';
import TextWithLabel from '@linkexchange/components/src/TextWithLabel';
import A from '@linkexchange/components/src/A';

import Steps from './components/Steps';

import * as style from './status.scss';

const heartSvg = require('../../../images/heart.svg');

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
  transationBlockNumber: number | null;
}

class Status extends Component<IStatusProps, IStatusState> {
  web3: Web3;

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

    const [network] = asset.split(':');
    this.web3 = getInfura(network as TNetwork);

    this.state = {
      mobileOrTablet: mobileOrTablet(),
      apiUrl,
      linkId,
      recipientAddress,
      asset,
      algorithm,
      whitelist,
      location,
      transationBlockNumber: null,
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
    this._observeBlockchainState();
  }

  render() {
    if (!this.state.recipientAddress) {
      return null;
    }

    const { mobileOrTablet, linkId, asset, recipientAddress, link, location, transationBlockNumber } = this.state;

    return (
      <div className={style.self}>
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
          <Steps link={link} transationBlockNumber={transationBlockNumber} />
        </Paper>
      </div>
    );
  }

  // ToDo fix - when network is unavailable
  _fetchLinks = async (apiUrl, recipientAddress, asset, algorithm, whitelist) => {
    try {
      const rankingApiUrl = `${apiUrl}/ranking/${algorithm};asset=${asset};context=${recipientAddress}/`;
      const allLinksRequest = fetch(rankingApiUrl, { cache: 'no-store' }).then((res) => res.json());
      const whitelistFilterAlgorithm = whitelist ? `filter_whitelist;whitelist=${whitelist}/` : '';
      const whitelistedLinksRequest = fetch(`${rankingApiUrl}${whitelistFilterAlgorithm}`, { cache: 'no-store' })
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

  _observeBlockchainState = async () => {
    do {
      const [, tx] = this.state.linkId.split(':');
      const receipt = await this.web3.eth.getTransactionReceipt(tx);
      if (receipt) {
        this.setState({
          transationBlockNumber: receipt.status === '0x1' ? receipt.blockNumber : null,
        });
      }
      await wait(1000);
    } while (this.state.transationBlockNumber == null);
  }

  _findLinkById = (linkId) => (links) => {
    const link = links.find((l) => l.id.startsWith(linkId));
    this.setState({ link });

    return link;
  }
}

export default Status;

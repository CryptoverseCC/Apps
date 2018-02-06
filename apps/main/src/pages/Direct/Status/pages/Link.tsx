import React, { Component } from 'react';
import Web3 from 'web3';
import { BlockHeader } from 'web3/types';
import { Location } from 'history';

import wait from '@linkexchange/utils/wait';
import { getInfura, TNetwork } from '@linkexchange/utils/web3';
import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import Link from '@linkexchange/components/src/Link';
import Paper from '@linkexchange/components/src/Paper';
import Loader from '@linkexchange/components/src/Loader';
import A from '@linkexchange/components/src/A';
import heartSvg from '@linkexchange/images/heart.svg';

import Svg from '@linkexchange/components/src/Svg';
import Icon from '@linkexchange/components/src/Icon';
const cubeSvg = require('!!svg-inline-loader?removeTags=true&removeSVGTagAttrs=true!@linkexchange/images/cube.svg');

import Steps, { Step } from '../components/Steps';

import * as style from './link.scss';

interface IProps {
  location: Location;
}

interface IState {
  mobileOrTablet: boolean;
  apiUrl: string;
  link?: any;
  linkId: string;
  asset: string;
  recipientAddress: string;
  algorithm: string;
  whitelist: string;
  location: string;
  currentBlockNumber: number | null;
  transationStatus: boolean | null;
  transationBlockNumber: number | null;
}

class LinkStatus extends Component<IProps, IState> {
  web3: Web3;

  constructor(props: IProps) {
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
    this.web3 = getInfura(network as TNetwork, true);

    this.state = {
      mobileOrTablet: mobileOrTablet(),
      apiUrl,
      linkId,
      recipientAddress,
      asset,
      algorithm,
      whitelist,
      location,
      currentBlockNumber: null,
      transationBlockNumber: null,
      transationStatus: null,
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

    const { link, location, transationBlockNumber } = this.state;

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
            <p>In order to track its progress, bookmark the URL</p>
          </div>
          <div className={style.info}>
            <div className={style.label}>Widget location:</div>
            <div className={style.text}>
              <A href={location}>{location}</A>
            </div>
          </div>
          <Steps stepsStates={this._getStepsStates()}>
            <Step icon={<Icon className={style.icon} name="eye" />}>
              <p>On a blockchain</p>
            </Step>
            <Step
              icon={
                <div className={style.icon}>
                  <Svg svg={cubeSvg} size="1.2em" viewBox="0 0 23 27" />
                </div>
              }
            >
              <p>In Review</p>
            </Step>
            <Step icon={<Icon className={style.icon} name="check" />}>
              <p>Whitelisted</p>
            </Step>
          </Steps>
        </Paper>
      </div>
    );
  }

  // ToDo fix - when network is unavailable
  _fetchLinks = async (apiUrl, recipientAddress, asset, algorithm, whitelist) => {
    try {
      // tslint:disable-next-line max-line-length
      const rankingApiUrl = `${apiUrl}/ranking/${algorithm};asset=${asset.toLowerCase()};context=${recipientAddress.toLowerCase()}/`;
      const allLinksRequest = fetch(rankingApiUrl, { cache: 'no-store' }).then((res) => res.json());
      const timedecayFilterAlgorithm = algorithm === 'links' ? 'filter_timedecay/' : '';
      const whitelistFilterAlgorithm = whitelist ? `filter_whitelist;whitelist=${whitelist.toLowerCase()}/` : '';
      const groupFilterAlgorithm = 'filter_group;sum_keys=score;sum_keys=total/';
      // tslint:disable-next-line max-line-length
      const whitelistedLinksRequest = fetch(
        `${rankingApiUrl}${timedecayFilterAlgorithm}${whitelistFilterAlgorithm}${groupFilterAlgorithm}`,
        { cache: 'no-store' },
      ).then((res) => res.json());

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
  };

  _observeBlockchainState = () => {
    const blockHeaders: any = this.web3.eth.subscribe('newBlockHeaders');

    blockHeaders.on('data', ({ number }: BlockHeader) => {
      this.setState({ currentBlockNumber: number });
      if (!this.state.transationBlockNumber) {
        this._checkReceipt();
      }
    });
  };

  _checkReceipt = async () => {
    const [, tx] = this.state.linkId.split(':');
    const receipt = await this.web3.eth.getTransactionReceipt(tx);
    if (receipt) {
      this.setState({
        transationStatus: receipt.status === '0x1' ? true : false,
        transationBlockNumber: receipt.blockNumber,
      });
    }
  };

  _findLinkById = (linkId) => (links) => {
    const link = links.find((l) => l.id.startsWith(linkId));
    this.setState({ link });

    return link;
  };

  _getStepsStates = () => {
    const { link, transationBlockNumber } = this.state;
    let step0State;
    let step0Reason;

    if (link) {
      step0State = 'done';
    } else if (transationBlockNumber !== null) {
      step0State = 'done';
    } else {
      step0State = 'waiting';
      step0Reason = 'Waiting for blockchain';
    }

    const step1State = step0State === 'waiting' ? 'notstarted' : link ? 'done' : 'waiting';

    const step2State =
      step1State === 'waiting' || step1State === 'notstarted'
        ? 'notstarted'
        : link && link.whitelisted ? 'done' : 'waiting';

    return [{ state: step0State, reason: step0Reason }, { state: step1State }, { state: step2State }];
  };
}

export default LinkStatus;

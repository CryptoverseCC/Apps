import React, { Component } from 'react';
import Web3 from 'web3';
import { BlockHeader } from 'web3/types';
import { Location } from 'history';

import wait from '@linkexchange/utils/wait';
import { getInfura, TNetwork } from '@linkexchange/utils/web3';
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
import { inject, observer } from 'mobx-react';
import { IWeb3Store } from '@linkexchange/web3-store';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { reaction, IReactionDisposer } from 'mobx';

interface IProps {
  location: Location;
  web3Store?: IWeb3Store;
  widgetSettingsStore?: IWidgetSettings;
}

interface IState {
  link?: any;
  linkId: string;
  transactionStatus: boolean | null;
  reactToBlock?: IReactionDisposer;
}

@inject('web3Store', 'widgetSettingsStore')
@observer
class LinkStatus extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const params = new URLSearchParams(props.location.search);
    const linkId = params.get('linkId') || '';
    this.state = {
      linkId,
      transactionStatus: null,
      reactToBlock: undefined,
    };
  }

  componentDidMount() {
    const { apiUrl, recipientAddress, asset, algorithm, whitelist } = this.props.widgetSettingsStore!;
    const { linkId } = this.state;

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
    const { whitelist, location } = this.props.widgetSettingsStore!;
    const { link } = this.state;

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

            <Step icon={<Icon className={style.icon} name="check" />}>
              <p>{this._lastStepName()}</p>
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
      const allLinksRequest = fetch(rankingApiUrl).then((res) => res.json());
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
    reaction(
      () => this.props.web3Store!.blockNumber,
      async (blockNumber, blockReaction) => {
        const receipt = await this.props.web3Store!.getTransactionReceipt(this.state.linkId.split(':')[1]);
        if (receipt) {
          this.setState({ transactionStatus: receipt.status === '0x1' ? true : false });
          blockReaction.dispose();
        }
      },
    );
  };

  _findLinkById = (linkId) => (links) => {
    const link = links.find((l) => l.id.startsWith(linkId));
    this.setState({ link });

    return link;
  };

  _getStepsStates = () => {
    const { whitelist } = this.props.widgetSettingsStore!;
    const { link, transactionStatus } = this.state;
    let step0State;
    let step0Reason;

    if (link) {
      step0State = 'done';
    } else if (transactionStatus !== null) {
      step0State = transactionStatus ? 'done' : 'failed';
    } else {
      step0State = 'waiting';
      step0Reason = 'Waiting for blockchain';
    }

    const step1State =
      step0State !== 'done'
        ? 'notstarted'
        : (link && !!whitelist && link.whitelisted) || (link && !whitelist) ? 'done' : 'waiting';

    return [{ state: step0State, reason: step0Reason }, { state: step1State }];
  };

  _lastStepName = () => {
    const { whitelist } = this.props.widgetSettingsStore!;
    const { link } = this.state;
    if (whitelist) {
      return (link && !link.whitelisted) || !link ? 'In Review' : 'Whitelisted';
    }
    return !link ? 'Processing' : 'Added';
  };
}

export default LinkStatus;

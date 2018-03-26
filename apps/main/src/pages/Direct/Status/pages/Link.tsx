import React, { Component } from 'react';
import { Location } from 'history';

import Link from '@linkexchange/components/src/Link';
import Paper from '@linkexchange/components/src/Paper';
import Loader from '@linkexchange/components/src/Loader';
import A from '@linkexchange/components/src/A';
import Icon from '@linkexchange/components/src/Icon';
import heartSvg from '@linkexchange/images/heart.svg';

import Steps, { Step } from '../components/Steps';

import * as style from './link.scss';
import { inject, observer } from 'mobx-react';
import { IWeb3Store } from '@linkexchange/web3-store';
import { IWidgetSettings } from '@linkexchange/types/widget';
import LinksStore from '@linkexchange/links-store';
import { computed, reaction, IReactionDisposer, observable } from 'mobx';

interface IProps {
  location: Location;
  links?: LinksStore;
  web3Store?: IWeb3Store;
  widgetSettingsStore?: IWidgetSettings;
}

@inject('web3Store', 'widgetSettingsStore', 'links')
@observer
export default class LinkStatus extends Component<IProps> {
  @observable transactionStatus: boolean | null = null;
  linkId: string;
  intervalId: any;

  constructor(props: IProps) {
    super(props);
    const params = new URLSearchParams(props.location.search);

    this.linkId = params.get('linkId') || '';
  }

  componentDidMount() {
    this.observeBlockchainState();
    this.observeLinks();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  @computed
  get link() {
    return this.props.links!.allLinks.find((l) => l.id.startsWith(this.linkId));
  }

  @computed
  get whitelistedLink() {
    return this.props.links!.whitelistedLinks.find((l) => l.id.startsWith(this.linkId));
  }

  @computed
  get stepsStates() {
    let step0State;
    if (this.link || this.transactionStatus === true) {
      step0State = {
        state: 'done',
      };
    } else if (this.transactionStatus === false) {
      step0State = {
        state: 'failed',
        reason: 'Your transaction has been rejected',
      };
    } else {
      step0State = {
        state: 'waiting',
        reason: 'Waiting for blockchain',
      };
    }
    let step1State;
    if (step0State.state !== 'done') {
      step1State = {
        state: 'notstarted',
      };
    } else if (this.whitelistedLink) {
      step1State = {
        state: 'done',
      };
    } else if (this.link) {
      step1State = {
        state: 'waiting',
        reason: 'Waiting for whitelisting',
      };
    } else {
      step1State = {
        state: 'waiting',
        reason: 'Processing',
      };
    }
    return [step0State, step1State];
  }

  private observeBlockchainState = () => {
    reaction(
      () => this.props.web3Store!.blockNumber,
      async (blockNumber, blockReaction) => {
        const receipt = await this.props.web3Store!.getTransactionReceipt(this.linkId.split(':')[1]);
        if (receipt) {
          this.transactionStatus = receipt.status === '0x1' ? true : false;
          blockReaction.dispose();
        }
      },
    );
  };

  private observeLinks = () => {
    this.intervalId = setInterval(() => {
      if (this.link && this.whitelistedLink) {
        clearInterval(this.intervalId);
        return;
      }
      this.props.links!.refetch();
    }, 5000);
  };

  private lastStepName = () => {
    const { whitelist } = this.props.widgetSettingsStore!;
    const { link, whitelistedLink } = this;
    if (whitelist) {
      return (link && !whitelistedLink) || !link ? 'In Review' : 'Whitelisted';
    }
    return !link ? 'Processing' : 'Added';
  };

  render() {
    const { location } = this.props.widgetSettingsStore!;
    const { link } = this;

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
          <Steps stepsStates={this.stepsStates}>
            <Step icon={<Icon className={style.icon} name="eye" />}>
              <p>On a blockchain</p>
            </Step>

            <Step icon={<Icon className={style.icon} name="check" />}>
              <p>{this.lastStepName()}</p>
            </Step>
          </Steps>
        </Paper>
      </div>
    );
  }
}

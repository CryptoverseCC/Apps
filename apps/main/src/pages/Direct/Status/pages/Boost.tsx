import React, { Component } from 'react';
import Web3 from 'web3';
import { BlockHeader, Subscribe } from 'web3/types';
import { Location } from 'history';

import wait from '@linkexchange/utils/wait';
import Icon from '@linkexchange/components/src/Icon';
import Paper from '@linkexchange/components/src/Paper';
import heartSvg from '@linkexchange/images/heart.svg';

import Steps, { Step } from '../components/Steps';

import * as style from './boost.scss';
import { IWeb3Store } from '@linkexchange/web3-store';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { reaction } from 'mobx';
import { inject } from 'mobx-react';

interface IProps {
  location: Location;
  web3Store?: IWeb3Store;
  widgetSettingsStore?: IWidgetSettings;
}

interface IState {
  txHash: string;
  transactionStatus: boolean | null;
  transactionBlockNumber: number | undefined;
}

const BACKEND_DELAY = 10;

@inject('web3Store')
export default class Boost extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const params = new URLSearchParams(props.location.search);
    const txHash = params.get('txHash') || '';
    this.state = {
      txHash,
      transactionStatus: null,
      transactionBlockNumber: undefined,
    };
  }

  componentDidMount() {
    this.checkReceipt();
    this.observeBlockchainState();
  }

  private getStepsStates = () => {
    const { blockNumber } = this.props.web3Store!;
    const { transactionStatus, transactionBlockNumber } = this.state;
    const step0State = transactionStatus !== null ? (transactionStatus ? 'done' : 'failed') : 'waiting';
    const step1State =
      transactionStatus !== null
        ? transactionBlockNumber! + BACKEND_DELAY < blockNumber! ? 'done' : 'waiting'
        : 'notstarted';
    return [{ state: step0State }, { state: step1State }];
  };

  private checkReceipt = async () => {
    const receipt = await this.props.web3Store!.getTransactionReceipt(this.state.txHash);
    if (receipt) {
      this.setState({
        transactionStatus: receipt.status === '0x1' ? true : false,
        transactionBlockNumber: receipt.blockNumber,
      });
    }
    return !!receipt;
  };

  private observeBlockchainState = () => {
    reaction(
      () => this.props.web3Store!.blockNumber,
      async (blockNumber, blockReaction) => {
        const updated = await this.checkReceipt();
        if (updated) {
          blockReaction.dispose();
        }
      },
    );
  };

  render() {
    return (
      <div className={style.self}>
        <Paper className={style.paper}>
          <img src={heartSvg} />
          <p>Your link has been successfully boosted</p>
          <Steps stepsStates={this.getStepsStates()}>
            <Step icon={<Icon className={style.icon} name="eye" />}>
              <p>On a blockchain</p>
            </Step>
            <Step icon={<Icon className={style.icon} name="home" />}>
              <p>Boosted!</p>
            </Step>
          </Steps>
        </Paper>
      </div>
    );
  }
}

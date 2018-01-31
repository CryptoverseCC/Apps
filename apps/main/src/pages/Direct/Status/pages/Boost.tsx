import React, { Component } from 'react';
import Web3 from 'web3';
import { BlockHeader, Subscribe } from 'web3/types';
import { Location } from 'history';

import wait from '@linkexchange/utils/wait';
import Icon from '@linkexchange/components/src/Icon';
import Paper from '@linkexchange/components/src/Paper';
import { getInfura, TNetwork } from '@linkexchange/utils/web3';
import heartSvg from '@linkexchange/images/heart.svg';

import Steps, { Step } from '../components/Steps';

import * as style from './boost.scss';

interface IProps {
  location: Location;
}

interface IState {
  apiUrl: string;
  asset: string;
  txHash: string;
  currentBlockNumber: number | null;
  transationStatus: boolean | null;
  transationBlockNumber: number | null;
}

const BACKEND_DELAY = 40;

export default class Boost extends Component<IProps, IState> {
  web3: Web3;
  subscription: Subscribe<BlockHeader>;

  constructor(props: IProps) {
    super(props);
    const params = new URLSearchParams(props.location.search);

    const apiUrl = params.get('apiUrl') || 'https://api.userfeeds.io';
    const asset = params.get('asset') || '';
    const txHash = params.get('txHash') || '';

    const [network] = asset.split(':');
    this.web3 = getInfura(network as TNetwork);

    this.state = {
      apiUrl,
      asset,
      txHash,
      currentBlockNumber: null,
      transationStatus: null,
      transationBlockNumber: null,
    };
  }

  componentDidMount() {
    this._checkReceipt();
    this.web3.eth.getBlockNumber().then((currentBlockNumber) => {
      this.setState({ currentBlockNumber });
    });
    this._observeBlockchainState();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.subscription.unsubscribe();
    }
  }

  render() {
    return (
      <div className={style.self}>
        <Paper className={style.paper}>
          <img src={heartSvg} />
          <p>Your link has been successfully boosted</p>
          <Steps stepsStates={this._getStepsStates()}>
            <Step icon={<Icon className={style.icon} name="eye" />}>
              <p>Visible on blockchain</p>
            </Step>
            <Step icon={<Icon className={style.icon} name="home" />}>
              <p>All done!</p>
            </Step>
          </Steps>
        </Paper>
      </div>
    );
  }

  _getStepsStates = () => {
    const { transationStatus, transationBlockNumber, currentBlockNumber } = this.state;
    const step0State = transationStatus !== null ? (transationStatus ? 'done' : 'failed') : 'waiting';
    const step1State =
      transationStatus !== null
        ? transationBlockNumber! + BACKEND_DELAY < currentBlockNumber! ? 'done' : 'waiting'
        : 'notstarted';
    return [{ state: step0State }, { state: step1State }];
  };

  _checkReceipt = async () => {
    const receipt = await this.web3.eth.getTransactionReceipt(this.state.txHash);
    if (receipt) {
      this.setState({
        transationStatus: receipt.status === '0x1' ? true : false,
        transationBlockNumber: receipt.blockNumber,
      });
    }
  };

  _observeBlockchainState = () => {
    // ToDo remove any when web3 fix typings
    const blockHeaders: any = this.web3.eth.subscribe('newBlockHeaders');
    blockHeaders.on('data', ({ number }: BlockHeader) => {
      this.setState({ currentBlockNumber: number });
      if (!this.state.transationBlockNumber) {
        this._checkReceipt();
      }
    });

    this.subscription = blockHeaders;
  };
}

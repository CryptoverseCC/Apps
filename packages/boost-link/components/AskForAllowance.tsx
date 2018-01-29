import React, { Component } from 'react';
import classnames from 'classnames';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import { ITokenDetails } from '@linkexchange/token-details-provider';
import TranscactionProvider from '@linkexchange/transaction-provider';

import Header from './Header';
import Footom from './Footton';

import * as style from './askForAllowance.scss';

interface IProps {
  positionInSlots: number | null;
  tokenDetails: ITokenDetails;
  startTransaction(unlimitedApproval: boolean): Promise<{ promiEvent: PromiEvent<TransactionReceipt> }>;
}

interface IState {
  unlimited: boolean;
}

export default class AskForAllowance extends Component<IProps> {
  state = {
    unlimited: false,
  };

  render() {
    const { positionInSlots, tokenDetails, startTransaction } = this.props;
    const { unlimited } = this.state;

    return (
      <>
        <Header positionInSlots={positionInSlots} tokenDetails={tokenDetails} />
        <div className={style.body}>
          We need a confirmation to use tokens stored on this address.
          <label>
            <input
              type="checkbox"
              checked={unlimited}
              onChange={(e) => this.setState({ unlimited: e.target.checked })}
            />
            Don’t ask me again
          </label>
        </div>
        <Footom onClick={this._startTransaction}>Confirm</Footom>
      </>
    );
  }

  _startTransaction = () => {
    this.props.startTransaction(this.state.unlimited);
  };
}

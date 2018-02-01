import React, { Component } from 'react';
import classnames from 'classnames/bind';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import Icon from '@linkexchange/components/src/Icon';
import { ITokenDetails } from '@linkexchange/token-details-provider';
import TranscactionProvider from '@linkexchange/transaction-provider';

import Header from './Header';
import Footom from './Footton';

import * as style from './askForAllowance.scss';
const cx = classnames.bind(style);

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
        <div className={style.header}>
          <Icon name="arrow-thick-left" className={style.back} />
        </div>
        <div className={style.body}>
          <h2>Tokens Access</h2>
          We need a confirmation to use tokens stored on this address.
          <label className={cx(style.label, { checked: unlimited })}>
            <input
              className={style.checkbox}
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

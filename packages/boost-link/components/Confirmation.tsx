import React, { Component } from 'react';
import classnames from 'classnames';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import { ITokenDetails } from '@linkexchange/token-details-provider';
import TranscactionProvider from '@linkechange/transaction-provider';

import Header from './Header';
import Footom from './Footton';

import * as style from './confirmation.scss';

interface IProps {
  amount: string;
  positionInSlots: number | null;
  tokenDetails: ITokenDetails;
  startTransaction(): Promise<{ promiEvent: PromiEvent<TransactionReceipt>}>;
}

export default class Confirmation extends Component<IProps> {

  render() {
    const { amount, positionInSlots, tokenDetails, startTransaction } = this.props;
    return (
      <>
        <Header positionInSlots={positionInSlots} tokenDetails={tokenDetails} />
        <div className={style.body}>
          <p className={style.value}>{amount} {tokenDetails.symbol}</p>
          <p>Payment</p>
        </div>
        <TranscactionProvider
          startTransaction={startTransaction}
          renderReady={() => (
            <Footom type="confirm" />
          )}
          renderMetaPending={() => (
            <Footom type="metamask" />
          )}
        />
      </>
    );
  }
}

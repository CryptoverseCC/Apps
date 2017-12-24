import React, { Component } from 'react';
import classnames from 'classnames';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import { ITokenDetails } from '@linkexchange/token-details-provider';
import TranscactionProvider from '@linkechange/transaction-provider';

import MetaFox from '@linkechange/transaction-provider/metafox.png';

import * as style from './confirmation.scss';

interface IProps {
  amount: string;
  tokenDetails: ITokenDetails;
  startTransaction(): Promise<{ promiEvent: PromiEvent<TransactionReceipt>}>;
}

export default class Confirmation extends Component<IProps> {

  render() {
    const { amount, tokenDetails, startTransaction } = this.props;
    return (
      <>
        <div className={style.body}/>
        <TranscactionProvider
          startTransaction={startTransaction}
          renderReady={() => (
            <div className={classnames(style.footer, style.confirm)}>Confirm</div>
          )}
          renderMetaPending={() => (
            <div className={classnames(style.footer, style.meta)}>
              <img src={MetaFox} style={{ height: '2em' }} />
            </div>
          )}
        />
      </>
    );
  }
}

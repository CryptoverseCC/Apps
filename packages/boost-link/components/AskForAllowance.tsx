import React, { Component } from 'react';
import classnames from 'classnames/bind';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import Icon from '@linkexchange/components/src/Icon';
import TranscactionProvider from '@linkexchange/transaction-provider';

import * as style from './askForAllowance.scss';
const cx = classnames.bind(style);

interface IProps {
  goBack(): void;
  startTransaction(unlimitedApproval: boolean): Promise<any>;
}

interface IState {
  unlimited: boolean;
}

export default class AskForAllowance extends Component<IProps> {
  state = {
    unlimited: false,
  };

  render() {
    const { goBack } = this.props;
    const { unlimited } = this.state;

    return (
      <>
        <div className={style.header}>
          <Icon name="arrow-thick-left" className={style.back} onClick={goBack} />
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
            <div className={style.checkmark} />
            Don’t ask me again
          </label>
        </div>
        <div className={style.footer} onClick={this._startTransaction}>
          Grant Permission
          <div className={style.next}>
            <Icon name="arrow-thick-top" className={style.icon} />
          </div>
        </div>
      </>
    );
  }

  _startTransaction = () => {
    this.props.startTransaction(this.state.unlimited);
  };
}

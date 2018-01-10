import React, { Component, ReactElement } from 'react';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import Button from '@linkexchange/components/src/NewButton';
import { makeCancelable } from '@linkexchange/utils/cancelablePromise';

import MetaFox from './metafox.png';

export type TStatus = 'ready' | 'metaPending' | 'pending' | 'error' | 'success';

interface IProps {
  initialStatus?: TStatus;
  startTransaction(): Promise<{ promiEvent: PromiEvent<TransactionReceipt>}> | undefined;
  renderReady(): ReactElement<any>;
  renderPending?: () => ReactElement<any>;
  renderMetaPending?: () => ReactElement<any>;
  renderError?: () => ReactElement<any>;
  renderSuccess?: () => ReactElement<any>;
}

interface IState {
  status: TStatus;
}

export default class TransactionProvider extends Component<IProps, IState> {

  static defaultProps = {
    renderPending: () => <Button color="pending">Pending</Button>,
    renderMetaPending: () => (
      <Button color="metaPending">
        <img src={MetaFox} {...{displayName: 'Icon'}} style={{ height: '2em' }} /> Metamask...
      </Button>
    ),
    renderError: () => <Button color="error">Failed :(</Button>,
    renderSuccess: () => <Button color="success">Success</Button>,
  };

  constructor(props) {
    super(props);

    this.state = {
      status: props.initialStatus || 'ready',
    };
  }

  transactionPromise: any; // Cancelabble Promise

  // ToDo
  componentWillUnmount() {
    if (this.transactionPromise) {
      if (!this.transactionPromise.isResolved()) {
        this.transactionPromise.cancel();
      } else {
        this.transactionPromise.promise.then(({ promiEvent }) => {
          promiEvent
            .off('error', this._onError)
            .off('transactionHash', this._onTransactionHash)
            .off('receipt', this._onReceipt);
        });
      }
    }
  }

  private beginTransaction = () => {
    const startedTransaction = this.props.startTransaction();
    if (!startedTransaction) {
      return;
    }

    this.transactionPromise = makeCancelable(startedTransaction);

    this.setState({ status: 'metaPending' });
    this.transactionPromise
      .promise
      .then(({ promiEvent }) => {
        promiEvent
          .on('error', this._onError)
          .on('transactionHash', this._onTransactionHash)
          .on('receipt', this._onReceipt);
      });
  }

  render() {
    switch (this.state.status) {
      case 'ready': {
        return React.cloneElement(
          this.props.renderReady(),
          { onClick: this.beginTransaction },
        );
      }
      case 'metaPending': {
        return this.props.renderMetaPending ? this.props.renderMetaPending() : null;
      }
      case 'pending': {
        return this.props.renderPending ? this.props.renderPending() : null;
      }
      case 'error': {
        return this.props.renderError ? this.props.renderError() : null;
      }
      case 'success': {
        return this.props.renderSuccess ? this.props.renderSuccess() : null;
      }
    }
  }

  _onError = () => {
    this.setState({ status: 'error' });
    setTimeout(() => this.setState({ status: 'ready' }), 3000);
  }

  _onTransactionHash = () => this.setState({ status: 'pending' });

  _onReceipt = ({ status }) => {
    this.setState({ status: status === '0x1' ? 'success' : 'error' });
  }
}

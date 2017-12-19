import React, { Component, ReactElement } from 'react';
import { PromiEvent, TransactionReceipt } from 'web3/types';

import Button from '@linkexchange/components/src/NewButton';

import MetaFox from './metafox.png';

interface IProps {
  startTransaction(): Promise<{ promiEvent: PromiEvent<TransactionReceipt>}> | undefined;
  renderReady(): ReactElement<any>;
  renderPending?: () => ReactElement<any>;
  renderMetaPending?: () => ReactElement<any>;
  renderError?: () => ReactElement<any>;
  renderSuccess?: () => ReactElement<any>;
}

interface IState {
  status: 'ready' | 'metaPending' | 'pending' | 'error' | 'success';
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

  state: IState = {
    status: 'ready',
  };

  private beginTransaction = () => {
    const startedTransaction = this.props.startTransaction();
    if (!startedTransaction) {
      return;
    }

    this.setState({ status: 'metaPending' });
    startedTransaction
      .then(({ promiEvent }) => {
        promiEvent
          .on('error', () => {
            this.setState({ status: 'error' });
            setTimeout(() => this.setState({ status: 'ready' }), 3000);
          })
          .on('transactionHash', () => this.setState({ status: 'pending' }))
          .on('receipt', ({ status }) => {
              this.setState({ status: status === '0x1' ? 'success' : 'error' });
          });
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
}

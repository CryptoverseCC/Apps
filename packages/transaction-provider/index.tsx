import React, { Component, ReactElement } from 'react';
import { PromiEvent, TransactionReceipt } from 'web3/types';

interface IProps {
  startTransation(): Promise<{ promiEvent: PromiEvent<TransactionReceipt>}>;
  renderReady(): ReactElement<any>;
  renderPending(): ReactElement<any>;
  renderMetaPending(): ReactElement<any>;
  renderError(): ReactElement<any>;
  renderSuccess(): ReactElement<any>;
}

interface IState {
  status: 'ready' | 'metaPending' | 'pending' | 'error' | 'success';
}

export default class TransactionProvider extends Component<IProps, IState> {

  state: IState = {
    status: 'ready',
  };

  private beginTransaction = () => {
    this.setState({ status: 'metaPending' });
    this.props.startTransation()
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
        return this.props.renderMetaPending();
      }
      case 'pending': {
        return this.props.renderPending();
      }
      case 'error': {
        return this.props.renderError();
      }
      case 'success': {
        return this.props.renderSuccess();
      }
    }
  }
}

import React, { Component } from 'react';
import core from '@userfeeds/core/src';
import web3 from '@linkexchange/utils/web3';

export default class TransactionProvider extends Component<
  {
    id: any;
    renderReady(beginTransaction: () => void): any;
    renderPending(): any;
    renderMetaPending(): any;
    renderError(): any;
    renderSuccess(): any;
  },
  { status: string, transactionId: string | null }
> {
  state = {
    status: 'ready',
    transactionId: null,
  };

  private checkTransactionStatus = () => {
    core.utils.getTransactionReceipt(web3, this.state.transactionId)
      .then((receipt) => {
        if (receipt === null) {
          setTimeout(this.checkTransactionStatus, 1000);
        } else {
          if (this.state.status === 'pending') {
            this.setState({status: 'success'});
          }
        }
      });
  }

  private beginTransaction = () => {
    const claim = {
      claim: { target: this.props.id },
    };
    this.setState({ status: 'metaPending' });
    core.ethereum.claims.sendClaimWithoutValueTransfer(web3, claim)
      .then((transactionId) => {
        this.setState({status: 'pending', transactionId}, () => {
          this.checkTransactionStatus();
        });
      })
      .catch((e) => {
        this.setState({status: 'error'}, () => {
          setTimeout(() => {
            if (this.state.status === 'error') {
              this.setState({status: 'ready'});
            }
          }, 2000);
      });
    });
  }

  render() {
    switch (this.state.status) {
      case 'ready': {
        return this.props.renderReady(this.beginTransaction);
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

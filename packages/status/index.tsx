import React, { Component } from 'react';
import MetaFox from '@linkexchange/images/metafox.png';
import { withInjectedWeb3AndWeb3State } from '@linkexchange/web3-state-provider';

export class Status extends Component<any, any> {
  render() {
    return this.props.web3State.enabled ? null : (
      <div
        style={{
          position: 'fixed',
          bottom: '15px',
          left: '15px',
          padding: '15px 30px',
          borderRadius: '4px',
          backgroundColor: '#FFCF9F',
          boxShadow: '0 10px 25px 0 rgba(255,207,159,0.3)',
          display: 'flex',
          alignItems: 'center',
          width: '260px',
          justifyContent: 'space-between',
        }}
      >
        <img src={MetaFox} style={{ height: '2em' }} />
        <span style={{ marginLeft: '15px', color: '#814718' }}>{this.props.web3State.reason}</span>
      </div>
    );
  }
}

export default withInjectedWeb3AndWeb3State(Status);

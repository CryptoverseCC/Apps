import React, { Component } from 'react';

import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import { withInjectedWeb3AndWeb3State, IWeb3State } from '@linkexchange/web3-state-provider';
import MetaFox from '@linkexchange/images/metafox.png';

interface IProps {
  mobile?: boolean;
  web3State: IWeb3State;
}

export class Status extends Component<IProps> {
  static defaultProps = {
    mobile: mobileOrTablet(),
  };

  render() {
    return this.props.mobile || this.props.web3State.enabled ? null : (
      <div
        style={{
          zIndex: Number.MAX_SAFE_INTEGER,
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

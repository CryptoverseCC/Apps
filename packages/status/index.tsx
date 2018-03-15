import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import Web3Store from '@linkexchange/web3-store';
import MetaFox from '@linkexchange/images/metafox.png';

interface IProps {
  mobile?: boolean;
  web3Store?: Web3Store;
}

export class Status extends Component<IProps> {
  static defaultProps = {
    mobile: mobileOrTablet(),
  };

  render() {
    return this.props.mobile || !this.props.web3Store!.reason ? null : (
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
        <span style={{ marginLeft: '15px', color: '#814718' }}>{this.props.web3Store!.reason}</span>
      </div>
    );
  }
}

export default inject('web3Store')(observer(Status));

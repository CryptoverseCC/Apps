import React from 'react';
import { connect } from 'react-redux';
import { web3Enabled } from '../selectors/web3';
import Web3StateProvider from '@userfeeds/apps-components/src/Providers/Web3StateProvider';

export default connect((state) => ({web3State: web3Enabled(state)}))(Web3StateProvider);

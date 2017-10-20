import React from 'react';
import { connect } from 'react-redux';
import { web3Enabled } from '../selectors/web3';

export const Web3StateProvider = ({render, web3State}) => render(web3State);

export default connect((state) => ({web3State: web3Enabled(state)}))(Web3StateProvider);

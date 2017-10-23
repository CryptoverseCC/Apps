import React from 'react';
import { connect } from 'react-redux';
import { web3Enabled } from '../selectors/web3';
import { observeInjectedWeb3 } from '../ducks/web3';
import Web3StateProvider from '@userfeeds/apps-components/src/Providers/Web3StateProvider';

export { default as Web3StateProvider } from '@userfeeds/apps-components/src/Providers/Web3StateProvider';

export default connect(
  (state) => ({
    web3State: web3Enabled(state),
  }),
  (dispatch) => ({
    synchronizeState() {
      dispatch(observeInjectedWeb3());
    }}
  ),
)(Web3StateProvider);

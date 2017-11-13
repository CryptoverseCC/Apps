import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {returntypeof } from 'react-redux-typescript';

import Tooltip from '@userfeeds/apps-components/src/Tooltip';
import Button from '@userfeeds/apps-components/src/NewButton';
import { observeInjectedWeb3 } from '@linkexchange/widgets/src/ducks/web3';

import MetaFox from '../../../../images/metafox.png';

import * as style from './copyFromMM.scss';

const mapStateToProps = ({ web3 }) => ({ web3 });
const mapDispatchToProps = (dispatch) => bindActionCreators({ observe: observeInjectedWeb3 }, dispatch);

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TProps = typeof State2Props & typeof Dispatch2Props & {
  onClick(): void;
};

// ToDo unified with Web3StateProvider
class CopyFromMM extends Component<TProps, {}> {

  componentDidMount() {
    this.props.observe();
  }

  render() {
    const { onClick, web3 } = this.props;
    const canFetchAddress = web3.available && web3.unlocked;
    const tooltip = canFetchAddress
      ? 'Import from MetaMask'
      : !web3.available ? 'Web3 is unavailable' : 'Your wallet is locked';

    return (
      <Tooltip text={tooltip}>
        <Button
          disabled={!canFetchAddress}
          className={style.button}
          size="small"
          color="metaPending"
          onClick={onClick}
        >
          <img className={style.metamask} src={MetaFox} />
        </Button>
      </Tooltip>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyFromMM);

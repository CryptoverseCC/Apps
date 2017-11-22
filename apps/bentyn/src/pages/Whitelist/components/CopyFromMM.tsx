import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {returntypeof } from 'react-redux-typescript';

import Tooltip from '@linkexchange/components/src/Tooltip';
import Button from '@linkexchange/components/src/NewButton';
import Web3StateProvider from '@linkexchange/web3-state-provider';

import MetaFox from '../../../../images/metafox.png';

import * as style from './copyFromMM.scss';

interface IProps {
  onClick(): void;
}

const CopyFromMM = ({ onClick }: IProps) => (
  <Web3StateProvider
    render={({ enabled, reason }) => (
      <Tooltip text={reason}>
        <Button
          disabled={!enabled}
          className={style.button}
          size="small"
          color="metaPending"
          onClick={onClick}
        >
          <img className={style.metamask} src={MetaFox} />
        </Button>
      </Tooltip>
    )}
  />
);

export default CopyFromMM;

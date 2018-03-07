import React, { Component } from 'react';

import Tooltip from '@linkexchange/components/src/Tooltip';
import Button from '@linkexchange/components/src/NewButton';
import { withInjectedWeb3AndWeb3State } from '@linkexchange/web3-state-provider';

import MetaFox from '@linkexchange/images/metafox.png';

import * as style from './copyFromMM.scss';

interface IProps {
  onClick(): void;
  web3State: {
    enabled: boolean;
    reason?: string;
  };
  className?: string;
}

export const CopyFromMM = ({ onClick, web3State, className }: IProps) => {
  const enabled = web3State.enabled || (web3State.reason && web3State.reason.startsWith('You have to switch to'));
  const reason = !enabled ? web3State.reason : '';
  return (
    <Tooltip text={reason} className={className}>
      <Button
        disabled={!enabled}
        rounded={false}
        className={style.button}
        size="small"
        color="metaPending"
        onClick={onClick}
      >
        <img className={style.metamask} src={MetaFox} />
      </Button>
    </Tooltip>
  );
};

export default withInjectedWeb3AndWeb3State(CopyFromMM);

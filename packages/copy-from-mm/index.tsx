import React, { Component } from 'react';

import Tooltip from '@linkexchange/components/src/Tooltip';
import Button from '@linkexchange/components/src/NewButton';
import { withInjectedWeb3AndWeb3State } from '@linkexchange/web3-state-provider';

import MetaFox from '@linkexchange/images/metafox.png';

import * as style from './copyFromMM.scss';
import { inject, observer } from 'mobx-react';
import { IWeb3Store } from '@linkexchange/web3-store';

interface IProps {
  onClick(): void;
  enabled?: boolean;
  reason?: string;
  className?: string;
}

export const CopyFromMM = inject(({ web3Store }: { web3Store?: IWeb3Store }, nextProps: IProps) => ({
  enabled: (web3Store && web3Store.unlocked) || nextProps.enabled,
  reason: (web3Store && !web3Store.reason) || nextProps.reason,
}))(
  observer(({ onClick, enabled, reason, className }: IProps) => (
    <Tooltip text={enabled ? '' : reason} className={className}>
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
  )),
);

export default CopyFromMM;

import React from 'react';
import { inject, observer } from 'mobx-react';

import Web3Store from '@linkexchange/web3-store';
import BoostLinkComponent from '@linkexchange/boost-link';
import Tooltip from '@linkexchange/components/src/Tooltip';
import { ILink, IRemoteLink } from '@linkexchange/types/link';

interface IProps {
  link: ILink | IRemoteLink;
  render: (state: { enabled: boolean; reason?: string }) => JSX.Element;
  web3Store?: Web3Store;
}

const BoostLink = ({ web3Store, render, link }: IProps) => {
  const children = render({ enabled: !web3Store.reason, reason: web3Store.reason });
  if (!web3Store.reason) {
    return <BoostLinkComponent link={link}>{children}</BoostLinkComponent>;
  }

  return <Tooltip text={web3Store.reason}>{children}</Tooltip>;
};

export default inject('web3Store')(observer(BoostLink));

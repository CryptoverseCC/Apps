import React from 'react';
import classnames from 'classnames';

import Pill from '@userfeeds/apps-components/src/Pill';

import { TViewType } from '../';

import * as style from './sideMenu.scss';

interface ISideMenuProps {
  slots: number;
  whitelistedLinksCount: number;
  allLinksCount: number;
  hasWhitelist: boolean;
  activeItem: TViewType;
  onItemClick(name: TViewType): void;
  className?: string;
}
const SideMenuItem = ({ active, onClick, children }) => (
  <li onClick={onClick} className={active ? style.active : null}>
    <div className={style.Ball} />
    <div className={style.SideMenuItemContent}>{children}</div>
  </li>
);

const SideMenu = ({
  activeItem,
  onItemClick,
  hasWhitelist,
  slots,
  whitelistedLinksCount,
  allLinksCount,
  className,
}: ISideMenuProps) => {
  const notify = (name: TViewType) => (event) => {
    onItemClick(name);
    event.stopPropagation();
  };

  return (
    <ul className={classnames(style.SideMenu, className)}>
      <SideMenuItem onClick={notify('Links.Slots')} active={activeItem === 'Links.Slots'}>
        <span className={style.SideMenuItemText}>Slots</span>
        <Pill style={{ marginLeft: '10px' }}>{slots}</Pill>
      </SideMenuItem>
      <SideMenuItem onClick={notify('Links.Whitelist')} active={activeItem === 'Links.Whitelist'}>
        <span className={style.SideMenuItemText}>Whitelist</span>
        <Pill style={{ marginLeft: '10px' }}>{whitelistedLinksCount}</Pill>
      </SideMenuItem>
      <SideMenuItem onClick={notify('Specification')} active={activeItem === 'Specification'}>
        <span className={style.SideMenuItemText}>Specification</span>
      </SideMenuItem>
      <SideMenuItem onClick={notify('Userfeed')} active={activeItem === 'Userfeed'}>
        <span className={style.SideMenuItemText}>Userfeed</span>
      </SideMenuItem>
    </ul>
  );
};

export default SideMenu;

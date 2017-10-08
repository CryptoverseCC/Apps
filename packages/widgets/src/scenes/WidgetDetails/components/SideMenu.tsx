import React from 'react';

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
}

const SideMenu = ({ activeItem, onItemClick, hasWhitelist, slots,
  whitelistedLinksCount, allLinksCount }: ISideMenuProps) => {
  const notify = (name: TViewType) => (event) => {
    onItemClick(name);
    event.stopPropagation();
  };

  return (
    <ul className={style.self}>
      <li
        className={activeItem === 'Links.Slots' ? style.active : ''}
        onClick={notify('Links.Slots')}
      >
        Slots <Pill>{slots}</Pill>
      </li>
      <li
        className={activeItem === 'Links.Whitelist' ? style.active : ''}
        onClick={notify('Links.Whitelist')}
      >
        Whitelist <Pill>{whitelistedLinksCount}</Pill>
      </li>
      {!hasWhitelist && (
        <li
          className={activeItem === 'Links.Algorithm' ? style.active : ''}
          onClick={notify('Links.Algorithm')}
        >
          Algorithm <Pill>{allLinksCount}</Pill>
        </li>
      )}
      <li
        className={activeItem === 'Specification' ? style.active : ''}
        onClick={notify('Specification')}
      >
        Widget Specification
      </li>
      <li
        className={activeItem === 'Userfeed' ? style.active : ''}
        onClick={notify('Userfeed')}
      >
        Userfeed
      </li>
    </ul>
  );
};

export default SideMenu;

import { h } from 'preact';

import { TViewType } from '../';

import Pill from '../../../components/Pill';

import * as style from './sideMenu.scss';

interface ISideMenuProps {
  slots: number;
  whitelistedLinksCount: number;
  allLinksCount: number;
  activeItem: TViewType;
  hasWhitelist: boolean;
  onItemClick(name: TViewType): void;
}

const SideMenu = ({ activeItem, onItemClick, hasWhitelist, slots, whitelistedLinksCount, allLinksCount }: ISideMenuProps) => {
  const notify = (name: TViewType) => (event: MouseEvent) => {
    onItemClick(name);
    event.stopImmediatePropagation();
  };

  return (
    <ul class={style.self}>
      <ul class={style.subMenu}>
        <li
          class={activeItem === 'Links.Slots' ? style.active : ''}
          onClick={notify('Links.Slots')}
        >
          Slots <Pill>{slots}</Pill>
        </li>
        <li
          class={activeItem === 'Links.Whitelist' ? style.active : ''}
          onClick={notify('Links.Whitelist')}
        >
          Whitelist <Pill>{whitelistedLinksCount}</Pill>
        </li>
        { !hasWhitelist && (
          <li
            class={activeItem === 'Links.Algorithm' ? style.active : ''}
            onClick={notify('Links.Algorithm')}
          >
            Algorithm <Pill>{allLinksCount}</Pill>
          </li>
        )}
      </ul>
      <li
        class={activeItem === 'Specification' ? style.active : ''}
        onClick={notify('Specification')}
      >
        Widget Specification
      </li>
      <li
        class={activeItem === 'Userfeed' ? style.active : ''}
        onClick={notify('Userfeed')}
      >
        Userfeed
      </li>
    </ul>
  );
};

export default SideMenu;

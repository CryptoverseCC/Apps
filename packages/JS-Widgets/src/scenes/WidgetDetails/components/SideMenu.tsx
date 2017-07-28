import { h } from 'preact';

import { ViewType } from '../';
import Pill from '../../../components/Pill';

import * as style from './sideMenu.scss';

interface ISideMenuProps {
  slots: number;
  whitelistedLinksCount: number;
  allLinksCount: number;
  activeItem: ViewType;
  onItemClick(name: ViewType): void;
}

const SideMenu = ({ activeItem, onItemClick, slots, whitelistedLinksCount, allLinksCount }: ISideMenuProps) => {
  const notify = (name: ViewType) => (event: MouseEvent) => {
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
        <li
          class={activeItem === 'Links.Algorithm' ? style.active : ''}
          onClick={notify('Links.Algorithm')}
        >
          Algorithm <Pill>{allLinksCount}</Pill>
        </li>
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

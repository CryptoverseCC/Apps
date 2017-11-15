import React from 'react';
import classnames from 'classnames';

import Pill from '@linkexchange/components/src/Pill';

import { TViewType } from '../';

import * as style from './sideMenu.scss';

export const SideMenuItemText = ({
  className,
  ...props,
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={classnames(style.SideMenuItemText, className)} {...props} />
);

export const SideMenuItem = ({
  active,
  onItemClick,
  children,
}: React.HTMLAttributes<HTMLLIElement> & {
  active?: boolean;
  name: string;
  onItemClick?: () => void;
}) => (
  <li onClick={onItemClick} className={active ? style.active : undefined}>
    <div className={style.Ball} />
    <div className={style.SideMenuItemContent}>{children}</div>
  </li>
);

const SideMenu = ({ activeItem, onItemClick, className, children }) => {
  const notify = (name: TViewType) => (event) => {
    onItemClick(name);
    event.stopPropagation();
  };

  const decoratedChildren = React.Children.map(children, (child: React.ReactElement<any>) =>
    React.cloneElement(child, {
      active: activeItem === child.props.name,
      onItemClick: notify(child.props.name),
    }),
  );

  return <ul className={classnames(style.SideMenu, className)}>{decoratedChildren}</ul>;
};

export default SideMenu;

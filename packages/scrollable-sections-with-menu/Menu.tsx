import React, { Component, Children } from 'react';
import classnames from 'classnames/bind';

import { isType } from '@linkexchange/utils';

import * as style from './menu.scss';

const cx = classnames.bind(style);

interface IMenuItemProps {
  active?: boolean;
  displayName?: string;
  onClick?: () => void;
}

export const MenuItem: React.SFC<IMenuItemProps> = ({
  children,
  onClick,
  active,
}) => {
  return (
    <li className={cx({ active })} onClick={onClick}>
      <div className={style.Ball} />
      <div className={style.SideMenuItemContent}>{children}</div>
    </li>
  );
};

MenuItem.defaultProps = {
  displayName: 'MenuItem',
};

interface IMenuProps {
  className?: string;
  style?: React.CSSProperties;
  activeSection?: number;
  onItemClick?: (index: number) => void;
}

export default class Menu extends Component<IMenuProps, {}> {
  static defaultProps = {
    displayName: 'Menu',
  };

  render() {
    const decoratedChildren = Children.map(
      this.props.children,
      (child, index) => {
        if (isType(child, 'MenuItem')) {
          return React.cloneElement(child, {
            onClick: () => this.props.onItemClick!(index)!,
            active: index === this.props.activeSection,
          });
        }

        return child;
      },
    );
    return (
      <ul
        style={this.props.style}
        className={classnames(style.SideMenu, this.props.className)}
      >
        {decoratedChildren}
      </ul>
    );
  }
}

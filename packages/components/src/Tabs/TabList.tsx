import React from 'react';
import * as classnames from 'classnames/bind';

import * as style from './tabList.scss';
const cx = classnames.bind(style);

interface ITabListProps {
  class?: string;
  selectedTabClass?: string;
  selectedTab: string;
  tabsNames: string[];
  onTabClick(name: string): void;
}

const TabList = ({ className, selectedTabClass, selectedTab, tabsNames, onTabClick }: ITabListProps) => (
  <ul className={cx('self', className)}>
    {tabsNames.map((name) => (
      <li
        className={cx('item', {
          selected: name === selectedTab && !selectedTabClass,
          [selectedTabClass || '']: name === selectedTab,
        })}
        onClick={onTabClick.bind(null, name)
        }
      >
        {name}
      </li>
    ))}
  </ul>
);

export default TabList;

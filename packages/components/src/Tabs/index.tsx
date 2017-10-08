import React, { Component } from 'react';
import classnames from 'classnames';

import TabList from './TabList';

interface ITabsProps {
  className?: string;
  tabListClass?: string;
  selectedTabClass?: string;
  // tabs: { [key: string]: FunctionalComponent<void> };
  tabs: any;
}

interface ITabsState {
  activeTab: string;
}

export default class Tabs extends Component<ITabsProps, ITabsState> {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: Object.keys(props.tabs)[0],
    };
  }

  render() {
    return (
      <div className={classnames(this.props.class)}>
        <TabList
          className={this.props.tabListClass}
          selectedTabClass={this.props.selectedTabClass}
          selectedTab={this.state.activeTab}
          tabsNames={Object.keys(this.props.tabs)}
          onTabClick={this._onTabClick}
        />
        <div>
          {this.props.tabs[this.state.activeTab]()}
        </div>
      </div>
    );
  }

  _onTabClick = (tabName: string) => {
    this.setState({ activeTab: tabName });
  }
}

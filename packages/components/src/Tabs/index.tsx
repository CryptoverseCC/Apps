import React, { Component } from 'react';
import * as classnames from 'classnames';

import TabList from './TabList';

interface ITabsProps {
  class?: string;
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
      <div class={classnames(this.props.class)}>
        <TabList
          class={this.props.tabListClass}
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

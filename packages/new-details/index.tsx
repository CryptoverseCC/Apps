import React, { Component } from 'react';
import { Provider } from 'mobx-react';

import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';

import LinksStore from './linksStore';

interface IProps {
  className?: string;
  widgetSettings: WidgetSettings;
}

class DetailsComponent extends Component<IProps> {
  linkStore: LinksStore;

  constructor(props: IProps) {
    super(props);
    this.linkStore = new LinksStore(props.widgetSettings);
    this.linkStore.fetchLinks();
  }

  render() {
    return (
      <Provider links={this.linkStore}>
        <div className={this.props.className}>{this.props.children}</div>
      </Provider>
    );
  }
}

export const Details = withWidgetSettings(DetailsComponent);

export { default as AddLinkButton } from './containers/AddLinkButton';
export { default as Header } from './components/Header';
export { default as Lists } from './containers/Lists';

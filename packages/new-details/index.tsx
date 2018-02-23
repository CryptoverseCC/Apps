import React, { Component } from 'react';

import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';

import LinksStore from './linksStore';

interface IProps {
  widgetSettings: WidgetSettings;
}

class DetailsComponent extends Component<IProps> {
  linkStore: LinksStore;

  constructor(props) {
    super(props);
    this.linkStore = new LinksStore(props.widgetSettings);
    this.linkStore.fetchLinks();
  }

  render() {
    return this.props.children;
  }
}

export const Details = withWidgetSettings(DetailsComponent);

export { default as Header } from './components/Header';

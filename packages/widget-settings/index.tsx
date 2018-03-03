import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';

import { Omit } from '@linkexchange/types';
import { EWidgetSize, IWidgetSettings } from '@linkexchange/types/widget';

export class WidgetSettings implements IWidgetSettings {
  apiUrl: string;
  recipientAddress: string;
  asset: string;
  algorithm: string;
  size: EWidgetSize;
  whitelist: string;
  slots: number;
  timeslot: number;
  minimalLinkFee?: string;
  contactMethod?: string;
  title: string;
  description: string;
  impression: string;
  location: string;
  tillDate: string;

  constructor(initialState: IWidgetSettings) {
    extendObservable(this, initialState);
  }
}

interface IProps {
  widgetSettings: IWidgetSettings;
}

export class WidgetSettingsProvider extends PureComponent<IProps> {
  static childContextTypes = {
    widgetSettings: PropTypes.object,
  };
  store: WidgetSettings;

  constructor(props) {
    super(props);
    this.store = new WidgetSettings(props.widgetSettings);
  }

  getChildContext() {
    return { widgetSettings: this.store };
  }

  render() {
    return this.props.children;
  }
}

export const withWidgetSettings = <T extends { widgetSettings: WidgetSettings }>(Cmp: React.ComponentType<T>) => {
  const DecoratedComponent = observer(Cmp);

  return class extends Component<Omit<T, 'widgetSettings'>> {
    static contextTypes = {
      widgetSettings: PropTypes.object,
    };

    static displayName = `withWidgetSettings(${Cmp.displayName || Cmp.name})`;

    render() {
      if (!this.context.widgetSettings) {
        throw Error(`Couldn't find widgetSettings`);
      }
      return <DecoratedComponent widgetSettings={this.context.widgetSettings} {...this.props} />;
    }
  };
};

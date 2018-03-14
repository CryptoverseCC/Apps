import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { extendObservable, computed, action } from 'mobx';
import { observer } from 'mobx-react';

import { Omit } from '@linkexchange/types';
import { EWidgetSize, IWidgetSettings } from '@linkexchange/types/widget';
import { urlWithoutQueryIfLinkExchangeApp } from '../utils/locationWithoutQueryParamsIfLinkExchangeApp';

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

  @action.bound
  changeAssetTo(asset: string) {
    this.asset = asset;
  }

  @action.bound
  changeRecipientAddress(recipientAddress: string) {
    this.recipientAddress = recipientAddress;
  }

  @action.bound
  changeWhitelist(whitelist: string) {
    this.whitelist = whitelist;
  }

  @computed
  get widgetLocation() {
    return this.location || urlWithoutQueryIfLinkExchangeApp();
  }

  @computed
  get tokenAddress() {
    return this.asset.split(':')[1];
  }

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

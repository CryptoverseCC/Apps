import React from 'react';
import { extendObservable, computed, action } from 'mobx';

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

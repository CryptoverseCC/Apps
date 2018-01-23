import '@webcomponents/custom-elements';

import { render } from 'react-dom';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { EWidgetSize } from '@linkexchange/types/widget';

import { IRootState } from './ducks';
import Banner from './Banner';

import * as style from './styles/all.scss';

if (process.env.NODE_ENV !== 'development') {
  console.info(`Loaded @linkexchange/widgets@${VERSION}`);
}

class LinkexchangeLink extends HTMLElement {
  static get observedAttributes() {
    return [
      'api-url',
      'recipient-address',
      'asset',
      'algorithm',
      'size',
      'whitelist',
      'contact-method',
      'slots',
      'translations',
      'translations-url',
    ];
  }

  connected = false;
  customMessages = {};

  connectedCallback() {
    this.connected = true;
    this.innerHTML = `<div class="${style.root}"></div>`;

    this._render();
  }

  disconnectedCallback() {
    this.connected = false;
  }

  attributeChangedCallback(attr, _oldValue, newValue) {
    if (attr === 'translations-url') {
      this._fetchTranslationsFile(newValue);
    } else if (attr === 'translations') {
      this._setTranslationsFromWindow(newValue);
    }

    this._render();
  }

  _render() {
    if (!this.connected) {
      return;
    }

    render(
      <IntlProvider locale="en" messages={{ ...this.customMessages }}>
        <Banner widgetSettings={this._argsToState()} />
      </IntlProvider>,
      this.querySelector(`.${style.root}`),
    );
  }

  _argsToState() {
    const apiUrl = this.getAttribute('api-url') || 'https://api.userfeeds.io';
    const size = this.getAttribute('size') === 'rectangle' ? EWidgetSize.rectangle : EWidgetSize.leaderboard;
    const timeslot = parseInt(this.getAttribute('timeslot') || '5', 10);
    const recipientAddress = this.getAttribute('recipient-address') || this._throwErrorRecipientAddressNotDefined();
    const whitelist = this.getAttribute('whitelist') || undefined;
    const asset = this.getAttribute('asset') || 'ropsten';
    const slots = parseInt(this.getAttribute('slots') || '10', 10);
    const algorithm = this.getAttribute('algorithm') || 'links';
    const contactMethod = this.getAttribute('contact-method') || undefined;
    const title = this.getAttribute('widget-title') || undefined;
    const description = this.getAttribute('description') || undefined;
    const impression = this.getAttribute('impression') || undefined;
    const tillDate = this.getAttribute('till-date') || undefined;

    return {
      apiUrl,
      algorithm,
      recipientAddress: recipientAddress.toLowerCase(),
      asset: asset.toLowerCase(),
      contactMethod,
      size,
      timeslot,
      whitelist: whitelist ? whitelist.toLowerCase() : whitelist,
      slots,
      title,
      description,
      impression,
      tillDate,
    };
  }

  async _fetchTranslationsFile(url: string) {
    try {
      this.customMessages = await fetch(url).then((res) => res.json());
    } catch (e) {
      console.info('Something went wrong when fetching translations file');
    }

    this._render();
  }

  _setTranslationsFromWindow(key: string) {
    if (typeof window[key] === 'object') {
      this.customMessages = window[key];
    }
  }

  _throwErrorRecipientAddressNotDefined(): never {
    throw new Error('recipient-address not defined.');
  }
}

window.customElements.define('linkexchange-link', LinkexchangeLink);

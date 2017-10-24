import '@webcomponents/custom-elements';

import { render } from 'react-dom';
import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';

import { EWidgetSize } from './types';
import getStore from './store';
import { IRootState } from './ducks';
import { updateWidgetSettings } from './ducks/widget';

import Banner from './scenes/Banner';

import * as style from './styles/all.scss';

if (process.env.NODE_ENV !== 'development') {
  console.info(`Loaded @linkexchange/widgets@${VERSION}`);
}

class LinkexchangeLink extends HTMLElement {

  static get observedAttributes() {
    return ['api-url', 'recipient-address', 'asset', 'algorithm', 'size', 'whitelist', 'contact-method', 'slots'];
  }

  storeInstance: Store<IRootState>;

  connectedCallback() {
    this._renderComponent();
  }

  attributeChangedCallback(_attr, _oldValue, _newValue) {
    if (this.storeInstance) {
      this._updateStore();
    }
  }

  _renderComponent() {
    this.innerHTML = `<div class="${style.root}"></div>`;
    this.storeInstance = getStore({
      ...this._argsToState(),
      location: window.location.href,
    });

    render((
      <Provider store={this.storeInstance}>
        <Banner />
      </Provider>), this.querySelector(`.${style.root}`));

    // if (process.env.NODE_ENV === 'development' && module.hot) {
    //   module.hot.accept('./banner', () => requestAnimationFrame(init));
    // }
  }

  _updateStore() {
    this.storeInstance.dispatch(updateWidgetSettings(this._argsToState()));
  }

  _argsToState() {
    const apiUrl = this.getAttribute('api-url') || 'https://api.userfeeds.io';
    const size = this.getAttribute('size') === 'rectangle'
      ? EWidgetSize.rectangle
      : EWidgetSize.leaderboard;
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

  _throwErrorRecipientAddressNotDefined(): never {
    throw new Error('recipient-address not defined.');
  }
}

window.customElements.define('linkexchange-link', LinkexchangeLink);

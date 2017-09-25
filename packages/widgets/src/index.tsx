import '@webcomponents/custom-elements';

import { h, render } from 'preact';
import { Provider } from 'preact-redux';

import getStore from './store';
import { updateWidgetSettings } from './ducks/widget';

import Banner from './scenes/Banner';

import * as style from './styles/all.scss';

if (process.env.NODE_ENV !== 'development') {
  console.info(`Loaded @linkexchange/widgets@${VERSION}`);
}

class LinkexchangeLink extends HTMLElement {

  static get observedAttributes() {
    return ['recipient-address', 'algorithm', 'size', 'whitelist', 'contact-method', 'slots'];
  }

  instance: Element;
  storeInstance: { dispatch(any): void; };

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

    this.instance = render((
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
    const size = this.getAttribute('size') || 'rectangle';
    const timeslot = this.getAttribute('timeslot') || 5;
    const recipientAddress = this.getAttribute('recipient-address');
    const whitelist = this.getAttribute('whitelist');
    const asset = this.getAttribute('asset');
    const slots = this.getAttribute('slots') || 10;
    const algorithm = this.getAttribute('algorithm');
    const contactMethod = this.getAttribute('contact-method');
    const publisherNote = this.getAttribute('publisher-note');
    const title = this.getAttribute('widget-title');
    const description = this.getAttribute('description');
    const impression = this.getAttribute('impression');
    const tillDate = this.getAttribute('till-date');

    return {
      algorithm,
      recipientAddress,
      asset,
      publisherNote,
      contactMethod,
      size,
      timeslot,
      whitelist,
      slots,
      title,
      description,
      impression,
      tillDate,
    };
  }
}

window.customElements.define('linkexchange-link', LinkexchangeLink);

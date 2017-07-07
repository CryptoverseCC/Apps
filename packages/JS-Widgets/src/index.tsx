import '@webcomponents/custom-elements';
import { h, render } from 'preact';
import { Provider } from 'preact-redux';

import getStore from './store';

import Banner from './banner';

import './styles/all.scss';

const positiveValueOrUndefined = (value: string) => value || undefined;

class UserfeedsLink extends HTMLElement {

  static get observedAttributes() {
    return ['context', 'algorithm', 'size', 'whitelist', 'publisher-note'];
  }

  instance: Element;

  connectedCallback() {
    this._renderComponent();
  }

  attributeChangedCallback(_attr, _oldValue, _newValue) {
    if (this.instance) {
      this._renderComponent();
    }
  }

  _renderComponent() {
    const size = this.getAttribute('size') || 'rectangle';
    const timeslot = this.getAttribute('timeslot') || 5;
    const context = this.getAttribute('context');
    const whitelist = this.getAttribute('whitelist');
    const algorithm = this.getAttribute('algorithm');
    const publisherNote = this.getAttribute('publisher-note');

    this.innerHTML = '';

    const initialState = {
      algorithm,
      context,
      publisherNote,
      size,
      timeslot,
      whitelist,
    };

    this.instance = render((
      <Provider store={getStore(initialState)}>
        <Banner />
      </Provider>), this);
  }
}

window.customElements.define('userfeeds-link', UserfeedsLink);

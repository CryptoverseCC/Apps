import '@webcomponents/custom-elements';
import { h, render } from 'preact';
import { Provider } from 'preact-redux';

import getStore from './store';

import Banner from './scenes/Banner';

import './styles/all.scss';

const positiveValueOrUndefined = (value: string) => value || undefined;

class UserfeedsLink extends HTMLElement {

  static get observedAttributes() {
    return ['context', 'algorithm', 'size', 'whitelist', 'publisher-note', 'slots'];
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
    const slots = this.getAttribute('slots') || 10;
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
      slots,
    };

    const store = getStore(initialState);
    const init = () => {
      this.instance = render((
        <Provider store={store}>
          <Banner />
        </Provider>), this, this.instance);
    };

    // if (process.env.NODE_ENV === 'development' && module.hot) {
    //   module.hot.accept('./banner', () => requestAnimationFrame(init));
    // }

    init();
  }
}

window.customElements.define('userfeeds-link', UserfeedsLink);

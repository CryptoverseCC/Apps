import '@webcomponents/custom-elements';

import { h, render } from 'preact';
import { Provider } from 'preact-redux';

import getStore from './store';
import { updateWidgetSettings } from './actions/widget';

import Banner from './scenes/Banner';

import './styles/all.scss';

const positiveValueOrUndefined = (value: string) => value || undefined;

class UserfeedsLink extends HTMLElement {

  static get observedAttributes() {
    return ['context', 'algorithm', 'size', 'whitelist', 'contact-method', 'slots'];
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
    // Only in version 0.0.57 for demo purpose
    // const shadowRoot = this.attachShadow({ mode: 'open' });
    // shadowRoot.innerHTML = `
    //   <style>@import "https://cdn.jsdelivr.net/npm/@userfeeds/widgets@0.0.57/build/styles.css";</style>
    //   <div id="root"></div>
    // `;
    // </Provider>), shadowRoot.querySelector('#root'));

    this.storeInstance = getStore(this._argsToState());

    this.instance = render((
      <Provider store={this.storeInstance}>
        <Banner />
      </Provider>), this);

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
    const context = this.getAttribute('context');
    const whitelist = this.getAttribute('whitelist');
    const slots = this.getAttribute('slots') || 10;
    const algorithm = this.getAttribute('algorithm');
    const publisherNote = this.getAttribute('contact-method');
    const title = this.getAttribute('title');
    const description = this.getAttribute('description');
    const impression = this.getAttribute('impression');

    return {
      algorithm,
      context,
      publisherNote,
      size,
      timeslot,
      whitelist,
      slots,
      title,
      description,
      impression,
    };
  }
}

window.customElements.define('userfeeds-link', UserfeedsLink);

import '@webcomponents/custom-elements';

import './styles/all.scss';

import { h, render } from 'preact';

import Banner from './banner';

const positiveValueOrUndefined = (value) => value || undefined;

class UserfeedsAd extends HTMLElement {

  static get observedAttributes() {
    return ['context', 'algorithm', 'size'];
  }

  connectedCallback() {
    this._renderComponent();
  }

  attributeChangedCallback(_attr, _oldValue, _newValue) {
    if (this.instance) {
      this._renderComponent();
    }
  }

  _renderComponent() {
    const size = this.getAttribute('size');
    const context = this.getAttribute('context');
    const algorithm = this.getAttribute('algorithm');

    this.innerHTML = '';
    this.instance = render(
      <Banner
        size={positiveValueOrUndefined(size)}
        context={positiveValueOrUndefined(context)}
        algorithm={positiveValueOrUndefined(algorithm)}
      />, this);
  }
}

window.customElements.define('userfeeds-ad', UserfeedsAd);

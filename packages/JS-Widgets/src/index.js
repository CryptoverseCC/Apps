import '@webcomponents/custom-elements';

import { h, render } from 'preact';

import Banner from './banner';

const positiveValueOrUndefined = (value) => value || undefined;

class UserfeedsAd extends HTMLElement {

  static get observedAttributes() {
    return ['context', 'algorithm', 'api-key', 'size'];
  }

  connectedCallback() {
    const context = this.getAttribute('context');
    const algorithm = this.getAttribute('algorithm');
    const apiKey = this.getAttribute('api-key');
    const size = this.getAttribute('size');

    render(
      <Banner
        size={positiveValueOrUndefined(size)}
        context={positiveValueOrUndefined(context)}
        algorithm={positiveValueOrUndefined(algorithm)}
        apiKey={positiveValueOrUndefined(apiKey)}
      />, this);
  }

  attributeChangedCallback(_attr, _oldValue, _newValue) { }

}

window.customElements.define('userfeeds-ad', UserfeedsAd);

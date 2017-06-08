import '@webcomponents/custom-elements';

import { h, render } from 'preact';

import Banner from './banner';

class UserfeedsAd extends HTMLElement {

  static get observedAttributes() {
    return ['context', 'algorithm', 'api-key'];
  }

  connectedCallback() {
    const context = this.getAttribute('context');
    const algorithm = this.getAttribute('algorithm');
    const apiKey = this.getAttribute('api-key');

    render(<Banner context={context} algorithm={algorithm} apiKey={apiKey} />, this);
  }

  attributeChangedCallback(attr, oldValue, newValue) { }
}

window.customElements.define('userfeeds-ad', UserfeedsAd);

import { h, render } from 'preact';

import App from './App';

import './index.scss';

const root = document.querySelector('.root');

if (root) {
  render(<App />, root);
}

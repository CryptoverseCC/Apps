import { h, render } from 'preact';
import App from './App';
import 'normalize.css';

import '../styles/all.scss';

const root = document.querySelector('.root');

if (root) {
  render(<App />, root);
}

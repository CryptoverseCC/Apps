import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import * as qs from 'qs';

import getStore from './store';
import App from './App';

import '../styles/all.scss';

const root = document.querySelector('.root');

const [, searchParams] = document.location.href.split('?');
const store = getStore(qs.parse(searchParams));

if (root) {
  render((
    <Provider store={store}>
      <App />
    </Provider>),
    root);
}

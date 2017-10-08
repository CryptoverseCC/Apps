import render from 'react-dom'
import React from 'react';
import 'normalize.css';

import App from './App';
import '../styles/all.scss';

const root = document.querySelector('.root');

if (root) {
  render(<App />, root);
}

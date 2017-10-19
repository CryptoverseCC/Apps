import { render } from 'react-dom';
import React from 'react';
import 'normalize.css';

import App from './App';
import '../styles/all.scss';

render(
  <App />,
  document.querySelector('.root'),
  () => {
    if (process.env.NODE_ENV !== 'development' && typeof window.Intercom !== 'undefined') {
      window.Intercom('boot', { app_id: 'xdam3he4' });
    }
  },
);

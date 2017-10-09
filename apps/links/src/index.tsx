import { render } from 'react-dom';
import React from 'react';
import 'normalize.css';

import App from './App';
import '../styles/all.scss';

render(<App />, document.querySelector('.root'));

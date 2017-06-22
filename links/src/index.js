import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';

import './index.scss';

injectTapEventPlugin();

ReactDOM.render(<App />, document.querySelector('.root'));


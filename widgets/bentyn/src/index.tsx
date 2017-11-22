import { render } from 'react-dom';
import React from 'react';
import qs from 'qs';

import App from './App';

import './styles/all.scss';

const [, searchParams] = document.location.href.split('?');

const widgetSettings = qs.parse(searchParams);

render(<App widgetSettings={widgetSettings} />, document.querySelector('.root'));

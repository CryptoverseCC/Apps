import React, { Component } from 'react';
import queryString from 'query-string';

import './Details.css';

export default class Configurator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      widgetSettings: queryString.parse(window.location.search),
    };
  }

  render() {
    let [network, userfeedId] = this.state.widgetSettings.context.split(':');

    return (
      <div>
        <h1>Widget Details:</h1>
        <ul>
          <li><span>Network: {network}</span></li>
          <li><span>UserfeedID: {userfeedId}</span></li>
          <li><span>Algorithm: {this.state.widgetSettings.algorithm}</span></li>
          <li><span>Whitelist: {this.state.widgetSettings.whitelist}</span></li>
        </ul>
      </div>
    );
  }
}

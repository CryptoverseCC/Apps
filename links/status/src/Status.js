import React, { Component } from 'react';
import queryString from 'query-string';

import './Status.css';

export default class Status extends Component {

  constructor(props) {
    super(props);

    this.state = queryString.parse(window.location.search);
  }

  render() {
    let [network, userfeedId] = this.state.widgetcontext.split(':');

    return (
      <div>
        <h1>Widget Details:</h1>
        <ul>
          <li><span>Network: {network}</span></li>
          <li><span>UserfeedID: {userfeedId}</span></li>
          <li><span>Algorithm: {this.state.widgetalgorithm}</span></li>
          <li><span>Whitelist: {this.state.widgetwhitelist}</span></li>
        </ul>
        Publisher message:
        <p>{this.state.widgetmessage}</p>

        <h1>Link Details:</h1>
        ...
      </div>
    );
  }
}

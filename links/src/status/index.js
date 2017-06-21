import React, { Component } from 'react';

import style from './index.scss';

export default class Status extends Component {

  constructor(props) {
    super(props);
    const params = (new URL(document.location)).searchParams;

    this.state = {
      widgetcontext: params.get('widgetcontext'),
      widgetmessage: params.get('widgetmessage'),
      widgetwhitelist: params.get('widgetwhitelist'),
    };
  }

  render() {
    const [network, userfeedId] = this.state.widgetcontext.split(':');

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

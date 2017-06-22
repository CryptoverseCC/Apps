import React, { Component } from 'react';

import style from './Status.scss';

export default class Status extends Component {

  constructor(props) {
    super(props);
    const params = (new URL(document.location)).searchParams;

    this.state = {
      context: params.get('context'),
      message: params.get('message'),
      algorithm: params.get('algorithm'),
      whitelist: params.get('whitelist'),
    };
  }

  render() {
    if (!this.state.context) {
      return null;
    }

    const [network, userfeedId] = this.state.context.split(':');

    return (
      <div>
        <h1>Widget Details:</h1>
        <ul>
          <li><span>Network: {network}</span></li>
          <li><span>UserfeedID: {userfeedId}</span></li>
          <li><span>Algorithm: {this.state.algorithm}</span></li>
          <li><span>Whitelist: {this.state.whitelist}</span></li>
        </ul>
        Publisher message:
        <p>{this.state.message}</p>

        <h1>Link Details:</h1>
        ...
      </div>
    );
  }
}

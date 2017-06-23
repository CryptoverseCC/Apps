import React, { Component } from 'react';

import style from './Details.scss';

export default class Details extends Component {

  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);

    this.state = {
      context: params.get('context'),
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
      <div className={style.this}>
        <h1>Widget Details:</h1>
        <ul>
          <li><span>Network: {network}</span></li>
          <li><span>UserfeedID: {userfeedId}</span></li>
          <li><span>Algorithm: {this.state.algorithm}</span></li>
          <li><span>Whitelist: {this.state.whitelist}</span></li>
        </ul>
      </div>
    );
  }
}

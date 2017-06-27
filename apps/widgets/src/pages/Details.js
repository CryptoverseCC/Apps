import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import WidgetDetails from '../components/WidgetDetails';
import LinksList from '../components/LinksList';

import style from './Details.scss';

export default class Details extends Component {

  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);

    const context = params.get('context');
    const algorithm = params.get('algorithm');
    const whitelist = params.get('whitelist');

    this.state = { fetching: true, context, algorithm, whitelist };

    const baseURL = 'https://api.userfeeds.io/ranking';

    fetch(`${baseURL}/${context}/${algorithm}/?whitelist=${whitelist}`)
      .then((res) => res.json())
      .then(({ items: links }) => {
        setTimeout(() => this.setState({ fetching: false, links }), 1000);
      });
  }

  render() {
    if (!this.state.context) {
      return null;
    }

    if (this.state.fetching) {
      return (
        <div className={style.loader}>
          <CircularProgress size={80} thickness={5} />
        </div>
      );
    }
    const { context, algorithm, whitelist, links } = this.state;

    return (
      <div className={style.this}>
        <Paper className={style.paper}>
          <WidgetDetails
            context={context}
            algorithm={algorithm}
            whitelist={whitelist}
            links={links}
          />
          <hr />
          <LinksList links={links} />
        </Paper>
      </div>
    );
  }
}

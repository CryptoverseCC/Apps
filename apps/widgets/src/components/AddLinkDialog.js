import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import core from '@userfeeds/core';

import style from './AddLinkDialog.scss';

export default class AddLinkDialog extends Component {

  state = {
    posting: false,
  };

  render() {
    const { open, onRequestClose } = this.props;

    return (
      <Dialog
        className={style.this}
        title="Add new Link"
        open={open}
        actions={this._getActions()}
        onRequestClose={onRequestClose}
      >
        <TextField
          hintText="Title"
          floatingLabelText="Title"
          className={style.input}
          ref={(ref) => this.title = ref}
        />
        <TextField
          hintText="Summary"
          floatingLabelText="Summary"
          className={style.input}
          ref={(ref) => this.summary = ref}
        />
        <TextField
          hintText="URL"
          floatingLabelText="URL"
          className={style.input}
          ref={(ref) => this.url = ref}
        />
        <TextField
          hintText="Value"
          floatingLabelText="Value"
          className={style.input}
          ref={(ref) => this.value = ref}
        />
      </Dialog>
    );
  }

  _getActions = () => {
    if (this.state.posting) {
      return [<CircularProgress />];
    }
    return [<RaisedButton label="Send" onTouchTap={this._onSend} />];
  };

  _onSend = () => {
    this.setState({ posting: true });
    const [_, address] = this.props.context.split(':');
    const target = this.url.getValue();
    const title = this.title.getValue();
    const summary = this.summary.getValue();
    const value = this.value.getValue();

    const claim = {
      type: ['link'],
      claim: { target, title, summary },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };

    core.ethereum.claims.sendClaim(address, claim, value)
      .catch((e) => console.error(e))
      .then(() => {
        this.setState({ posting: false });
        this.props.onRequestClose();
      });
  };
}

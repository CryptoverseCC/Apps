import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import Label from '@userfeeds/apps-components/src/Label';
import Dropdown from '@userfeeds/apps-components/src/Dropdown';
import RadioButtonGroup from '@userfeeds/apps-components/src/RadioButtonGroup';
import Preview from '@userfeeds/apps-components/src/Preview';
import Snippet from '@userfeeds/apps-components/src/Snippet';
import AndroidSnippet from '@userfeeds/apps-components/src/AndroidSnippet';

import style from './Configurator.scss';

const WIDGET_NETWORKS = [
  { value: 'rinkeby', label: 'Rinkeby' },
  { value: 'eth', label: 'Mainnet' },
];

const WIDGET_SIZES = [
  { value: 'leaderboard', label: 'Leaderboard (728x90)' },
  { value: 'rectangle', label: 'Medium rectangle (300x250)' },
];

const WIDGET_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image', disabled: true },
  { value: 'video', label: 'Video', disabled: true },
];

const WIDGET_TOKENS = [
  { value: 'eth', label: 'ETH Ethereum' },
];

const WIDGET_ALGORITHM = [
  { value: 'links', label: 'Ad Ether / total ether - time' },
];

export default class Configurator extends Component {

  constructor(props) {
    super(props);

    const web3 = window.web3;
    const userfeedsId = web3 && web3.eth.accounts.length > 0 ? web3.eth.accounts[0] : '';
    this.state = {
      widgetSettings: {
        userfeedsId,
        whitelistId: userfeedsId,
        publisherNote: '',
        size: WIDGET_SIZES[0].value,
        type: WIDGET_TYPES[0].value,
        token: WIDGET_TOKENS[0].value,
        network: WIDGET_NETWORKS[0].value,
        algorithm: WIDGET_ALGORITHM[0].value,
      },
    };
  }

  render() {
    return (
      <div className={style.this}>
        <Paper className={style.paper}>
          <RadioButtonGroup
            label="Widget size"
            name="widgetSize"
            onChange={this._onWidgetSizeChange}
            options={WIDGET_SIZES}
          />
          <RadioButtonGroup
            label="Widget type"
            name="widgetType"
            onChange={this._onWidgetTypeChange}
            options={WIDGET_TYPES}
          />
          <Dropdown
            label="Network"
            value={this.state.widgetSettings.network}
            onChange={this._onNetworkChange}
            options={WIDGET_NETWORKS}
          />
          <TextField
            hintText="Userfeed ID"
            floatingLabelText="Userfeed ID"
            className={style.input}
            value={this.state.widgetSettings.userfeedsId}
            onChange={this._onUserfeedIdChange}
          />
          <TextField
            hintText="Whitelist ID"
            floatingLabelText="Whitelist ID"
            className={style.input}
            value={this.state.widgetSettings.whitelistId}
            onChange={this._onWhitelistIdChange}
          />
          <TextField
            hintText="Publisher Note"
            floatingLabelText="Publisher Note"
            className={style.input}
            value={this.state.widgetSettings.publisherNote}
            onChange={this._onPublisherNoteChange}
          />
          <Dropdown
            disabled
            label="Token"
            value={WIDGET_TOKENS[0].value}
            options={WIDGET_TOKENS}
          />
          <Dropdown
            disabled
            label="Algorithm"
            value={WIDGET_ALGORITHM[0].value}
            options={WIDGET_ALGORITHM}
          />
          <Preview widgetSettings={this.state.widgetSettings} />
          <Label>Code</Label>
          <Snippet widgetSettings={this.state.widgetSettings} />
          <Label>Android</Label>
          <AndroidSnippet widgetSettings={this.state.widgetSettings} />
        </Paper>
      </div>
    );
  }

  _onNetworkChange = (_, networkId) => {
    this.setState(({ widgetSettings }) => ({
      widgetSettings: {
        ...widgetSettings,
        network: WIDGET_NETWORKS[networkId].value,
      },
    }));
  };

  _handleChange = (name) => (_, value) => {
    this.setState(({ widgetSettings }) => ({
      widgetSettings: {
        ...widgetSettings,
        [name]: value,
      },
    }));
  };

  _onWidgetTypeChange = this._handleChange('type');
  _onWidgetSizeChange = this._handleChange('size');
  _onUserfeedIdChange = this._handleChange('userfeedsId');
  _onWhitelistIdChange = this._handleChange('whitelistId');
  _onPublisherNoteChange = this._handleChange('publisherNote');
}

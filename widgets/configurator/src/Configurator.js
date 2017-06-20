import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import './Configurator.css';

import Label from './components/Label';
import Dropdown from './components/Dropdown';
import RadioButtonGroup from './components/RadioButtonGroup';
import Preview from './Preview';
import Snippet from './Snippet';

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
  { value: 'ads', label: 'Ad Ether / total ether - time' },
];

export default class Configurator extends Component {

  constructor(props) {
    super(props);

    const web3 = window.web3;
    const userfeedsId = web3 && web3.eth.accounts.length > 0 ? web3.eth.accounts[0] : '';
    this.state = {
      widgetSettings: {
        userfeedsId,
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
      <div className="Configurator-container">
        <Paper className="Configurator-paper">
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
            className="Configurator-100pro"
            value={this.state.widgetSettings.userfeedsId}
            onChange={this._onUserfeedIdChange}
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

  _onUserfeedIdChange = (_, userfeedsId) => {
    this.setState(({ widgetSettings }) => ({
      widgetSettings: {
        ...widgetSettings,
        userfeedsId,
      },
    }));
  };

  _onWidgetTypeChange = (_, type) => {
    this.setState(({ widgetSettings }) => ({
      widgetSettings: {
        ...widgetSettings,
        type,
      },
    }));
  };

  _onWidgetSizeChange = (_, size) => {
    this.setState(({ widgetSettings }) => ({
      widgetSettings: {
        ...widgetSettings,
        size,
      },
    }));
  };
}

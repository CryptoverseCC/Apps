import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

import Highlight from 'react-highlight';
import 'highlight.js/styles/androidstudio.css';

import './Configurator.css';

import RadioButtonGroup from './RadioButtonGroup';

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
  { value: 'internal', label: 'Ad Ether / total ether - time' },
];

export default class Configurator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      widgetUserfeedsId: '',
      widgetSize: WIDGET_SIZES[0].value,
      widgetType: WIDGET_TYPES[0].value,
      widgetToken: WIDGET_TOKENS[0].value,
      widgetNetwork: WIDGET_NETWORKS[0].value,
      widgetAlgorithm: WIDGET_ALGORITHM[0].value,
      widgetApiKey: '59049c8fdfed920001508e2aafdcb00bdd4c4c7d61ca02ff47080fe3',
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
          <div>
            <SelectField
              floatingLabelText="Network"
              value={this.state.widgetNetwork}
              onChange={this._onNetworkChange}
              className="Configurator-100pro"
            >
              { WIDGET_NETWORKS.map(({ label, value }) => (
                <MenuItem key={value} value={value} primaryText={label} />
              ))}
            </SelectField>
            <TextField
              hintText="Userfeed ID"
              floatingLabelText="Userfeed ID"
              className="Configurator-100pro"
              onChange={this._onUserfeedIdChange}
            />
          </div>
          <div>
            <TextField
              disabled
              hintText="Authorization token"
              floatingLabelText="Authorization token"
              value={this.state.widgetApiKey}
              className="Configurator-100pro"
            />
          </div>
          <div>
            <SelectField
              disabled
              floatingLabelText="Token"
              value={WIDGET_TOKENS[0].value}
              className="Configurator-100pro"
            >
              <MenuItem value={WIDGET_TOKENS[0].value} primaryText={WIDGET_TOKENS[0].label} />
            </SelectField>
          </div>
          <div>
            <SelectField
              disabled
              floatingLabelText="Algorithm"
              value={WIDGET_ALGORITHM[0].value}
              className="Configurator-100pro"
            >
              <MenuItem value={WIDGET_ALGORITHM[0].value} primaryText={WIDGET_ALGORITHM[0].label}/>
            </SelectField>
          </div>
          <div>
            <h3>Preview</h3>
            <userfeeds-ad
              algorithm="internal"
              context="rinkeby:0xcd73518680ab60ec2253841909d3448bc60f0665"
              api-key="59049c8fdfed920001508e2aafdcb00bdd4c4c7d61ca02ff47080fe3"
            >
            </userfeeds-ad>
          </div>
          <h3>Code</h3>
          <Highlight className='html'>
            {`
  <userfeeds-ad
    size="${this.state.widgetSize}"
    type="${this.state.widgetType}"
    context="${this.state.widgetNetwork}:${this.state.widgetUserfeedsId}"
    algorithm="${this.state.widgetAlgorithm}"
    api-key="${this.state.widgetApiKey}"
  >
  </userfeeds-ad>
  <script src="https://cdn.jsdelivr.net/npm/@userfeeds/ads"></script>
              `}
          </Highlight>
        </Paper>
      </div>
    );
  }

  _onNetworkChange = (_, widgetNetworkId) => {
    this.setState({ widgetNetwork: WIDGET_NETWORKS[widgetNetworkId].value });
  };

  _onUserfeedIdChange = (_, widgetUserfeedsId) => {
    this.setState({ widgetUserfeedsId });
  };

  _onWidgetTypeChange = (_, widgetType) => {
    this.setState({ widgetType });
  };

  _onWidgetSizeChange = (_, widgetSize) => {
    this.setState({ widgetSize });
  };
}

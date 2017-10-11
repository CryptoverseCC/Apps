import React, { Component } from 'react';
import classnames from 'classnames';
import Input from '../components/Input';
import Radio from '../components/Radio';
import { input as fieldInput } from '../components/field.scss';
import { Field, Title, Description, RadioGroup } from '../components/Field';
import { PictographRectangle, PictographLeaderboard } from '../components/Pictograph';
import CreateWidget from '../components/CreateWidget';
import NewToken, { WIDGET_NETWORKS } from '../components/sections/NewToken';

import Icon from '@userfeeds/apps-components/src/Icon';
import Dropdown from '@userfeeds/apps-components/src/Dropdown';

interface IState {
  recipientAddress: string;
  whitelistId: string;
  contactMethod: string;
  title: string;
  description: string;
  publisherNote: string;
  impression: string;
  size: string;
  type: string;
  asset: {
    token: string;
    network: string;
  };
  algorithm: string;
}

interface IProps {
  location: any;
}

const initialState = {
  publisherNote: '',
  title: '',
  description: 'I accept only links that are about science and technology. I like trains',
  contactMethod: '',
  size: 'leaderboard',
  type: 'text',
  impression: 'N/A',
  asset: {
    token: WIDGET_NETWORKS[0].tokens[0].value,
    network: WIDGET_NETWORKS[0].value,
  },
  algorithm: 'links',
};

export default class Configurator extends Component<IProps, IState> {
  constructor(props) {
    super(props);

    const web3 = window.web3;
    const recipientAddress = web3 && web3.eth.accounts.length > 0 ? web3.eth.accounts[0] : '';

    if (props.location.search) {
      const params = new URLSearchParams(props.location.search);
      const state: any = Array.from(params.entries()).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: v }),
        {},
      );
      this.state = state;
    } else {
      this.state = {
        ...initialState,
        recipientAddress,
        whitelistId: recipientAddress,
      };
    }
  }

  widgetSettings = () => {
    const settings = {
      ...this.state,
      network: this.state.asset.network,
      token: this.state.asset.token,
    };
    delete settings.asset;
    return settings;
  }

  onChange = (key) => ({ target: { value } }) => this.setState({ [key]: value });
  onOldChange = (key) => ({ value }) => this.setState({ [key]: value });

  render() {
    const { onChange, onOldChange } = this;
    const {
      recipientAddress,
      whitelistId,
      title,
      description,
      impression,
      contactMethod,
      size,
      type,
      asset,
      algorithm,
    } = this.state;
    return (
      <div>
        <h1>Create widget</h1>
        <p style={{ marginBottom: '10px' }}>
          Provide essential information to get your widget up and running!
        </p>
        <Field>
          <Title>Userfeed Address</Title>
          <Description>Add description here about userfeed address</Description>
          <Input
            type="text"
            className={fieldInput}
            value={recipientAddress}
            onChange={onChange('recipientAddress')}
          />
        </Field>
        <Field>
          <Title>Whitelist</Title>
          <Description>Add description here about whitelist identifier</Description>
          <Input
            type="text"
            className={fieldInput}
            value={whitelistId}
            onChange={onChange('whitelistId')}
          />
        </Field>
        <Field>
          <Title>Title</Title>
          <Description>Add description here about title</Description>
          <Input type="text" className={fieldInput} value={title} onChange={onChange('title')} />
        </Field>
        <Field>
          <Title>Description</Title>
          <Description>Add description here about description</Description>
          <Input
            type="text"
            className={fieldInput}
            multiline
            value={description}
            onChange={onChange('description')}
          />
        </Field>
        <Field>
          <Title>Declared Amount of Impressions</Title>
          <Description>Add description here about declared amount of impressions</Description>
          <RadioGroup
            value={impression}
            radioWidth="175px"
            onChange={onChange('impression')}
            name="impression"
          >
            <Radio value="N/A">N/A</Radio>
            <Radio value="100 - 1.000">100 - 1.000</Radio>
            <Radio value="1.001 - 10.000">1.001 - 10.000</Radio>
            <Radio value="10.001 - 100.000">10.001 - 100.000</Radio>
            <Radio value="100.001 - 1 milion">100.001 - 1 milion</Radio>
            <Radio value="1 milion - ∞">1 milion - ∞</Radio>
          </RadioGroup>
        </Field>
        <Field>
          <Title>Preferred Contact Method</Title>
          <Input
            type="text"
            className={fieldInput}
            value={contactMethod}
            onChange={onChange('contactMethod')}
          />
        </Field>
        <Field>
          <Title>Select Size</Title>
          <RadioGroup radioWidth="270px" value={size} onChange={onChange('size')} name="size">
            <Radio value="leaderboard">
              <PictographLeaderboard />
            </Radio>
            <Radio value="rectangle">
              <PictographRectangle />
            </Radio>
          </RadioGroup>
        </Field>
        <Field>
          <Title>Select Type</Title>
          <RadioGroup radioWidth="175px" value={type} onChange={onChange('type')} name="type">
            <Radio value="text">
              <span>Text</span>
              <Icon name="text" />
            </Radio>
            <Radio disabled soon>
              <span>Image</span>
              <Icon name="image" />
            </Radio>
            <Radio disabled soon>
              <span>Video</span>
              <Icon name="video" />
            </Radio>
          </RadioGroup>
        </Field>
        <Field>
          <Title>Choose token</Title>
          <Description>I think it would be nice to put here a short description</Description>
          <div className={fieldInput}>
            <NewToken
              asset={asset}
              onChange={(asset) => {
                this.setState({ asset });
              }}
            />
          </div>
        </Field>
        <Field>
          <Title>Choose algorithm</Title>
          <Description>Add description here about algorithms</Description>
          <Dropdown
            className={fieldInput}
            disabled
            placeholder="Algorithm"
            value={algorithm}
            onChange={() => null}
            options={[{ value: 'links', label: 'Ad Ether / total ether - time' }]}
          />
        </Field>
        <CreateWidget widgetSettings={this.widgetSettings()} />
      </div>
    );
  }
}

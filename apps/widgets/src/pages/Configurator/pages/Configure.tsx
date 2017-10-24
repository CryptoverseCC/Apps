import React, { Component } from 'react';
import qs from 'qs';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { History, Location } from 'history';

import { openToast } from '@linkexchange/widgets/src/ducks/toast';
import Input from '@userfeeds/apps-components/src/Form/Input';
import Radio from '@userfeeds/apps-components/src/Form/Radio';
import { input as fieldInput } from '@userfeeds/apps-components/src/Form/field.scss';
import { Field, Title, Description, RadioGroup, Error } from '@userfeeds/apps-components/src/Form/Field';
import Icon from '@userfeeds/apps-components/src/Icon';
import Dropdown from '@userfeeds/apps-components/src/Dropdown';
import web3 from '@userfeeds/utils/src/web3';
import { R, validate, validateMultipe } from '@userfeeds/utils/src/validation';
import Asset, { WIDGET_NETWORKS } from '@userfeeds/apps-components/src/Form/Asset';

import CreateWidget from '../components/CreateWidget';
import { PictographRectangle, PictographLeaderboard } from '../components/Pictograph';

interface IState {
  recipientAddress: string;
  whitelistId: string;
  contactMethod: string;
  title: string;
  description: string;
  impression: string;
  size: string;
  type: string;
  asset: {
    token: string;
    network: string;
  };
  algorithm: string;
  errors: {
    recipientAddress?: string;
    title?: string;
    description?: string;
    contactMethod?: string;
    asset?: string;
  };
}

const initialState = {
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
  errors: {},
};

const rules = {
  recipientAddress: [R.required, R.value((v) => web3.isAddress(v), 'Has to be valid eth address')],
  title: [R.required],
  description: [R.required],
  contactMethod: [R.required],
  asset: [
    R.value(({ network, token, isCustom }) => !isCustom || web3.isAddress(token), 'Has to be valid eth address'),
  ],
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ toast: openToast }, dispatch);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TProps = typeof Dispatch2Props & {
  location: Location;
  history: History;
};

class Configure extends Component<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    const injectedWeb3 = window.web3;
    const recipientAddress = injectedWeb3 && injectedWeb3.eth.accounts.length > 0 ? injectedWeb3.eth.accounts[0] : '';

    if (props.location.search) {
      const params = qs.parse(props.location.search.replace('?', ''));
      this.state = {
        ...initialState,
        ...params,
      };
    } else {
      this.state = {
        ...initialState,
        recipientAddress,
        whitelistId: recipientAddress,
      };
    }
  }

  onChange = (key) => ({ target: { value } }) => {
    this.setState({ [key]: value });
    this.validate(key, value);
  }

  onCreateClick = () => {
    if (!this.validateAll()) {
      this.props.toast('Validation error ☹');
      return;
    }

    const searchParams = qs.stringify({
      ...this.state,
      errors: null,
    }, { skipNulls: true });

    this.props.history.push({
      pathname: '/configurator/summary',
      search: searchParams,
    });
  }

  validate = (name: string, value: any) => {
    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        [name]: validate(rules[name], value),
      },
    }));
  }

  validateAll = () => {
    const errors = validateMultipe(rules, this.state);
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  render() {
    const { onChange } = this;
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
      errors,
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
          <Input type="text" value={recipientAddress} onChange={onChange('recipientAddress')} />
          {errors.recipientAddress && <Error>{errors.recipientAddress}</Error>}
        </Field>
        <Field>
          <Title>Whitelist</Title>
          <Description>Add description here about whitelist identifier</Description>
          <Input type="text" value={whitelistId} onChange={onChange('whitelistId')} />
        </Field>
        <Field>
          <Title>Title</Title>
          <Description>Add description here about title</Description>
          <Input type="text" value={title} onChange={onChange('title')} />
          {errors.title && <Error>{errors.title}</Error>}
        </Field>
        <Field>
          <Title>Description</Title>
          <Description>Add description here about description</Description>
          <Input type="text" multiline value={description} onChange={onChange('description')} />
          {errors.description && <Error>{errors.description}</Error>}
        </Field>
        <Field>
          <Title>Preferred Contact Method</Title>
          <Input type="text" value={contactMethod} onChange={onChange('contactMethod')} />
          {errors.contactMethod && <Error>{errors.contactMethod}</Error>}
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
            <Asset
              asset={asset}
              onChange={(asset) => {
                this.setState({ asset });
                this.validate('asset', asset);
              }}
            />
            {errors.asset && <Error>{errors.asset}</Error>}
          </div>
        </Field>
        <Field>
          <Title>Choose algorithm</Title>
          <Description>Add description here about algorithms</Description>
          <Dropdown
            disabled
            placeholder="Algorithm"
            value={algorithm}
            onChange={() => null}
            options={[{ value: 'links', label: 'Ad Ether / total ether - time' }]}
          />
        </Field>
        <CreateWidget onClick={this.onCreateClick} />
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Configure);

import React, { Component } from 'react';
import qs from 'qs';
import Web3 from 'web3';
import flowRight from 'lodash/flowRight';
import { isAddress } from 'web3-utils';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { History, Location } from 'history';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

import core from '@userfeeds/core/src';
import { withInjectedWeb3 } from '@linkexchange/utils/web3';
import { openToast } from '@linkexchange/toast/duck';
import Input from '@linkexchange/components/src/Form/Input';
import Radio from '@linkexchange/components/src/Form/Radio';
import { input as fieldInput } from '@linkexchange/components/src/Form/field.scss';
import { input } from '@linkexchange/components/src/Form/input.scss';
import { Field, Title, Description, RadioGroup, Error } from '@linkexchange/components/src/Form/Field';
import Icon from '@linkexchange/components/src/Icon';
import Dropdown from '@linkexchange/components/src/Dropdown';
import web3 from '@linkexchange/utils/web3';
import { R, validate, validateMultipe } from '@linkexchange/utils/validation';
import Asset, { WIDGET_NETWORKS } from '@linkexchange/components/src/Form/Asset';

import updateQueryParam, { IUpdateQueryParamProp } from '@linkexchange/components/src/containers/updateQueryParam';
// import CreateWidget from '../components/CreateWidget';
// import { PictographRectangle, PictographLeaderboard } from '../components/Pictograph';

import * as style from './configurator.scss';

interface IState {
  recipientAddress: string;
  whitelist: string;
  asset: {
    token: string;
    network: string;
  };
  algorithm: string;
  startBlock: string;
  endBlock: string;
  errors: {
    recipientAddress?: string;
    asset?: string;
    startBlock?: string;
    endBlock?: string;
    tillDate?: string;
  };
}

const initialState = {
  startBlock: '',
  endBlock: '',
  algorithm: 'links',
  asset: {
    token: WIDGET_NETWORKS[0].tokens[0].value,
    network: WIDGET_NETWORKS[0].value,
  },
  errors: {},
};

const rules = {
  recipientAddress: [R.required, R.value((v) => isAddress(v), 'Has to be valid eth address')],
  asset: [
    R.value(({ network, token, isCustom }) => !isCustom || isAddress(token), 'Has to be valid eth address'),
  ],
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ toast: openToast }, dispatch);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TProps = typeof Dispatch2Props & IUpdateQueryParamProp & {
  web3: Web3;
  location: Location;
  history: History;
};

class Configure extends Component<TProps, IState> {

  inputsRefs: {
    [key: string]: Input;
  } = {};

  constructor(props: TProps) {
    super(props);

    // ToDo do something with this
    let fromParams: Partial<IState & { asset: string | any }> = {};
    if (props.location.search) {
      fromParams = qs.parse(props.location.search.replace('?', ''));
      if (fromParams.asset) {
        const [network, token = ''] = fromParams.asset.split(':');
        fromParams.asset = { network, token };
      }
    }

    this.state = {
      ...initialState,
      recipientAddress: '',
      whitelist: '',
      ...fromParams,
    };
  }

  onChange = (key) => ({ target: { value } }) => {
    this.setState({ [key]: value });
    this.validate(key, value);
    this.props.updateQueryParam(key, value);
  }

  onAssetChange = (asset) => {
    this.setState({ asset });
    this.validate('asset', asset);
    this.props.updateQueryParam('asset', `${asset.network}:${asset.token}`);
  }

  onCreateClick = () => {
    const errors = this.validateAll();
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
      this.props.toast('Validation error 😅');
      this.focusOnFirstError(errors);
      return;
    }

    const { asset } = this.state;
    const searchParams = qs.stringify({
      ...this.state,
      asset: asset.token ? `${asset.network}:${asset.token}` : asset.network,
      errors: null,
    }, { skipNulls: true });

    this.props.history.push({
      pathname: '/configurator/summary',
      search: searchParams,
    });
  }

  focusOnFirstError = (errors) => {
    const firstError = ['recipientAddress', 'whitelist']
      .find((field) => !!errors[field]);
    this.inputsRefs[firstError!].focus();
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
    return validateMultipe(rules, this.state);
  }

  onRef = (name) => (ref) => {
    this.inputsRefs[name] = ref;
  }

  render() {
    const { onChange } = this;
    const {
      recipientAddress,
      whitelist,
      asset,
      algorithm,
      errors,
      startBlock,
      endBlock,
    } = this.state;
    return (
      <div className={style.self}>
        <div className={style.paper}>
          <h1>Create widget</h1>
          <p style={{ marginBottom: '40px' }}>
            Provide essential information to get your widget up and running!
          </p>
          <Field>
            <Title>Userfeed Address</Title>
            <Description>Ethereum address you'll use to receive payments for links</Description>
            <Input
              type="text"
              value={recipientAddress}
              onChange={onChange('recipientAddress')}
              ref={this.onRef('recipientAddress')}
            />
            {errors.recipientAddress && <Error>{errors.recipientAddress}</Error>}
          </Field>
          <Field>
            <Title>Whitelist</Title>
            <Description>Address that you'll use for links approval</Description>
            <Input
              type="text"
              value={whitelist}
              onChange={onChange('whitelist')}
              ref={this.onRef('whitelist')}
            />
          </Field>
          <Field>
            <Title>Choose token</Title>
            <Description>Select it from the list</Description>
            <div className={fieldInput}>
              <Asset
                asset={asset}
                onChange={this.onAssetChange}
              />
              {errors.asset && <Error>{errors.asset}</Error>}
            </div>
          </Field>
          <Field>
            <Title>Start block</Title>
            <Description>Ethereum address you'll use to receive payments for links</Description>
            <Input
              type="text"
              value={startBlock}
              onChange={onChange('startBlock')}
              ref={this.onRef('startBlock')}
            />
            {errors.startBlock && <Error>{errors.startBlock}</Error>}
          </Field>
          <Field>
            <Title>End block</Title>
            <Description>Ethereum address you'll use to receive payments for links</Description>
            <Input
              type="text"
              value={endBlock}
              onChange={onChange('endBlock')}
              ref={this.onRef('endBlock')}
            />
            {errors.endBlock && <Error>{errors.endBlock}</Error>}
          </Field>
          <Field>
            <Title>Choose algorithm</Title>
            <Description>Choose algorithm that ranks your links</Description>
            <Dropdown
              disabled
              placeholder="Algorithm"
              value={algorithm}
              onChange={() => null}
              options={[{ value: 'links', label: 'Ad Ether / total ether - time' }]}
            />
          </Field>
          {/* <CreateWidget onClick={this.onCreateClick} /> */}
        </div>
      </div>
    );
  }
}

export default flowRight(
  withInjectedWeb3,
  updateQueryParam,
  connect(null, mapDispatchToProps),
)(Configure);

import React, { Component } from 'react';
import qs from 'qs';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { History, Location } from 'history';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import moment from 'moment';

import { openToast } from '@linkexchange/toast/duck';
import Input from '@linkexchange/components/src/Form/Input';
import Radio from '@linkexchange/components/src/Form/Radio';
import { input as fieldInput } from '@linkexchange/components/src/Form/field.scss';
import { input } from '@linkexchange/components/src/Form/input.scss';
import { Field, Title, Description, RadioGroup, Error } from '@linkexchange/components/src/Form/Field';
import Icon from '@linkexchange/components/src/Icon';
import Dropdown from '@linkexchange/components/src/Dropdown';
import web3 from '@linkexchange/utils/src/web3';
import { R, validate, validateMultipe } from '@linkexchange/utils/src/validation';
import Asset, { WIDGET_NETWORKS } from '@linkexchange/components/src/Form/Asset';

import updateQueryParam, { IUpdateQueryParamProp } from '@linkexchange/components/src/containers/updateQueryParam';
import CreateWidget from '../components/CreateWidget';
import { PictographRectangle, PictographLeaderboard } from '../components/Pictograph';

import * as style from './configure.scss';

interface IState {
  recipientAddress: string;
  whitelist: string;
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
  tillDate: moment.Moment | null;
  errors: {
    recipientAddress?: string;
    title?: string;
    description?: string;
    contactMethod?: string;
    asset?: string;
    tillDate?: string;
  };
}

const initialState = {
  title: '',
  description: 'I accept only links that are about science and technology.',
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
  tillDate: null,
};

const MIN_DATE = moment().add(1, 'day');

const rules = {
  recipientAddress: [R.required, R.value((v) => web3.isAddress(v), 'Has to be valid eth address')],
  title: [R.required],
  description: [R.required],
  contactMethod: [R.required],
  tillDate: [R.required],
  asset: [
    R.value(({ network, token, isCustom }) => !isCustom || web3.isAddress(token), 'Has to be valid eth address'),
  ],
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ toast: openToast }, dispatch);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TProps = typeof Dispatch2Props & IUpdateQueryParamProp & {
  location: Location;
  history: History;
};

class Configure extends Component<TProps, IState> {

  inputsRefs: {
    [key: string]: {
      setFocus(): void;
    };
  } = {};

  constructor(props: TProps) {
    super(props);

    const injectedWeb3 = window.web3;
    const recipientAddress = injectedWeb3 && injectedWeb3.eth.accounts.length > 0 ? injectedWeb3.eth.accounts[0] : '';

    // ToDo do something with this
    let fromParams: Partial<IState & { asset: string | any }> = {};
    if (props.location.search) {
      fromParams = qs.parse(props.location.search.replace('?', ''));
      if (fromParams.asset) {
        const [network, token = ''] = fromParams.asset.split(':');
        fromParams.asset = { network, token };
      }

      if (fromParams.tillDate) {
        fromParams.tillDate = moment(fromParams.tillDate, 'M/D/YYYY');
      }
    }

    if (recipientAddress) {
      props.updateQueryParam({ recipientAddress, whitelist: recipientAddress });
    }

    this.state = {
      ...initialState,
      recipientAddress,
      whitelist: recipientAddress,
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

  onTillDateChange = (tillDate: moment.Moment | null) => {
    this.setState({ tillDate });
    this.props.updateQueryParam(
      'tillDate',
      tillDate ? tillDate.format('M/D/YYYY') : null,
    );
  }

  onCreateClick = () => {
    const errors = this.validateAll();
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
      this.props.toast('Validation error 😅');
      this.focusOnFirstError(errors);
      return;
    }

    const { asset, tillDate } = this.state;
    const searchParams = qs.stringify({
      ...this.state,
      asset: asset.token ? `${asset.network}:${asset.token}` : asset.network,
      tillDate: tillDate!.format('M/D/YYYY'),
      errors: null,
    }, { skipNulls: true });

    this.props.history.push({
      pathname: '/configurator/summary',
      search: searchParams,
    });
  }

  focusOnFirstError = (errors) => {
    const firstError = ['recipientAddress', 'whitelist', 'title', 'description', 'contactMethod', 'tillDate']
      .find((field) => !!errors[field]);
    this.inputsRefs[firstError!].setFocus();
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
          <Title>Title</Title>
          <Description>Name of Your Widget</Description>
          <Input
            type="text"
            value={title}
            onChange={onChange('title')}
            ref={this.onRef('title')}
          />
          {errors.title && <Error>{errors.title}</Error>}
        </Field>
        <Field>
          <Title>Description</Title>
          <Description>Short Description of Your Widget (describing links you want to receive etc)</Description>
          <Input
            type="text"
            multiline
            value={description}
            onChange={onChange('description')}
            ref={this.onRef('description')}
          />
          {errors.description && <Error>{errors.description}</Error>}
        </Field>
        <Field>
          <Title>Preferred Contact Method</Title>
          <Input
            type="text"
            value={contactMethod}
            onChange={onChange('contactMethod')}
            ref={this.onRef('contactMethod')}
          />
          {errors.contactMethod && <Error>{errors.contactMethod}</Error>}
        </Field>
        <Field>
          <Title>Expiration date</Title>
          <Description>How long are you willing to host the widget? (expiration date)</Description>
          <DatePicker
            className={classnames(input, style.DatePicker)}
            minDate={MIN_DATE}
            selected={this.state.tillDate}
            onChange={this.onTillDateChange}
            ref={this.onRef('tillDate')}
          />
          {errors.tillDate && <Error>{errors.tillDate}</Error>}
        </Field>
        <Field>
          <Title>Expected Traffic (Optional)</Title>
          <Description>
            You can provide the expected traffic data here. It will help potential sponsors to estimate their bids.
          </Description>
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
        <CreateWidget onClick={this.onCreateClick} />
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(updateQueryParam(Configure));

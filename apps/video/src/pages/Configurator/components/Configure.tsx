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
import moment from 'moment';

import core from '@userfeeds/core/src';
import CopyFromMM from '@linkexchange/copy-from-mm';
import { getAverageBlockTime } from '@linkexchange/utils/ethereum';
import { withInjectedWeb3, getInfura, TNetwork } from '@linkexchange/utils/web3';
import { openToast } from '@linkexchange/toast/duck';
import Button from '@linkexchange/components/src/NewButton';
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

import * as style from './configure.scss';

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
  blockNumber?: number;
  averageBlockTime: number;
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
  averageBlockTime: 12,
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

  infura: Web3;
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

    this.infura = getInfura(this.state.asset.network as TNetwork);
    setTimeout(this.getBlockNumberAndAverageTime, 1000);
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
    this.infura = getInfura(asset.network as TNetwork);
    this.getBlockNumberAndAverageTime();
  }

  onCreateClick = () => {
    const errors = this.validateAll();
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
      this.props.toast('Validation error 😅');
      this.focusOnFirstError(errors);
      return;
    }

    const { asset, recipientAddress, whitelist, startBlock, endBlock } = this.state;
    const searchParams = qs.stringify({
      recipientAddress,
      whitelist,
      asset: asset.token ? `${asset.network}:${asset.token}` : asset.network,
      startBlock,
      endBlock,
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

  setAddressFromMM = (key) => async () => {
    const [account = ''] = await web3.eth.getAccounts();

    this.setState({ [key]: account });
    this.props.updateQueryParam(key, account);
  }

  setBlockNumberFromMM = (key) => async () => {
    const blockNumber = await this.infura.eth.getBlockNumber();

    this.setState({ [key]: blockNumber });
    this.props.updateQueryParam(key, blockNumber);
  }

  getBlockNumberAndAverageTime = () => {
    core.utils.getBlockNumber(this.infura).then((blockNumber) => this.setState({ blockNumber }));
    getAverageBlockTime(this.infura).then((averageBlockTime) => this.setState({ averageBlockTime }));
  }

  getEstimatedDate = (inputValue: string) => {
    if (!inputValue || !this.state.blockNumber) {
      return null;
    }

    const blockNumber = parseInt(inputValue, 10);
    if (blockNumber < this.state.blockNumber) {
      const duration = moment
        .duration((this.state.blockNumber - blockNumber) * this.state.averageBlockTime * 1000)
        .humanize();

      return `~ ${duration} ago`;
    }
    const duration = moment
      .duration((blockNumber - this.state.blockNumber) * this.state.averageBlockTime * 1000)
      .humanize();

    return `~ ${duration} from now`;
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
      <>
        <h1>Create event</h1>
        <p style={{ marginBottom: '40px' }}>
          Provide essential information to get your event up and running!
        </p>
        <Field>
          <Title>Userfeed Address</Title>
          <Description>Ethereum address you'll use to receive payments for links</Description>
          <div className={style.fieldWithButton}>
            <Input
              className={style.input}
              type="text"
              value={recipientAddress}
              onChange={onChange('recipientAddress')}
              ref={this.onRef('recipientAddress')}
            />
            <CopyFromMM onClick={this.setAddressFromMM('recipientAddress')}/>
          </div>
          {errors.recipientAddress && <Error>{errors.recipientAddress}</Error>}
        </Field>
        <Field>
          <Title>Whitelist</Title>
          <Description>Address that you'll use for links approval</Description>
          <div className={style.fieldWithButton}>
            <Input
              className={style.input}
              type="text"
              value={whitelist}
              onChange={onChange('whitelist')}
              ref={this.onRef('whitelist')}
            />
            <CopyFromMM onClick={this.setAddressFromMM('whitelist')}/>
          </div>
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
          <Description>Block number after which adding and boosting links will be allowed</Description>
          <div className={style.fieldWithButton}>
            <Input
              className={style.input}
              type="text"
              value={startBlock}
              onChange={onChange('startBlock')}
              ref={this.onRef('startBlock')}
            />
            <CopyFromMM onClick={this.setBlockNumberFromMM('startBlock')}/>
          </div>
          {this.getEstimatedDate(startBlock)}
          {errors.startBlock && <Error>{errors.startBlock}</Error>}
        </Field>
        <Field>
          <Title>End block</Title>
          <Description>Block number after which adding and boosting links will be <b>not</b> allowed</Description>
          <div className={style.fieldWithButton}>
            <Input
              className={style.input}
              type="text"
              value={endBlock}
              onChange={onChange('endBlock')}
              ref={this.onRef('endBlock')}
            />
            <CopyFromMM onClick={this.setBlockNumberFromMM('endBlock')}/>
          </div>
          {this.getEstimatedDate(endBlock)}
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
        <Field>
          <Button onClick={this.onCreateClick} color="primary">Create Event</Button>
        </Field>
      </>
    );
  }
}

export default flowRight(
  withInjectedWeb3,
  updateQueryParam,
  connect(null, mapDispatchToProps),
)(Configure);

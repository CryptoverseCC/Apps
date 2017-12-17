import React, { Component } from 'react';
import flowRight from 'lodash/flowRight';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import Web3 from 'web3';
import sigUtil from 'eth-sig-util';

import core from '@userfeeds/core/src';
import { IWidgetState } from '@linkexchange/ducks/widget';
import Loader from '@linkexchange/components/src/Loader';
import Button from '@linkexchange/components/src/NewButton';
import Switch from '@linkexchange/components/src/utils/Switch';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';
import {
  withInjectedWeb3AndWeb3State,
  IWeb3State,
} from '@linkexchange/web3-state-provider';

import * as style from './dashboard.scss';

const mapStateToProps = ({ widget }: { widget: IWidgetState }) => ({
  asset: widget.asset,
  widgetSettings: widget,
});

const State2Props = returntypeof(mapStateToProps);

type TProps = typeof State2Props & {
  web3State: IWeb3State;
  web3: Web3;
};

interface IState {
  stage: 'notstarted' | 'inprogress' | 'success' | 'failure';
}

class Dashboard extends Component<TProps, IState> {
  state: IState = {
    stage: 'notstarted',
  };

  componentDidMount() {
    if (this.props.web3State.enabled) {
      this._login();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.web3State.enabled && this.state.stage === 'notstarted') {
      this._login();
    }
  }

  render() {
    const { stage } = this.state;

    return (
      <div className={style.self}>
        <Switch expresion={stage}>
          <Switch.Case condition="notstarted">
            <p>Waiting for web3</p>
          </Switch.Case>
          <Switch.Case condition="inprogress">
            <Loader />
          </Switch.Case>
          <Switch.Case condition="failure">
            <h4>You shouldn't be here</h4>
          </Switch.Case>
          <Switch.Case condition="success">
            <Button color="primary" onClick={this._goToWhitelist}>Go to whitelist</Button>

            <Button color="primary" onClick={this._goToObsUrl}>Go to obs link</Button>
          </Switch.Case>
        </Switch>
      </div>
    );
  }

  _goToWhitelist = () => {
    openLinkexchangeUrl('apps/#/whitelist', this.props.widgetSettings);
  }

  _goToObsUrl = () => {
    openLinkexchangeUrl('obs-widget', this.props.widgetSettings);
  }

  _login = async () => {
    this.setState({ stage: 'inprogress' });
    const typedData = [
      {
        type: 'string',
        name: 'Message',
        value: `Prove you are the owner`,
      },
      {
        type: 'uint32',
        name: 'Salt',
        value: Math.floor(Math.random() * 1000).toString(),
      },
    ];

    try {
      const [address] = await this.props.web3.eth.getAccounts();
      const signature = await core.utils.signTypedData(this.props.web3, typedData, address);
      const recovered: string = sigUtil.recoverTypedSignature({ data: typedData, sig: signature });
      if (recovered.toLowerCase() === this.props.widgetSettings.recipientAddress.toLowerCase()) {
        this.setState({ stage: 'success' });
      }
    } catch (e) {
      this.setState({ stage: 'failure' });
    }
  }
}

export default flowRight(
  connect(mapStateToProps),
  withInjectedWeb3AndWeb3State,
)(Dashboard);

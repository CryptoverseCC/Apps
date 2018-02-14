import React, { Component } from 'react';
import Web3 from 'web3';
import classnames from 'classnames';

import { withInjectedWeb3AndTokenDetails } from '@linkexchange/token-details-provider';
import { IBaseLink } from '@linkexchange/types/link';
import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';
import Link from '@linkexchange/components/src/Link';
import Paper from '@linkexchange/components/src/Paper';
import Switch from '@linkexchange/components/src/utils/Switch';
import { toast } from '@linkexchange/toast';
import { ITokenDetails } from '@linkexchange/token-details-provider';
import LightText from '../components/src/LightText';

import Steps from './components/Steps';
import BackButton from './components/BackButton';
import AddLinkForm from './components/AddLinkForm';
import Congratulations from './components/Congratulations';

import * as style from './addLink.scss';

interface IProps {
  className?: string;
  web3: Web3;
  widgetSettings: WidgetSettings;
  tokenDetails: ITokenDetails;
  openWidgetDetails(): void;
}

interface IState {
  step: 'form' | 'congratulations';
  link: IBaseLink;
  linkId?: string;
}

const DEFAULT_LINK = {
  title: 'Title',
  summary: 'Summary',
  target: 'http://',
};

class AddLink extends Component<IProps, IState> {
  state: IState = {
    step: 'form',
    link: DEFAULT_LINK,
  };

  render() {
    const { widgetSettings, tokenDetails, web3, className } = this.props;
    const { step, link, linkId } = this.state;

    return (
      <div className={classnames(style.self, className)}>
        <div className={style.header}>
          <BackButton
            style={{ marginRight: 'auto', marginLeft: '-20px' }}
            onClick={() => {
              this.props.openWidgetDetails();
            }}
          />
          <h2>Create a new link</h2>
          <div style={{ marginLeft: 'auto' }}>
            <LightText>Balance:</LightText> {tokenDetails.balanceWithDecimalPoint} {tokenDetails.symbol}
          </div>
        </div>
        <div className={style.body}>
          <Steps activeStep={step} />
          <div className={style.content}>
            <Paper className={style.preview}>
              <Link link={link} />
            </Paper>
            <Paper className={style.form}>
              <Switch expresion={step}>
                <Switch.Case condition="form">
                  <AddLinkForm
                    widgetSettings={widgetSettings}
                    web3={web3}
                    tokenDetails={tokenDetails}
                    asset={widgetSettings.asset}
                    recipientAddress={widgetSettings.recipientAddress}
                    onChange={this._onFormEdit}
                    onSuccess={this._onSuccess}
                    onError={this._onError}
                    minimalValue={widgetSettings.minimalLinkFee}
                  />
                </Switch.Case>
                <Switch.Case condition="congratulations">
                  <Congratulations linkId={linkId} widgetSettings={widgetSettings} />
                </Switch.Case>
              </Switch>
            </Paper>
          </div>
        </div>
      </div>
    );
  }

  _onFormEdit = (link: IBaseLink) => {
    const notEmptyProperties = Object.entries(link)
      .filter(([, value]) => !!value)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    this.setState({ link: { ...DEFAULT_LINK, ...notEmptyProperties } });
  };

  _onSuccess = (linkId) => {
    this.setState({
      linkId,
      step: 'congratulations',
    });
  };

  _onError = (e) => {
    toast.openToast('Transation rejected ' + e);
  };
}

const AddLinkWithWidhetSettings = withWidgetSettings(AddLink);
export default AddLinkWithWidhetSettings;

export const AddLinkWithInjectedWeb3AndTokenDetails = withInjectedWeb3AndTokenDetails(AddLinkWithWidhetSettings);

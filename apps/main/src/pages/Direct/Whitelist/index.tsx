import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import qs from 'qs';
import { History, Location } from 'history';

import core from '@userfeeds/core/src';
import CopyFromMM from '@linkexchange/copy-from-mm';
import wait from '@linkexchange/utils/wait';
import Link from '@linkexchange/components/src/Link';
import Icon from '@linkexchange/components/src/Icon';
import Paper from '@linkexchange/components/src/Paper';
import Loader from '@linkexchange/components/src/Loader';
import { IRemoteLink } from '@linkexchange/types/link';
import Pill from '@linkexchange/components/src/Pill';
import updateQueryParam, { IUpdateQueryParamProp } from '@linkexchange/components/src/containers/updateQueryParam';

import { Field, Title, Description, RadioGroup } from '@linkexchange/components/src/Form/Field';
import { Input as fieldInput } from '@linkexchange/components/src/Form/field.scss';
import Input from '@linkexchange/components/src/Form/Input';
import Asset, { WIDGET_NETWORKS } from '@linkexchange/components/src/Form/Asset';

import LinksList from './components/LinksList';

import * as style from './whitelist.scss';
import { observer, inject } from 'mobx-react';
import LinksStore from '@linkexchange/links-store';
import differenceBy from 'lodash/differenceBy';
import { IWeb3Store } from '@linkexchange/web3-store';
import { IWidgetSettings } from '@linkexchange/types/widget';
import { action } from 'mobx';

interface IState {
  fetching: boolean;
  asset: {
    token: string;
    network: string;
  };
  recipientAddress: string;
  whitelist: string;
}

type TProps = IUpdateQueryParamProp & {
  history: History;
  location: Location;
  links: LinksStore;
  web3Store: IWeb3Store;
  widgetSettingsStore: IWidgetSettings;
};

@inject('links', 'web3Store', 'widgetSettingsStore')
@observer
class Whitelist extends Component<TProps, IState> {
  intervalId: number | null = null;

  constructor(props: TProps) {
    super(props);
    const { network, token } = this.props.web3Store!;
    const { recipientAddress, whitelist } = this.props.widgetSettingsStore!;

    const asset = {
      token: token || '',
      network,
    };

    this.state = {
      fetching: false,
      asset,
      recipientAddress,
      whitelist: whitelist!,
    };
  }

  componentWillMount() {
    this.observeLinks();
  }

  private linksWaitingForApproval = () =>
    differenceBy(this.props.links!.allLinks, this.props.links!.whitelistedLinks, (l) => l.id);

  private linksApproved = () => this.props.links!.whitelistedLinks;

  private observeLinks = () => {
    this.intervalId = window.setInterval(() => {
      this.props.links!.refetch();
    }, 5000);
  };

  private setAddressFromMM = (key) => () => {
    const {changeRecipientAddress, changeWhitelist} = this.props.widgetSettingsStore!
    const {currentAccount} = this.props.web3Store!;
    this.setState({ [key]: currentAccount }, () => {
      switch (key) {
        case 'recipientAddress':
          changeRecipientAddress!(currentAccount!);
          break;
        case 'whitelist':
          changeWhitelist!(currentAccount!);
          break;
      }
      this.props.updateQueryParam(key, currentAccount);
    });
  };

  private fetchLinksAndShowLoader = () => {
    this.props.links.refetch();
  };

  private onAssetChange = (value) => {
    this.setState({ asset: value }, () => {
      if (value.isCustom) {
        this.debouncedUpdateWidgetSettings();
      } else {
        this.props.widgetSettingsStore!.changeAssetTo!(`${value.network}${value.token ? `:${value.token}` : ''}`);
      }
      this.props.updateQueryParam('asset', this.props.widgetSettingsStore.asset);
    });
  };

  private onChange = (key) => (e) => {
    const { value } = e.target;
    this.setState({ [key]: value }, () => {
      this.debouncedUpdateWidgetSettings();
    });
    this.props.updateQueryParam(key, value);
  };

  @action.bound
  private updateWidgetSettings() {
    const { changeAssetTo, changeRecipientAddress, changeWhitelist } = this.props.widgetSettingsStore!;
    const { recipientAddress, whitelist, asset: { token, network } } = this.state;
    changeAssetTo!(`${network}${token ? `:${token}` : ''}`);
    changeRecipientAddress!(recipientAddress);
    changeWhitelist!(whitelist);
  }

  private debouncedUpdateWidgetSettings = debounce(this.updateWidgetSettings, 500);

  render() {
    const { asset, recipientAddress, whitelist } = this.state;
    return (
      <div className={style.self}>
        <Paper className={style.container}>
          <div className={style.head}>
            <h2 className={style.header}>Input the data for your whitelist</h2>
          </div>
          <div className={style.body} style={{ padding: '20px' }}>
            <Field>
              <Title>Recipient Address</Title>
              <Input
                type="text"
                value={recipientAddress}
                onChange={this.onChange('recipientAddress')}
                append={(className) => (
                  <CopyFromMM onClick={this.setAddressFromMM('recipientAddress')} className={className} />
                )}
              />
            </Field>
            <Field>
              <Title>Whitelist Address</Title>
              <Input
                type="text"
                value={whitelist}
                onChange={this.onChange('whitelist')}
                append={(className) => (
                  <CopyFromMM onClick={this.setAddressFromMM('whitelist')} className={className} />
                )}
              />
            </Field>
            <Field>
              <Title>Choose token</Title>
              <div className={fieldInput}>
                <Asset asset={asset} onChange={this.onAssetChange} />
              </div>
            </Field>
          </div>
        </Paper>
        <Paper className={style.container}>
          <div className={style.head}>
            <h2 className={style.header}>
              Waiting for approval
              {this.linksWaitingForApproval().length > 0 && (
                <Pill className={style.counter}>{this.linksWaitingForApproval().length}</Pill>
              )}
            </h2>
          </div>
          <div className={style.body}>
            {this.state.fetching ? (
              <Loader
                containerStyle={{
                  margin: '20px auto',
                }}
              />
            ) : this.linksWaitingForApproval().length > 0 ? (
              <LinksList links={this.linksWaitingForApproval()} waitingForApproval />
            ) : (
              <div style={{ textAlign: 'center', color: '#1b2437', padding: '20px' }}>
                <Icon name="link-broken" style={{ fontSize: '50px', opacity: 0.5 }} />
                <h3 style={{ margin: '20px 0 0', fontWeight: 'normal' }}>There are no links matching this data</h3>
              </div>
            )}
          </div>
        </Paper>
        <Paper className={style.container}>
          <div className={style.head}>
            <h2 className={style.header}>
              Approved
              {this.linksApproved().length > 0 && <Pill className={style.counter}>{this.linksApproved().length}</Pill>}
            </h2>
          </div>
          <div className={style.body}>
            {this.state.fetching ? (
              <Loader
                containerStyle={{
                  margin: '20px auto',
                }}
              />
            ) : this.linksApproved().length > 0 ? (
              <LinksList links={this.linksApproved()} />
            ) : (
              <div style={{ textAlign: 'center', color: '#1b2437', padding: '20px' }}>
                <Icon name="link-broken" style={{ fontSize: '50px', opacity: 0.5 }} />
                <h3 style={{ margin: '20px 0 0', fontWeight: 'normal' }}>There are no links matching this data</h3>
              </div>
            )}
          </div>
        </Paper>
      </div>
    );
  }
}

export default updateQueryParam(Whitelist);

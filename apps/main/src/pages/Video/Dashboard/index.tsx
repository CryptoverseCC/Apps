import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// import sigUtil from 'eth-sig-util';

import core from '@userfeeds/core/src';
import Loader from '@linkexchange/components/src/Loader';
import Button from '@linkexchange/components/src/NewButton';
import Switch from '@linkexchange/components/src/utils/Switch';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import * as style from './dashboard.scss';

interface IProps {
  widgetSettingsStore: WidgetSettings;
}

interface IState {
  stage: 'notstarted' | 'inprogress' | 'success' | 'failure';
}

@inject('widgetSettingsStore')
@observer
export default class Dashboard extends Component<IProps, IState> {
  state: IState = {
    stage: 'success',
  };

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
            <Button color="primary" onClick={this.goToWhitelist}>
              Go to whitelist
            </Button>

            <Button color="primary" onClick={this.goToObsUrl}>
              Go to obs link
            </Button>
          </Switch.Case>
        </Switch>
      </div>
    );
  }

  private goToWhitelist = () => {
    openLinkexchangeUrl('/direct/whitelist', this.props.widgetSettingsStore);
  };

  private goToObsUrl = () => {
    openLinkexchangeUrl('/video/widget', this.props.widgetSettingsStore);
  };

  private login = async () => {
    // ToDo temporaty disable login
    this.setState({ stage: 'success' });
    return;

    // this.setState({ stage: 'inprogress' });
    // const typedData = [
    //   {
    //     type: 'string',
    //     name: 'Message',
    //     value: `Prove you are the owner`,
    //   },
    //   {
    //     type: 'uint32',
    //     name: 'Salt',
    //     value: Math.floor(Math.random() * (Math.pow(2, 32) - 1)).toString(),
    //   },
    // ];

    // try {
    //   const [address] = await this.props.web3.eth.getAccounts();
    //   const signature = await core.utils.signTypedData(this.props.web3, typedData, address);
    //   const recovered: string = sigUtil.recoverTypedSignature({ data: typedData, sig: signature });
    //   if (recovered.toLowerCase() === this.props.widgetSettings.recipientAddress.toLowerCase()) {
    //     this.setState({ stage: 'success' });
    //   }
    // } catch (e) {
    //   this.setState({ stage: 'failure' });
    // }
  };
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import { IBaseLink } from '@userfeeds/types/link';
import Paper from '@userfeeds/apps-components/src/Paper';
import Link from '@userfeeds/apps-components/src/Link';

import { web3Enabled } from '../../selectors/web3';

import { IRootState } from '../../ducks';
import { modalActions } from '../../ducks/modal';
import { openToast, TToastType } from '../../ducks/toast';

import Switch from '../../components/utils/Switch';

import AddLink from '../../components/AddLink';

import Steps from './components/Steps';
import BackButton from './components/BackButton';
import Congratulations from './components/Congratulations';

import * as style from './addLink.scss';

const mapsStateToProps = (state: IRootState) => ({
  widgetSettings: state.widget,
  web3State: web3Enabled(state),
});

const mapDispatchToProps = (dispatch) => ({
  openToast(message: string, type?: TToastType) {
    dispatch(openToast(message, type));
  },
  openWidgetDetails() {
    dispatch(modalActions.open({ modalName: 'widgetDetails' }));
  },
  closeModal() {
    dispatch(modalActions.close());
  },
});

const State2Props = returntypeof(mapsStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TAddLinkModalProps = typeof State2Props & typeof Dispatch2Props;

interface IAddLinkModalState {
  step: 'form' | 'congratulations';
  link: IBaseLink;
  linkId?: string;
}

const DEFAULT_LINK = {
  title: 'Title',
  summary: 'Summary',
  target: 'http://',
};

class AddLinkModal extends Component<TAddLinkModalProps, IAddLinkModalState> {

  state: IAddLinkModalState = {
    step: 'form',
    link: DEFAULT_LINK,
  };

  render() {
    const { widgetSettings, web3State } = this.props;
    const { step, link, linkId } = this.state;

    return (
      <div className={style.self}>
        <div className={style.header}>
          <BackButton onClick={this.props.openWidgetDetails} />
          <h2>Create a new link</h2>
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
                  <AddLink
                    asset={widgetSettings.asset}
                    recipientAddress={widgetSettings.recipientAddress}
                    web3State={web3State}
                    onChange={this._onFormEdit}
                    onSuccess={this._onSuccess}
                    onError={this._onError}
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
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v}), {});

    this.setState({ link: { ...DEFAULT_LINK, ...notEmptyProperties }});
  }

  _onSuccess = (linkId) => {
    this.setState({
      linkId,
      step: 'congratulations',
    });
  }

  _onError = (e) => {
    this.props.openToast('Transation rejected ' + e);
  }
}

export default connect(mapsStateToProps, mapDispatchToProps)(AddLinkModal);

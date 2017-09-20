import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import Paper from '@userfeeds/apps-components/src/Paper';
import Link from '@userfeeds/apps-components/src/Link';

import { ILink } from '../../types';
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
  link: ILink;
  linkId?: string;
}

const DEFAULT_LINK = {
  title: 'Title',
  summary: 'Summary',
  target: 'http://',
};

@connect(mapsStateToProps, mapDispatchToProps)
export default class AddLinkModal extends Component<TAddLinkModalProps, IAddLinkModalState> {

  state: IAddLinkModalState = {
    step: 'form',
    link: DEFAULT_LINK,
  };

  render({ widgetSettings, web3State }: TAddLinkModalProps, { step, link, linkId }: IAddLinkModalState) {
    return (
      <div class={style.self}>
        <div class={style.header}>
          <BackButton onClick={this.props.openWidgetDetails} />
          <h2>Create a new link</h2>
        </div>
        <div class={style.body}>
          <Steps activeStep={step} />
          <div class={style.content}>
            <Paper class={style.preview}>
              <Link link={link} />
            </Paper>
            <Paper class={style.form}>
              <Switch expresion={step}>
                <Switch.Case condition="form">
                  <AddLink
                    context={widgetSettings.context}
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

  _onFormEdit = (link: ILink) => {
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

  _onError = () => {
    this.props.openToast('Transation rejected');
  }
}

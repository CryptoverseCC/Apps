import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import { fetchLinks } from '@linkexchange/widgets/src/ducks/links';
import { observeInjectedWeb3 } from '@linkexchange/widgets/src/ducks/web3';

import WidgetDetails from '@linkexchange/widgets/src/scenes/WidgetDetails';
import RootModal from '@linkexchange/widgets/src/scenes/Banner/containers/RootModal'; // Extract it
import RootToast from '@linkexchange/widgets/src/scenes/Banner/containers/RootToast'; // Extract it

import * as style from './details.scss';

const mapDispatchToProps = (dispatch) => ({
  fetchLinks: () => dispatch(fetchLinks()),
  observeInjectedWeb3: () => dispatch(observeInjectedWeb3()),
});

const Dispatch2Props = returntypeof(mapDispatchToProps);

type TDetailsProps = typeof Dispatch2Props;

@connect(null, mapDispatchToProps)
export default class Details extends Component<TDetailsProps, void> {

  componentDidMount() {
    this.props.fetchLinks();
    this.props.observeInjectedWeb3();
  }

  render() {
    return (
      <div className={style.self}>
        <WidgetDetails standaloneMode className={style.details} />
        <RootModal />
        <RootToast />
      </div>
    );
  }
}

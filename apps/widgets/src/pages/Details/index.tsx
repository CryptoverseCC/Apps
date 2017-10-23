import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import { fetchLinks } from '@linkexchange/widgets/src/ducks/links';

import WidgetDetails from '@linkexchange/widgets/src/scenes/WidgetDetails';
import RootModal from '@linkexchange/widgets/src/scenes/Banner/containers/RootModal'; // Extract it
import RootToast from '@linkexchange/widgets/src/scenes/Banner/containers/RootToast'; // Extract it

import * as style from './details.scss';

const mapDispatchToProps = (dispatch) => ({
  fetchLinks: () => dispatch(fetchLinks()),
});

const Dispatch2Props = returntypeof(mapDispatchToProps);
type TDetailsProps = typeof Dispatch2Props;

class Details extends Component<TDetailsProps, {}> {
  componentDidMount() {
    this.props.fetchLinks();
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

export default connect(null, mapDispatchToProps)(Details);

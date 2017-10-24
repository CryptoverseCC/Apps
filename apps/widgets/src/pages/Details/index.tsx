import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import { fetchLinks } from '@linkexchange/widgets/src/ducks/links';

import WidgetDetails from '@linkexchange/widgets/src/scenes/WidgetDetails';

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
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Details);

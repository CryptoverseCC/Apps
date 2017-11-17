import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import Icon from '@linkexchange/components/src/Icon';
import { modalActions } from '@linkexchange/modal/duck';

import * as style from './menu.scss';

const mapDispatchToProps = (dispatch) => ({
  openWidgetDetails: () => dispatch(modalActions.open({ modalName: 'widgetDetails' })),
});
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TMenuProps = typeof Dispatch2Props;

const Menu = ({ openWidgetDetails }) => (
  <div className={style.self} onClick={openWidgetDetails}>
    See more <Icon className={style.icon} name="external-link" />
  </div>
);

export default connect(null, mapDispatchToProps)(Menu);

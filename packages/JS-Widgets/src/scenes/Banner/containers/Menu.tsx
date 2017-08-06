import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { modalActions } from '../../../actions/modal';

import Icon from '../../../components/Icon';

import * as style from './menu.scss';

const mapDispatchToProps = (dispatch) => ({
  openWidgetDetails: () => dispatch(modalActions.open({ modalName: 'widgetDetails' })),
});
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TMenuProps = typeof Dispatch2Props;

const Menu = ({ openWidgetDetails }) => (
  <div class={style.self} onClick={openWidgetDetails}>See more <Icon name="external-link" /></div>
);

export default connect(null, mapDispatchToProps)(Menu);

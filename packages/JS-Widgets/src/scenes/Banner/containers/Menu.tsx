import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from '../../../reducers';
import { modalActions } from '../../../actions/modal';

import Icon from '../../../components/Icon';
import Button from '../../../components/Button';

import * as style from './menu.scss';

const mapDispatchToProps = (dispatch) => ({
  openAddLink: () => dispatch(modalActions.open({ modalName: 'addLink' })),
  openWidgetDetails: () => dispatch(modalActions.open({ modalName: 'widgetDetails' })),
});
const Dispatch2Props = returntypeof(mapDispatchToProps);
type IMenuProps = typeof Dispatch2Props;

const Menu = ({ openWidgetDetails }) => (
  <div class={style.self}>
    <Button class={style.knowMore} onClick={openWidgetDetails}>See more<Icon name="chevron-bottom" /></Button>
  </div>
);

export default connect(null, mapDispatchToProps)(Menu);

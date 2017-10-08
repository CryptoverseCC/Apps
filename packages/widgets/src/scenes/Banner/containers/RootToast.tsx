import React from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from '../../../ducks';
import { toastActions } from '../../../ducks/toast';

import Toast from '../components/Toast';

import * as style from './rootToast.scss';

const mapStateToProps = ({ toast }: IRootState) => ({ toast });
const mapDispatchToProps = (dispatch) => ({
  closeToast(message) {
    dispatch(toastActions.close(message));
  },
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);
type IRootToastProps = typeof State2Props & typeof Dispatch2Props;

const RootToast = ({ toast, closeToast }: IRootToastProps) => (
  <div className={style.self}>
    {toast.map(({ message, type }) => (<Toast message={message} type={type} onClose={closeToast} />))}
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(RootToast);

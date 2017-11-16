import React from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import { toastActions, TToastState } from './duck';

import Toast from './Toast';

import * as style from './rootToast.scss';

const mapStateToProps = ({ toast }: { toast: TToastState }) => ({ toast });
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
    {toast.map(({ message, type }, index) => (
      <Toast key={`${message}_${index}`} message={message} type={type} onClose={closeToast} />
    ))}
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(RootToast);

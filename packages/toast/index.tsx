import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import Toast from './Toast';

import * as style from './rootToast.scss';

export type TToastType = 'success' | 'failure';

interface IToast {
  message: string;
  type: TToastType;
}

class ToastState {
  @observable toasts: IToast[] = [];

  @action.bound
  openToast(message: string, type: TToastType = 'failure', timeout: number = 10000) {
    this.toasts.push({ message, type });
    setTimeout(() => this.closeToast(message, type), timeout);
  }

  @action.bound
  closeToast(message: string, type: TToastType) {
    this.toasts = this.toasts.filter((toast) => !(message === toast.message && type === toast.type));
  }
}

export const toast = new ToastState();

const RootToast = () => (
  <div className={style.self}>
    {toast.toasts.map(({ message, type }, index) => (
      <Toast key={`${message}_${index}`} message={message} type={type} />
    ))}
  </div>
);

export default observer(RootToast);

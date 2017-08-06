import { combineReducers } from 'redux';

import links, { ILinksState } from './links';
import widget, { IWidgetState } from './widget';
import modal, { IModalState } from './modal';
import web3, { IWeb3State } from './web3';

export interface IRootState {
  links: ILinksState;
  widget: IWidgetState;
  modal: IModalState;
  web3: IWeb3State;
}

export { ILinksState } from './links';
export { IWidgetState } from './widget';
export { IModalState } from './modal';
export { IWeb3State } from './web3';

export default combineReducers({
  links,
  widget,
  modal,
  web3,
});

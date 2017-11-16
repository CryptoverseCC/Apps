import { combineReducers } from 'redux';

import toast, { TToastState } from '@linkexchange/toast/duck';
import web3, { IWeb3State } from '@linkexchange/web3-state-provider/duck';
import tokenDetails, { ITokenDetailsState } from '@linkechange/token-details-provider/duck';

import links, { ILinksState } from './links';
import widget, { IWidgetState } from './widget';
import modal, { IModalState } from './modal';

export interface IRootState {
  links: ILinksState;
  widget: IWidgetState;
  modal: IModalState;
  web3: IWeb3State;
  toast: TToastState;
}

export { IWeb3State } from '@linkexchange/web3-state-provider/duck';
export { ITokenDetailsState } from '@linkechange/token-details-provider/duck';
export { TToastState } from '@linkexchange/toast/duck';

export { ILinksState } from './links';
export { IWidgetState } from './widget';
export { IModalState } from './modal';

export default combineReducers<IRootState>({
  links,
  widget,
  modal,
  toast,
  web3,
  tokenDetails,
});

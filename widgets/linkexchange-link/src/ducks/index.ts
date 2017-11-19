import { combineReducers } from 'redux';

import modal, { IModalState } from '@linkexchange/modal/duck';
import toast, { TToastState } from '@linkexchange/toast/duck';
import links, { ILinksState } from '@linkexchange/details/duck';
import widget, { IWidgetState } from '@linkexchange/ducks/widget';
import web3, { IWeb3State } from '@linkexchange/web3-state-provider/duck';
import tokenDetails, { ITokenDetailsState } from '@linkechange/token-details-provider/duck';

export interface IRootState {
  links: ILinksState;
  widget: IWidgetState;
  modal: IModalState;
  web3: IWeb3State;
  toast: TToastState;
}

export { IModalState } from '@linkexchange/modal/duck';
export { TToastState } from '@linkexchange/toast/duck';
export { IWidgetState } from '@linkexchange/ducks/widget';
export { ILinksState } from '@linkexchange/details/duck';
export { IWeb3State } from '@linkexchange/web3-state-provider/duck';
export { ITokenDetailsState } from '@linkechange/token-details-provider/duck';

export default combineReducers<IRootState>({
  links,
  widget,
  modal,
  toast,
  web3,
  tokenDetails,
});

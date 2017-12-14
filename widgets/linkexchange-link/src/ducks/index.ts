import { combineReducers } from 'redux';

import modal, { IModalState } from '@linkexchange/modal/duck';
import toast, { TToastState } from '@linkexchange/toast/duck';
import links, { ILinksState } from '@linkexchange/details/duck';
import widget, { IWidgetState } from '@linkexchange/ducks/widget';

export interface IRootState {
  links: ILinksState;
  widget: IWidgetState;
  modal: IModalState;
  toast: TToastState;
}

export { IModalState } from '@linkexchange/modal/duck';
export { TToastState } from '@linkexchange/toast/duck';
export { IWidgetState } from '@linkexchange/ducks/widget';
export { ILinksState } from '@linkexchange/details/duck';

export default combineReducers<IRootState>({
  links,
  widget,
  modal,
  toast,
});

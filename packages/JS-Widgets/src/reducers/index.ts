import { combineReducers } from 'redux';

import links, { ILinksState } from './links';
import widget, { IWidgetState } from './widget';
import modal, { IModalState } from './modal';

export interface IRootState {
  links: ILinksState;
  widget: IWidgetState;
  modal: IModalState;
}

export { ILinksState } from './links';
export { IWidgetState } from './widget';
export { IModalState } from './modal';

export default combineReducers({
  links,
  widget,
  modal,
});

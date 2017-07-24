import { actionCreatorFactory } from 'typescript-fsa';

import { IRootState } from '../reducers';
import { IWidgetState } from '../reducers/widget';

import { fetchLinks } from './links';

const acf = actionCreatorFactory('widget');

export const widgetActions = {
  update: acf<IWidgetState>('UPDATE'),
};

export const updateWidgetSettings = (newSettings: IWidgetState) => (dispatch, getState: () => IRootState) => {
  const { widget: oldSettings } = getState();
  dispatch(widgetActions.update(newSettings));

  if (newSettings.context !== oldSettings.context
    || newSettings.whitelist !== oldSettings.whitelist
    || newSettings.algorithm !== oldSettings.algorithm) {
    dispatch(fetchLinks());
  }
};

import React from 'react';
import { Provider } from 'react-redux';

import WidgetDetailsComponent from '@linkexchange/details';

import getStore from '../../store';

const WidgetDetails = ({ widgetSettings }) => {
  const store = getStore(widgetSettings);

  return (
    <Provider store={store} >
      <WidgetDetailsComponent />
    </Provider>
  );
};

export default WidgetDetails;

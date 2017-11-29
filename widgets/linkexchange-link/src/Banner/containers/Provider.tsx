import React, { Children } from 'react';
import { Provider } from 'react-redux';

import RootToast from '@linkexchange/toast/RootToast';

import getStore from '../../store';

const Modal = ({ widgetSettings, children }) => {
  const store = getStore(widgetSettings);

  return (
    <Provider store={store} >
      <>
        {children}
        <RootToast />
      </>
    </Provider>
  );
};

export default Modal;

import React, { Children } from 'react';
import { Provider } from 'react-redux';

import Wrapper from '@linkexchange/components/src/Wrapper';
import RootToast from '@linkexchange/toast/RootToast';

import getStore from '../../store';

const Modal = ({ widgetSettings, children }) => {
  const store = getStore(widgetSettings);

  return (
    <Provider store={store} >
      <Wrapper>
        {children}
        <RootToast />
      </Wrapper>
    </Provider>
  );
};

export default Modal;

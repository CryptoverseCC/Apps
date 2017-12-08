import React, { Children } from 'react';
import { Provider } from 'react-redux';

import web3, { getInfura, Web3Provider } from '@linkexchange/utils/web3';
import RootToast from '@linkexchange/toast/RootToast';

import getStore from '../../store';

const Modal = ({ widgetSettings, children }) => {
  const store = getStore(widgetSettings);
  const [network] = widgetSettings.asset.split(':');
  const infuraWeb3 = getInfura(network);

  return (
    <Provider store={store} >
      <Web3Provider injectedWeb3={web3} infuraWeb3={infuraWeb3}>
        <>
          {children}
          <RootToast />
        </>
      </Web3Provider>
    </Provider>
  );
};

export default Modal;

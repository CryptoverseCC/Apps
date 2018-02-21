import React, { Children } from 'react';

import RootToast from '@linkexchange/toast';
import web3, { getInfura, Web3Provider } from '@linkexchange/utils/web3';
import { WidgetSettingsProvider, WidgetSettings } from '@linkexchange/widget-settings';

const Provider = ({ widgetSettings, children }) => {
  const [network] = widgetSettings.asset.split(':');
  const infuraWeb3 = getInfura(network);

  return (
    <WidgetSettingsProvider widgetSettings={widgetSettings}>
      <Web3Provider injectedWeb3={web3} infuraWeb3={infuraWeb3}>
        <>
          {children}
          <RootToast />
        </>
      </Web3Provider>
    </WidgetSettingsProvider>
  );
};

export default Provider;

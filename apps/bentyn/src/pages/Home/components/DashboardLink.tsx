import React from 'react';
import { match } from 'react-router';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';

import Button from '@linkexchange/components/src/NewButton';
import { WidgetSettings } from '@linkexchange/widget-settings';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import IfOwner from './IfOwner';
import BlocksStore from '../../../stores/blocks';

const openDashboard = (widgetSettings, blocks) => {
  openLinkexchangeUrl('/video/dashboard', { ...blocks, ...widgetSettings });
};

const DashboardLink = (props: { match: match<any>; blocks?: BlocksStore; widgetSettingsStore?: WidgetSettings }) => (
  <IfOwner>
    <Button
      onClick={() => openDashboard(props.blocks, props.widgetSettingsStore)}
      color="primary"
      style={{ marginTop: '10px', borderRadius: '8px' }}
    >
      Go to dashboard
    </Button>
  </IfOwner>
);

export default inject('blocks', 'widgetSettingsStore')(observer(withRouter(DashboardLink)));

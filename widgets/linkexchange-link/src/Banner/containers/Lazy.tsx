import React from 'react';
import Loadable from 'react-loadable';

import Icon from '@linkexchange/components/src/Icon';

import IframePortal from './IframePortal';

import * as style from './lazy.scss';

const Loading = (props) => {
  if (props.pastDelay) {
    return <div>Loading...</div>;
  }
  return null;
};

export const Provider = Loadable({
  loader: () => import('../containers/Provider'),
  loading: Loading,
});

export const Intercom = Loadable({
  loader: () => import('@linkexchange/components/src/Intercom'),
  loading: Loading,
});

export const WidgetDatails = Loadable({
  loader: () => import('@linkexchange/new-details'),
  loading: Loading,
  render: ({ Details, Header, Lists, AddLinkButton }, props) => {
    const { onAddLink, openInNewTab, ...restProps } = props;
    return (
      <IframePortal className={style.details}>
        <div className={style.openInNewTabContainer}>
          <div className={style.openInNewTab} onClick={openInNewTab}>
            <Icon name="external-link" className={style.icon} /> Open in a new tab
          </div>
        </div>
        <div className={style.detailsComponent} style={{ backgroundColor: 'white' }}>
          <Details {...restProps}>
            <Header addLink={<AddLinkButton onClick={onAddLink} />} />
            <Lists />
          </Details>
        </div>
      </IframePortal>
    );
  },
});

export const AddLink = Loadable({
  loader: () => import('@linkexchange/new-add-link'),
  loading: Loading,
  render: ({ default: AddLink }, props) => {
    return (
      <IframePortal className={style.addLink}>
        <div style={{ backgroundColor: 'white' }}>
          <AddLink />
        </div>
      </IframePortal>
    );
  },
});

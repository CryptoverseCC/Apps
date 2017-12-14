import React from 'react';
import Loadable from 'react-loadable';

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

export const WidgetDatails = Loadable({
  loader: () => import('@linkexchange/details'),
  loading: Loading,
  render: ({ Details, Header, Lists }, props) => {
    const { onAddLink, ...restProps } = props;
    return (
      <Details {...restProps}>
        <Header onAddClick={onAddLink}/>
        <Lists />
      </Details>
    );
  },
});

export const AddLink = Loadable({
  loader: () => import('@linkexchange/add-link'),
  loading: Loading,
  render: ({ AddLinkWithInjectedWeb3AndTokenDetails }, props) => (
    <AddLinkWithInjectedWeb3AndTokenDetails {...props} />
  ),
});

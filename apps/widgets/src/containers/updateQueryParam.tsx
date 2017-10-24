import React from 'react';
import qs from 'qs';
import { Location , History } from 'history';

const updateQueryParams = (Component) => (props) => {
  const { location, history } = props;

  const onUpdateQueryParam = (name, value) => {
    const oldQueryParams = qs.parse(location.search.replace('?', ''));
    const queryParams = qs.stringify({
      ...oldQueryParams,
      [name]: value,
    }, { skipNulls: true });

    history.replace({
      search: queryParams,
    });
  };

  return <Component {...props} updateQueryParam={onUpdateQueryParam} />;
};

export interface IUpdateQueryParamProp {
  updateQueryParam(name: string, value: any): void;
}

export default updateQueryParams;

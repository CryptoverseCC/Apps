import React from 'react';
import qs from 'qs';
import { Location , History } from 'history';

const updateQueryParams = (Component) => (props) => {
  const { location, history } = props;

  const onUpdateQueryParam = (name, value) => {
    let toUpdate;
    if (typeof name === 'object') {
      toUpdate = name;
    } else {
      toUpdate = { [name]: value };
    }

    const oldQueryParams = qs.parse(location.search.replace('?', ''));
    const queryParams = qs.stringify({
      ...oldQueryParams,
      ...toUpdate,
    }, { skipNulls: true });

    history.replace({
      search: queryParams,
    });
  };

  return <Component {...props} updateQueryParam={onUpdateQueryParam} />;
};

export interface IUpdateQueryParamProp {
  updateQueryParam(name: string, value: any): void;
  updateQueryParam(params: { [key: string]: any; }): void;
}

export default updateQueryParams;

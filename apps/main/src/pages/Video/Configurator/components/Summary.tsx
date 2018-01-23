import React, { Component } from 'react';
import qs from 'qs';

import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

const Summary = (props) => {
  const params = qs.parse(props.location.search.replace('?', ''));

  return (
    <>
      <h2>Summary</h2>
      <a onClick={() => openLinkexchangeUrl('/video', params)}>
        <p>Event link</p>
      </a>
    </>
  );
};

export default Summary;

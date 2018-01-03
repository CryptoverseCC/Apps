import React, { Component } from 'react';
import qs from 'qs';

import Snippet from '@linkexchange/components/src/Snippet';

const BASE_EVENT_URL = 'https://linkexchange.io/apps/bentyn';

const Summary = (props) => {
  const dashboardLink = `${BASE_EVENT_URL}${props.location.search}`;

  return (
    <>
      <h2>Summary</h2>
      <a href={dashboardLink} target="_blank"><p>Dashboard link</p></a>
    </>
  );
};

export default Summary;

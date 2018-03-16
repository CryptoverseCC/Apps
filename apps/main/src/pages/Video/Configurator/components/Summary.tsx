import React from 'react';
import qs from 'qs';

import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

const Summary = (props) => {
  const params = qs.parse(props.location.search.replace('?', ''));

  return (
    <>
      <h2>Summary</h2>
      <a onClick={() => openLinkexchangeUrl('/video', params)}>
        <p style={{ textDecoration: 'underline', color: 'blue' }}>Event link</p>
      </a>
    </>
  );
};

export default Summary;

import React, { Component } from 'react';
import qs from 'qs';

const BASE_EVENT_URL =
  process.env.NODE_ENV === 'production' ? 'https://apps.linkexchange.io/video' : `${window.location.origin}/video`;

const Summary = (props) => {
  const eventLink = `${BASE_EVENT_URL}${props.location.search}`;

  return (
    <>
      <h2>Summary</h2>
      <a href={eventLink} target="_blank">
        <p>Event link</p>
      </a>
    </>
  );
};

export default Summary;

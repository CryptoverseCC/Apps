import React from 'react';
import Result from '@linkexchange/components/src/Result';

const ActionRejected = ({ retry }) => (
  <Result onClick={retry} type="failure">
    Your transaction has been rejected.
  </Result>
);

export default ActionRejected;

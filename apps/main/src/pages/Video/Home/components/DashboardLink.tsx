import React from 'react';
import { match } from 'react-router';
import { Link, withRouter } from 'react-router-dom';

import Button from '@linkexchange/components/src/NewButton';

import IfOwner from './IfOwner';

const DashboardLink = (props: { match: match<any> }) => (
  <IfOwner>
    <Link to={`${props.match.url}/dashboard`} style={{ textDecoration: 'none' }}>
      <Button color="primary" style={{ marginTop: '10px', borderRadius: '8px' }}>
        Go to dashboard
      </Button>
    </Link>
  </IfOwner>
);

export default withRouter(DashboardLink);

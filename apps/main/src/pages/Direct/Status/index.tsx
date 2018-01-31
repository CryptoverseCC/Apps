import React from 'react';
import { Route } from 'react-router-dom';

import Link from './pages/Link';
import Boost from './pages/Boost';

const Status = ({ match }) => (
  <div>
    <Route path={match.url} exact component={Link} />
    <Route path={`${match.url}/boost`} component={Boost} />
  </div>
);

export default Status;

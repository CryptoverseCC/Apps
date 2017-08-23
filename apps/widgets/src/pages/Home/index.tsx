import { h } from 'preact';
import { Link } from 'react-router-dom';

import Button from '@userfeeds/apps-components/src/Button';

const Home = () => (
  <div>
    <Link to="/details"><Button>Details</Button></Link>
    <Link to="/configurator"><Button>Configurator</Button></Link>
  </div>
);

export default Home;

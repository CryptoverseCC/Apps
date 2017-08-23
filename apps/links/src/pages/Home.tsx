import { h } from 'preact';
import { Link } from 'react-router-dom';

import Button from '@userfeeds/apps-components/src/Button';

const Home = () => (
  <div>
    <Link to="/whitelist"><Button>Whitelist</Button></Link>
    <Link to="/status"><Button>Status</Button></Link>
    <Link to="/linklist"><Button>LinkList</Button></Link>
  </div>
);

export default Home;

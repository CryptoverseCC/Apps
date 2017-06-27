import React from 'react';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

const Home = () => (
  <div>
    <Link to="/details"><RaisedButton>Details</RaisedButton></Link>
    <Link to="/configurator"><RaisedButton>Configurator</RaisedButton></Link>
  </div>
);

export default Home;

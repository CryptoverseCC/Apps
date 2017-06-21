import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Status from './status';
import Whitelister from './whitelister';

const App = () => {
  return (
    <MuiThemeProvider>
      <Router>
        <div>
          <Route path="/whitelister" component={Whitelister}/>
          <Route path="/status" component={Status}/>
        </div>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;


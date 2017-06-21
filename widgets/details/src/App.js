import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Details from './Details';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Details />
      </MuiThemeProvider>
    );
  }
}

export default App;

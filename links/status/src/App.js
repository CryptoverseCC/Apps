import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Status from './Status';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Status />
      </MuiThemeProvider>
    );
  }
}

export default App;

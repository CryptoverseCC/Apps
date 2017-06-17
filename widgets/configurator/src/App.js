import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Configurator from './Configurator';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Configurator />
      </MuiThemeProvider>
    );
  }
}

export default App;

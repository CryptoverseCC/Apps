import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Creator from './Creator';

class App extends Component {
  render() {
    const params = (new URL(document.location)).searchParams;

    return (
      <MuiThemeProvider>
        <Creator context={params.get('context')} />
      </MuiThemeProvider>
    );
  }
}

export default App;

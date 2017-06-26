import React, { Component } from 'react';
import Highlight from 'react-highlight';

import 'highlight.js/styles/androidstudio.css';

export default class Snippet extends Component {

  render() {
    const { widgetSettings } = this.props;
    return (
      <Highlight className="html">
        {`
  <userfeeds-ad
    size="${widgetSettings.size}"
    type="${widgetSettings.type}"
    context="${widgetSettings.network}:${widgetSettings.userfeedsId}"
    algorithm="${widgetSettings.algorithm}"
  >
  </userfeeds-ad>
  <script src="https://cdn.jsdelivr.net/npm/@userfeeds/ads"></script>
        `}
      </Highlight>
    );
  }
}

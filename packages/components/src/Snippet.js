import React from 'react';
import Highlight from 'react-highlight';

import 'highlight.js/styles/androidstudio.css';

const Snippet = ({ widgetSettings }) => (
  <Highlight className="html">
    {`
  <userfeeds-ad
    size="${widgetSettings.size}"
    type="${widgetSettings.type}"
    context="${widgetSettings.network}:${widgetSettings.userfeedsId}"
    whitelist="${widgetSettings.network}:${widgetSettings.whitelistId}"
    publisher-note="${widgetSettings.publisherNote}"
    algorithm="${widgetSettings.algorithm}"
  >
  </userfeeds-ad>
  <script src="https://cdn.jsdelivr.net/npm/@userfeeds/widgets@latest"></script>
        `}
  </Highlight>
);

export default Snippet;

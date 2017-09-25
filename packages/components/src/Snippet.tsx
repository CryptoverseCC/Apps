import { h } from 'preact';
import Highlight from './Highlight';

import 'highlight.js/styles/androidstudio.css';

const Snippet = ({ widgetSettings }) => {
  const whitelistProperty = widgetSettings.whitelistId ? `
    whitelist="${widgetSettings.whitelistId}"` : '';
  const assetId = widgetSettings.token === 'eth'
    ? widgetSettings.network
    : `${widgetSettings.network}:${widgetSettings.token}`;

  return (
    <Highlight
      language="html"
      code={`
  <linkexchange-link
    size="${widgetSettings.size}"
    type="${widgetSettings.type}"
    recipient-address="${widgetSettings.recipientAddress}" ${whitelistProperty}
    asset="${assetId}"
    widget-title="${widgetSettings.title}"
    description="${widgetSettings.description}"
    impression="${widgetSettings.impression}"
    contact-method="${widgetSettings.contactMethod}"
    algorithm="${widgetSettings.algorithm}"
  >
  </linkexchange-link>
  <script src="https://cdn.jsdelivr.net/npm/@linkexchange/widgets@stable"></script>
`}
    />
  );
};

export default Snippet;

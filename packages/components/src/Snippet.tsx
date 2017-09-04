import { h } from 'preact';
import Highlight from './Highlight';

import 'highlight.js/styles/androidstudio.css';

const Snippet = ({ widgetSettings }) => {
  const whitelist = widgetSettings.whitelistId
    ? `${widgetSettings.network}:${widgetSettings.whitelistId}`
    : '';

  return (
    <Highlight
      language="html"
      code={`
  <linkexchange-link
    size="${widgetSettings.size}"
    type="${widgetSettings.type}"
    context="${widgetSettings.network}:${widgetSettings.userfeedsId}"
    whitelist="${whitelist}"
    title="${widgetSettings.title}"
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

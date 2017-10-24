import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import 'highlight.js/styles/androidstudio.css';

import Icon from './Icon';
import Highlight from './Highlight';

import * as style from './snippet.scss';

const Snippet = ({ widgetSettings, onCopy }) => {
  const whitelistProperty = widgetSettings.whitelist ? `
    whitelist="${widgetSettings.whitelist}"` : '';
  const code = `
  <linkexchange-link
    size="${widgetSettings.size}"
    type="${widgetSettings.type}"
    recipient-address="${widgetSettings.recipientAddress}" ${whitelistProperty}
    asset="${widgetSettings.asset}"
    widget-title="${widgetSettings.title}"
    description="${widgetSettings.description}"
    impression="${widgetSettings.impression}"
    contact-method="${widgetSettings.contactMethod}"
    algorithm="${widgetSettings.algorithm}"
  >
  </linkexchange-link>
  <script src="https://cdn.jsdelivr.net/npm/@linkexchange/widgets@stable"></script>
`;

  return (
    <div className={style.self}>
      <div className={style.copy}>
        <CopyToClipboard text={code} onCopy={onCopy}>
          <Icon name="clipboard" className={style.icon}/>
        </CopyToClipboard>
      </div>
      <Highlight language="html" code={code} />
    </div>
  );
};

export default Snippet;

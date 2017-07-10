import React from 'react';

import Label from './Label';

const Preview = ({ widgetSettings }) => (
  <div>
    <Label>Preview</Label>
    <userfeeds-link
      size={widgetSettings.size}
      algorithm={widgetSettings.algorithm}
      context={`${widgetSettings.network}:${widgetSettings.userfeedsId}`}
      whitelist={`${widgetSettings.network}:${widgetSettings.whitelistId}`}
      publisherNote={`${widgetSettings.publisherNote}`}
    />
  </div>
);

export default Preview;

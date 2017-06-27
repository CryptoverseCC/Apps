import React from 'react';

import Label from './Label';

const Preview = ({ widgetSettings }) => (
  <div>
    <Label>Preview</Label>
    <userfeeds-ad
      size={widgetSettings.size}
      algorithm={widgetSettings.algorithm}
      context={`${widgetSettings.network}:${widgetSettings.userfeedsId}`}
    />
  </div>
);

export default Preview;

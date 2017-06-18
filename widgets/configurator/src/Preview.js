import React from 'react';

import Label from './components/Label';

const Preview = ({ widgetSettings }) => {
  return (
    <div>
      <Label>Preview</Label>
      <userfeeds-ad
        size={widgetSettings.size}
        algorithm={widgetSettings.algorithm}
        context={`${widgetSettings.network}:${widgetSettings.userfeedsId}`}
      >
      </userfeeds-ad>
    </div>
  );
};

export default Preview;

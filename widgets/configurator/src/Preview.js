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
        api-key="59049c8fdfed920001508e2aafdcb00bdd4c4c7d61ca02ff47080fe3"
      >
      </userfeeds-ad>
    </div>
  );
};

export default Preview;

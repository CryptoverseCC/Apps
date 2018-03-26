import React from 'react';

import Tooltip from '@linkexchange/components/src/Tooltip';
import BlocksTillConclusionProvider from '@linkexchange/blocks-till-conclusion-provider';
import { AddLinkButtonComponent } from '@linkexchange/new-details/containers/AddLinkButton';

type TProps = React.HtmlHTMLAttributes<HTMLButtonElement>;

const AddLink = (props: TProps) => {
  return (
    <BlocksTillConclusionProvider
      render={({ enabled, reason }) => (
        <Tooltip text={reason}>
          <AddLinkButtonComponent disabled={!enabled} {...props} />
        </Tooltip>
      )}
    />
  );
};

export default AddLink;

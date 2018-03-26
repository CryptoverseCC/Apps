import React from 'react';

import Tooltip from '@linkexchange/components/src/Tooltip';
import BoostLinkComponent from '@linkexchange/boost-link';
import { IRemoteLink, ILink } from '@linkexchange/types/link';
import BlocksTillConclusionProvider from '@linkexchange/blocks-till-conclusion-provider';

interface IProps {
  link: ILink | IRemoteLink;
  render(state: { enabled: boolean; reason?: string }): JSX.Element;
}

const AddLink = (props: IProps) => {
  return (
    <BlocksTillConclusionProvider
      render={(state) => {
        const children = props.render(state);
        if (state.enabled) {
          return <BoostLinkComponent link={props.link}>{children}</BoostLinkComponent>;
        }

        return <Tooltip text={state.reason}>{children}</Tooltip>;
      }}
    />
  );
};

export default AddLink;

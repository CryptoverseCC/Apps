import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { IWidgetState } from '@linkexchange/ducks/widget';
import BoostLinkComponent from '@linkexchange/boost-link';
import { Details, Lists, IDefaultBoostLinkWrapperProps } from '@linkexchange/details';

import BlocksTillConclusion from '../../components/BlocksTillConclusion';
import BlocksTillConclusionProvider from '../../providers/BlocksTillConclusionProvider';

import * as style from './home.scss';

const BoostLink = (props: IDefaultBoostLinkWrapperProps) => (
  <BlocksTillConclusionProvider
    asset={props.asset}
    render={({ enabled, reason }) => (
      <BoostLinkComponent
        {...props}
        disabled={!enabled}
        disabledReason={reason}
      />
    )}
  />
);

const Home = ({ widgetSettings }) => (
  <div>
    <BlocksTillConclusion
      asset={widgetSettings.asset}
      className={style.blocksTillConclusion}
    />
    <Details standaloneMode className={style.details}>
      <Lists boostLinkComponent={BoostLink} />
    </Details>
  </div>
);

const mapStateToProps = ({ widget }: { widget: IWidgetState}) => ({
  widgetSettings: widget,
});

export default connect(mapStateToProps)(Home);

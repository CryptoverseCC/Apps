import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Details, Lists } from '@linkexchange/details';
import { IWidgetState } from '@linkexchange/ducks/widget';

import BlocksTillConclusion from '../../components/BlocksTillConclusion';

import * as style from './home.scss';

const Home = ({ widgetSettings }) => (
  <div>
    <BlocksTillConclusion
      asset={widgetSettings.asset}
      className={style.blocksTillConclusion}
    />
    <Details standaloneMode className={style.details}>
      <Lists />
    </Details>
  </div>
);

const mapStateToProps = ({ widget }: { widget: IWidgetState}) => ({
  widgetSettings: widget,
});

export default connect(mapStateToProps)(Home);

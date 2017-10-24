import React from 'react';
import qs from 'qs';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { Location, History } from 'history';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import Icon from '@userfeeds/apps-components/src/Icon';
import Snippet from '@userfeeds/apps-components/src/Snippet';
import { openToast } from '@linkexchange/widgets/src/ducks/toast';

import * as style from './summary.scss';

const heartSvg = require('../../../../images/heart.svg');

const mapDispatchToProps = (dispatch) => bindActionCreators({ toast: openToast }, dispatch);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TSummaryProps = typeof Dispatch2Props & {
  widgetSettings: any; // ToDo Fix it
  location: Location;
  history: History;
};

const Summary = (props: TSummaryProps) => {
  const widgetSettings = qs.parse(props.location.search.replace('?', ''));

  return (
    <div className={style.self}>
      <div className={style.back} onClick={() => props.history.goBack()}>
        <Icon name="arrow-left" /> Edit
      </div>
      <div className={style.congratulations}>
        <img src={heartSvg} />
        <h2>Congratulations!</h2>
        <span className={style.subCongratulations}>Your widget is ready to use</span>
      </div>
      <Tabs className={style.tabs}>
        <TabList className={style.tabList}>
          <Tab selectedClassName={style.selectedTab}>HTML</Tab>
          <Tab disabled disabledClassName={style.disabledTab}>
            Android <sup>Coming soon</sup>
          </Tab>
        </TabList>
        <TabPanel>
          <Snippet
            widgetSettings={widgetSettings}
            onCopy={() => props.toast('Snippet copied! 🚀', 'success', 1000)}
          />
        </TabPanel>
        <TabPanel />
      </Tabs>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(Summary);

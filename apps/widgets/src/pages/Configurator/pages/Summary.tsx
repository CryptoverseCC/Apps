import React from 'react';
import qs from 'qs';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import Icon from '@userfeeds/apps-components/src/Icon';
import Snippet from '@userfeeds/apps-components/src/Snippet';

import * as style from './summary.scss';

const heartSvg = require('../../../../images/heart.svg');

const Summary = (props) => {
  const widgetSettings = qs.parse(props.location.search.replace('?', ''));

  return (
    <div className={style.self}>
      <Link
        className={style.back}
        to={{
          pathname: '/configurator',
          search: props.location.search,
        }}
      >
        <Icon name="arrow-left" /> Edit
      </Link>
      <div className={style.congratulations}>
        <img src={heartSvg} />
        <h2>Congratulactions!</h2>
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
          <Snippet widgetSettings={widgetSettings} />
        </TabPanel>
        <TabPanel />
      </Tabs>
    </div>
  );
};

export default Summary;

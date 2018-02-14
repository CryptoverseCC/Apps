import React from 'react';
import qs from 'qs';
import { Link } from 'react-router-dom';
import { Location, History } from 'history';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import Icon from '@linkexchange/components/src/Icon';
import Snippet from '@linkexchange/components/src/Snippet';
import AndroidSnippet from '@linkexchange/components/src/AndroidSnippet';
import { toast } from '@linkexchange/toast';
import heartSvg from '@linkexchange/images/heart.svg';

import * as style from './summary.scss';

interface ISummaryProps {
  widgetSettings: any; // ToDo Fix it
  location: Location;
  history: History;
}

const Summary = (props: ISummaryProps) => {
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
          <Tab selectedClassName={style.selectedTab}>Android</Tab>
        </TabList>
        <TabPanel>
          <Snippet
            widgetSettings={widgetSettings}
            onCopy={() => toast.openToast('Snippet copied! 🚀', 'success', 1000)}
          />
        </TabPanel>
        <TabPanel>
          <AndroidSnippet
            widgetSettings={widgetSettings}
            onCopy={() => toast.openToast('Snippet copied! 🚀', 'success', 1000)}
          />
        </TabPanel>
        <TabPanel />
      </Tabs>
    </div>
  );
};

export default Summary;

import React from 'react';
import { Link } from 'react-router-dom';
import Tabs from '@userfeeds/apps-components/src/Tabs';

import Icon from '@userfeeds/apps-components/src/Icon';
import Snippet from '@userfeeds/apps-components/src/Snippet';
import AndroidSnippet from '@userfeeds/apps-components/src/AndroidSnippet';

import * as style from './summary.scss';

const heartSvg = require('../../../../images/heart.svg');

const Summary = (props) => {
  const params = new URLSearchParams(props.location.search);
  const widgetSettings = Array.from(params.entries()).reduce((acc, [k, v]) => ({...acc, [k]: v}), {});

  return (
    <div class={style.self}>
      <Link
        class={style.back}
        to={{
          pathname: '/configurator',
          search: props.location.search,
        }}
      >
        <Icon name="arrow-circle-left" /> Go Back
      </Link>
      <div class={style.congratulations}>
        <img src={heartSvg} />
        <h2>Congratulactions!</h2>
        <span>Your widget is ready to use</span>
      </div>
      <Tabs
        class={style.tabs}
        tabListClass={style.tabList}
        selectedTabClass={style.selectedTab}
        tabs={{
          HTML: () => (
            <Snippet widgetSettings={widgetSettings} />
          ),
          Android: () => (
            <AndroidSnippet widgetSettings={widgetSettings} />
          ),
        }}
      />
    </div>
  );
};

export default Summary;

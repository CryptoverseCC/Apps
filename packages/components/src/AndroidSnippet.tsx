import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Icon from './Icon';
import Highlight from './Highlight';

import 'highlight.js/styles/androidstudio.css';

import * as style from './androidsnippet.scss';

interface IAndroidSnippetProps {
  widgetSettings: any;
  onCopy: any;
}

interface IAndroidSnippetState {
  latestVersion: string;
}

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export default class AndroidSnippet extends Component<IAndroidSnippetProps, IAndroidSnippetState> {

  state = {
    latestVersion: '<latest version goes here>',
  };

  componentDidMount() {
    fetch(`${CORS_PROXY}https://search.maven.org/solrsearch/select/?q=g%3Aio.userfeeds.widget+AND+a%3Acore`)
      .then((res) => res.json())
      .then((json) => {
        const latestVersion = json.response.docs[0].latestVersion;
        this.setState({ latestVersion });
      });
  }

  render() {
    const { widgetSettings, onCopy } = this.props;
    const whitelistProperty = widgetSettings.whitelist ? `userfeeds:whitelist="${widgetSettings.whitelist}"` : '';

    const code = `<io.userfeeds.widget.LinksViewPager
    xmlns:userfeeds="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    userfeeds:recipientAddress="${widgetSettings.recipientAddress}"
    userfeeds:asset="${widgetSettings.asset}" ${whitelistProperty}
    userfeeds:algorithm="${widgetSettings.algorithm}"
    userfeeds:title="${widgetSettings.title}"
    userfeeds:description="${widgetSettings.description}"
    userfeeds:contactMethod="${widgetSettings.contactMethod}"
    userfeeds:impressions="${widgetSettings.impression}" />`;

    const dependencyCode = `dependencies {
    compile 'io.userfeeds.widget:core:${this.state.latestVersion}'
}`;
    return (
      <div>
        <div className={style.self}>
          <div className={style.copy}>
            <CopyToClipboard text={code} onCopy={onCopy}>
              <Icon name="clipboard" className={style.icon}/>
            </CopyToClipboard>
          </div>
          <Highlight language="xml" code={code}/>
        </div>
        <div className={style.self}>
          <div className={style.copy}>
            <CopyToClipboard text={dependencyCode} onCopy={onCopy}>
              <Icon name="clipboard" className={style.icon}/>
            </CopyToClipboard>
          </div>
          <Highlight language="groovy" code={dependencyCode}/>
        </div>
      </div>
    );
  }
}

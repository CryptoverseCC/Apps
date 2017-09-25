import { h, Component } from 'preact';
// import * as Highlight from 'react-highlight';
import Highlight from './Highlight';

import 'highlight.js/styles/androidstudio.css';

interface IAndroidSnippetProps {
  widgetSettings: any;
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
    const { widgetSettings } = this.props;
    const whitelist = widgetSettings.whitelistId ? `${widgetSettings.network}:${widgetSettings.whitelistId}` : '';

    return (
      <div>
        <Highlight
          language="xml"
          code={`
  <io.userfeeds.widget.LinksViewPager
      xmlns:userfeeds="http://schemas.android.com/apk/res-auto"
      android:layout_width="match_parent"
      android:layout_height="wrap_content"
      userfeeds:context="${widgetSettings.network}:${widgetSettings.recipientAddress}"
      userfeeds:whitelist="${whitelist}"
      userfeeds:publisherNote="${widgetSettings.publisherNote}"
      userfeeds:algorithm="${widgetSettings.algorithm}"/>
        `}
        />
        <Highlight
          language="groovy"
          code={`
  dependencies {
      compile 'io.userfeeds.widget:core:${this.state.latestVersion}'
  }
          `}
        />
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import Highlight from 'react-highlight';

import 'highlight.js/styles/androidstudio.css';

export default class AndroidSnippet extends PureComponent {

  state = {
    latestVersion: '<latest version goes here>',
  };

  componentWillMount() {
    fetch('https://cors-anywhere.herokuapp.com/https://search.maven.org/solrsearch/select/?q=g%3Aio.userfeeds.widget+AND+a%3Acore')
      .then((res) => res.json())
      .then((json) => {
        const latestVersion = json.response.docs[0].latestVersion;
        this.setState({ latestVersion });
      });
  }

  render() {
    const { widgetSettings } = this.props;
    return (
      <div>
        <Highlight className="xml">
          {`
  <io.userfeeds.widget.LinksViewPager
      xmlns:userfeeds="http://schemas.android.com/apk/res-auto"
      android:layout_width="match_parent"
      android:layout_height="wrap_content"
      userfeeds:context="${widgetSettings.network}:${widgetSettings.userfeedsId}"
      userfeeds:algorithm="${widgetSettings.algorithm}"/>
          `}
        </Highlight>
        <Highlight className="groovy">
          {`
  dependencies {
      compile 'io.userfeeds.widget:core:${this.state.latestVersion}'
  }
          `}
        </Highlight>
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import Highlight from 'react-highlight';

import 'highlight.js/styles/androidstudio.css';

export default class AndroidSnippet extends PureComponent {

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
      // find latest version here:
      // http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22io.userfeeds.widget%22
      compile 'io.userfeeds.widget:core:(latest version goes here)'
  }
          `}
        </Highlight>
      </div>
    );
  }
}

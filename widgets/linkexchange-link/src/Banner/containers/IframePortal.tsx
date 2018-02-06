import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';

import { root as rootClassName } from './../../styles/all.scss';
import * as style from './iframePortal.scss';

interface IProps {
  className: string;
}

export default class MyWindowPortal extends Component<IProps> {
  containerEl: HTMLElement;
  iframeRef: HTMLIFrameElement;

  constructor(props) {
    super(props);
    this.containerEl = document.createElement('div');
    this.containerEl.classList.add(rootClassName);
  }

  render() {
    return (
      <>
        {createPortal(this.props.children, this.containerEl)}
        <div className={classnames(style.container, this.props.className)}>
          <iframe className={style.frame} ref={this.onRef} />
        </div>
      </>
    );
  }

  onRef = (ref) => {
    if (!ref) {
      return;
    }
    this.iframeRef = ref;

    if (this.iframeRef.contentWindow.document.readyState === 'complete') {
      this.onLoad();
    } else {
      this.iframeRef.addEventListener('load', this.onLoad);
    }
  };

  onLoad = () => {
    this.iframeRef.contentWindow.document.body.style.margin = '0';
    this.iframeRef.contentWindow.document.body.style.opacity = '0';

    this.iframeRef.contentWindow.document.body.appendChild(this.containerEl);

    copyStyles(document, this.iframeRef.contentWindow.document);

    setTimeout(() => {
      copyStyles(document, this.iframeRef.contentWindow.document);
      this.iframeRef.contentWindow.document.body.style.opacity = '1';
    }, 100);
  };
}

function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet: any) => {
    if (styleSheet.href && styleSheet.href.startsWith('http')) {
      return;
    }

    if (styleSheet.cssRules) {
      const newStyleEl = sourceDoc.createElement('style');
      Array.from(styleSheet.cssRules).forEach((cssRule: any) => {
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });
      targetDoc.head.appendChild(newStyleEl);
    }
  });
}

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

    ref.contentWindow.document.body.appendChild(this.containerEl);
    ref.contentWindow.document.body.style.margin = 0;
    ref.contentWindow.document.body.style.opacity = 0;

    copyStyles(document, ref.contentWindow.document);

    // ToDo use mutation observer here
    setTimeout(() => {
      copyStyles(document, ref.contentWindow.document);
      ref.contentWindow.document.body.style.opacity = 1;
    }, 100);
  };
}

function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet: any) => {
    if (styleSheet.cssRules) {
      const newStyleEl = sourceDoc.createElement('style');
      Array.from(styleSheet.cssRules).forEach((cssRule: any) => {
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });
      targetDoc.head.appendChild(newStyleEl);
    }
  });
}

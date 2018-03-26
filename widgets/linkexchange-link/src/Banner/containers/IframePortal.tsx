import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';

import { root as rootClassName } from './../../styles/all.scss';
import * as style from './iframePortal.scss';

const scssUnset = require('!!raw-loader!@linkexchange/scss-unset');
const unset = document.createElement('style');
unset.innerHTML = scssUnset;

interface IProps {
  className: string;
}

export default class MyWindowPortal extends Component<IProps> {
  containerEl: HTMLElement;
  iframeRef: HTMLIFrameElement;
  styleObserver?: number;

  constructor(props) {
    super(props);
    this.containerEl = document.createElement('div');
    this.containerEl.classList.add(rootClassName);
  }

  componentDidMount() {
    if (this.iframeRef.contentWindow.document.readyState === 'complete') {
      this.onLoad();
    } else {
      this.iframeRef.addEventListener('load', this.onLoad);
    }
  }

  componentWillUnmount() {
    if (this.styleObserver) {
      clearInterval(this.styleObserver);
    }
    this.iframeRef.contentWindow.document.body.removeChild(this.containerEl);
  }

  render() {
    return (
      <div className={classnames(style.container, this.props.className)}>
        {createPortal(this.props.children, this.containerEl)}
        <iframe className={style.frame} ref={this.onRef} />
      </div>
    );
  }

  onRef = (ref) => {
    if (!ref) {
      return;
    }
    this.iframeRef = ref;
  };

  onLoad = () => {
    this.iframeRef.contentWindow.document.body.style.margin = '0';
    this.iframeRef.contentWindow.document.body.style.opacity = '0';

    this.iframeRef.contentWindow.document.head.insertBefore(unset, this.iframeRef.contentWindow.document.head[0]);
    this.iframeRef.contentWindow.document.body.appendChild(this.containerEl);

    setTimeout(() => {
      copyStyles(document, this.iframeRef.contentWindow.document);
      this.styleObserver = observeStyles(document, this.iframeRef.contentWindow.document);

      this.iframeRef.contentWindow.document.body.style.opacity = '1';
    }, 100);
  };
}

const copyStyles = (sourceDoc: HTMLDocument, targetDoc: HTMLDocument) => {
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
};

const observeStyles = (sourceDoc: HTMLDocument, targetDoc: HTMLDocument) => {
  return window.setInterval(() => {
    const styles = Array.from(sourceDoc.querySelectorAll('head style'));

    styles.forEach((node, index) => {
      const targetNode = targetDoc.querySelector(`head style[index="${index}"]`);
      if (targetNode === null) {
        const nodeToInsert = node.cloneNode(true) as HTMLElement;
        nodeToInsert.setAttribute('index', '' + index);
        targetDoc.head.appendChild(nodeToInsert);
      } else if (targetNode.innerHTML !== node.innerHTML) {
        targetNode.innerHTML = node.innerHTML;
      }
    });
  }, 100);
};

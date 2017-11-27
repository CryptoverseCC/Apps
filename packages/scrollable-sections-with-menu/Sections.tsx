import React, { Component, Children } from 'react';
import { findDOMNode } from 'react-dom';
import * as throttle from 'lodash/throttle';

import { isType } from '@linkexchange/utils';

import * as style from './sections.scss';

export class Section extends Component {
  static defaultProps = {
    displayName: 'Section',
  };

  render() {
    return this.props.children;
  }
}

Section.defaultProps = {
  displayName: 'Section',
};

interface ISectionsProps {
  onScrolledTo?: (index: number) => void;
}

export default class Sections extends Component<ISectionsProps, {}> {

  static defaultProps = {
    displayName: 'Sections',
  };

  sections = [];

  scrollTo(to: number) {
    findDOMNode(this.sections[to]).scrollIntoView(true);
  }

  render() {
    const decoratedChildren = Children.map(
      this.props.children,
      (child, index) =>
        isType(child, 'Section')
          ? React.cloneElement(child, { ref: this._onRef(index) })
          : child);

    return (
      <div className={style.self} onScroll={this._onScroll}>
        {decoratedChildren}
      </div>
    );
  }

  _onScroll = (event) => {
    event.persist();
    this._onScrollThrottled(event.currentTarget);
  }

  _onRef = (index) => (ref) => {
    this.sections[index] = ref;
  }

  _onScrollThrottled = throttle(
    (element) => {
      const viewport = {
        top: element.scrollTop,
        bottom: element.scrollTop + element.offsetHeight,
      };

      const visibleSections = this.sections
        .filter((ref) => {
          const node = findDOMNode(ref) as HTMLElement;
          const bounds = {
            top: node.offsetTop,
            bottom: node.offsetTop + node.offsetHeight,
          };

          return bounds.top <= viewport.bottom && bounds.bottom >= viewport.top;
        })
        .sort((ref0, ref1) => {
          const node0 = findDOMNode(ref0) as HTMLElement;
          const top0 = node0.offsetTop;

          const node1 = findDOMNode(ref1) as HTMLElement;
          const top1 = node1.offsetTop;

          return Math.abs(viewport.top - top0) - Math.abs(viewport.top - top1);
        });
      this.props.onScrolledTo(
        this.sections.indexOf(visibleSections[0]),
      );
    },
    100,
    { leading: false },
  );
}

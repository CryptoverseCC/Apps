import React, { Component, Children } from 'react';

import { isType } from '@linkexchange/utils';

import Sections from './Sections';

interface IScrollableSectionsWithMenuState {
  activeSection: number;
}

export default class ScrollableSectionsWithMenu extends Component<{}, IScrollableSectionsWithMenuState> {

  sectionsRef: Sections;
  state = {
    activeSection: 0,
  };

  render() {
    const decoratedChildren = Children.map(
      this.props.children,
      (child) => {
        if (isType(child, 'Menu')) {
          return React.cloneElement(child, {
            activeSection: this.state.activeSection,
            onItemClick: this._onMenuItemClick,
          });
        } else if (isType(child, 'Sections')) {
          return React.cloneElement(child, {
            onScrolledTo: this._onScrolledTo,
            ref: this._onSectionRef,
          });
        }
        return child;
      },
    );

    return decoratedChildren;
  }

  _onMenuItemClick = (index: number) => {
    this.setState({ activeSection: index }, () => {
      this.sectionsRef.scrollTo(index);
    });
  }

  _onScrolledTo = (index: number) => {
    return this.setState({ activeSection: index });
  }

  _onSectionRef = (ref) => {
    this.sectionsRef = ref;
  }
}

export { MenuItem } from './Menu';
export { default as Menu } from './Menu';
export { Section } from './Sections';
export { default as Sections } from './Sections';

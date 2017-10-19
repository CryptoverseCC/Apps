import React, { Component } from 'react';
import classnames from 'classnames';

import * as style from './tooltip.scss';

interface ITooltipProps {
  text?: string;
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
}

interface ITooltipState {
  top: number;
  left: number;
}

export default class Tooltip extends Component<ITooltipProps, ITooltipState> {

  _textRef: HTMLElement;
  _containerRef: HTMLElement;

  render() {
    const { style: externalStyle, className, text, children } = this.props;

    return (
      <div
        style={externalStyle}
        className={classnames(style.self, className)}
        onMouseEnter={this._adjustTooltip}
        ref={this._onContainerRef}
      >
        {children}
        {text && <div style={this.state} ref={this._onTextRef} className={style.text}>{text}</div>}
      </div>
    );
  }

  _onContainerRef = (ref) => this._containerRef = ref;
  _onTextRef = (ref) => this._textRef = ref;

  _adjustTooltip = () => {
    if (!(this._containerRef && this._textRef)) {
      return;
    }

    const containerRect = this._containerRef.getBoundingClientRect();
    const textRect = this._textRef.getBoundingClientRect();

    let top;
    if (window.innerHeight < containerRect.bottom + textRect.height) {
      // Display above
      top = -(textRect.height + 5);
    } else {
      // Display below
      top = containerRect.height + 5;
    }

    let left;
    const rightBorderWhenCentered = (containerRect.left + containerRect.width / 2) + (textRect.width / 2);
    if (window.innerWidth > rightBorderWhenCentered && rightBorderWhenCentered - textRect.width > 0) {
      // Center
      left = (containerRect.width / 2) - (textRect.width / 2);

    } else if (rightBorderWhenCentered > window.innerWidth) {
      // Adjust to right
      left = containerRect.width - textRect.width;
    } else {
      // Adjust to left
      left = 0;
    }

    this.setState({ top, left });
  }
}

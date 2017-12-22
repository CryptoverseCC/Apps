import React, { Component, DragEvent, MouseEvent } from 'react';
import classnames from 'classnames/bind';

import * as style from './slider.scss';
const cx = classnames.bind(style);

interface IProps {
  className?: string;
  initialValue: number;
  onChange(value: number): void;
}

interface IState {
  mouseDown: boolean;
  initialValue: number;
  value: number;
}

export default class Slider extends Component<IProps, IState> {
  containerRef: HTMLElement;

  constructor(props: IProps) {
    super(props);

    const { initialValue = 0 } = props;

    this.state = {
      initialValue,
      mouseDown: false,
      value: initialValue,
    };
  }

  render() {
    const { className } = this.props;
    const { initialValue, value, mouseDown } = this.state;

    return (
      <div className={classnames(style.self, className)}>
        <div
          className={style.slider}
          ref={this._onRef}
          onMouseDown={this._onDragStart}
          onMouseMove={this._onDrag}
          onMouseUp={this._onDragEnd}
          onMouseLeave={this._onDragEnd}
        >
          {this.props.initialValue !== 0 && <div className={style.left} style={{ width: `${initialValue}%` }} />}
          <div
            className={style.right}
            style={{ left: `${initialValue}%`, width: `${100 - initialValue}%` }}
            onClick={this._onDrag}
          />
          <div
            className={style.fill}
            style={{ left: `${initialValue}%`, width: `${value - initialValue}%` }}
            onClick={this._onDrag}
          />
          <div
            className={cx(style.toggle, { dragging: mouseDown })}
            style={{ left: `calc(${value}% - 10px)` }}
          />
        </div>
        <div className={style.numbers}>
          <span className={style.number}>0%</span>
          <span className={style.number}>100%</span>
          <span className={style.change} style={{ left: `calc(${value}% - 20px)` }}>
            +{(value - initialValue).toFixed(1)}%
          </span>
        </div>
      </div>
    );
  }

  _onRef = (ref) => {
    this.containerRef = ref;
  }

  _onDragStart = () => {
    this.setState({ mouseDown: true });
  }

  _onDragEnd = () => {
    this.setState({ mouseDown: false });
  }

  _onDrag = (e: DragEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
    if (e.type === 'mousemove' && !this.state.mouseDown) {
      return;
    }

    e.stopPropagation();
    const rect = this.containerRef.getBoundingClientRect();
    const value = (e.pageX - rect.x) / rect.width * 100;

    if (value < this.state.initialValue) {
      this.setState({ value: this.state.initialValue });
      this.props.onChange(this.state.initialValue);
      return;
    } else if (value > 99.9) {
      this.setState({ value: 99.9 });
      this.props.onChange(99.9);
      return;
    }

    this.setState({ value });
    this.props.onChange(value);
  }
}

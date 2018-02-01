import React, { Component, DragEvent, MouseEvent } from 'react';
import classnames from 'classnames/bind';

import * as style from './slider.scss';
const cx = classnames.bind(style);

interface IProps {
  className?: string;
  initialValue: number;
  value?: number | null;
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

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.value !== this.state.value && newProps.value !== null) {
      this.setState({ value: newProps.value! });
    }
  }

  render() {
    const { className } = this.props;
    const { initialValue, value, mouseDown } = this.state;
    const fill = (value - initialValue) / (100 - initialValue) * 100;

    return (
      <div className={classnames(style.self, className)}>
        <div className={style.change}>
          <span className={style.value} style={{ left: `calc(${fill}% - 20px)` }}>
            +{(value - initialValue).toFixed(1)}%
          </span>
        </div>
        <div
          className={style.slider}
          ref={this._onRef}
          onMouseDown={this._onDragStart}
          onMouseMove={this._onDrag}
          onMouseUp={this._onDragEnd}
          onMouseLeave={this._onDragEnd}
        >
          <div className={style.right} onClick={this._onDrag} />
          <div className={style.fill} style={{ width: `${fill}%` }} onClick={this._onDrag} />
          <div className={cx(style.toggle, { dragging: mouseDown })} style={{ left: `calc(${fill}% - 10px)` }} />
        </div>
        <div className={style.scale}>
          <span>{initialValue}%</span>
          <span>100%</span>
        </div>
      </div>
    );
  }

  _onRef = (ref) => {
    this.containerRef = ref;
  };

  _onDragStart = () => {
    this.setState({ mouseDown: true });
  };

  _onDragEnd = () => {
    this.setState({ mouseDown: false });
  };

  _onDrag = (e: DragEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
    if (e.type === 'mousemove' && !this.state.mouseDown) {
      return;
    }

    e.stopPropagation();
    const { initialValue } = this.state;
    const rect = this.containerRef.getBoundingClientRect();
    const value = Math.round(((e.pageX - rect.left) / rect.width * (100 - initialValue) + initialValue) * 10) / 10;

    if (value < initialValue) {
      this.setState({ value: initialValue });
      this.props.onChange(initialValue);
      return;
    } else if (value > 99.9) {
      this.setState({ value: 99.9 });
      this.props.onChange(99.9);
      return;
    }

    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  };
}

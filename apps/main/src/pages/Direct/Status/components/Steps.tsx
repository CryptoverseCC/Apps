import { findDOMNode } from 'react-dom';
import React, { Component, PureComponent, Children } from 'react';
import classnames from 'classnames/bind';

import * as style from './steps.scss';
const cx = classnames.bind(style);

interface IStepProps {
  icon: JSX.Element;
  state?: string; // 'disabled' | 'notstarted' | 'waiting' | 'done' | 'failed';
  reason?: string;
}

export class Step extends PureComponent<IStepProps> {
  render() {
    const { icon, state, children } = this.props;
    const decoratedIcon = React.cloneElement(icon, {
      className: classnames(icon.props.className, style.icon),
    });

    return (
      <div className={cx(style.step, { [state!]: true })}>
        <div className={style.iconContainer}>{decoratedIcon}</div>
        <div className={style.content}>{children}</div>
      </div>
    );
  }
}

interface IProgressProps {
  stepsStates: Array<{ state: string; reason?: string }>;
  stepsRefs: JSX.Element[];
}

interface IProgressState {
  fillStyle?: any;
}

class Progress extends Component<IProgressProps, IProgressState> {
  state: IProgressState = {};

  componentWillReceiveProps(newProps) {
    const { stepsStates, stepsRefs } = newProps;

    const lastDoneStep = [...stepsStates].reverse().findIndex(({ state }) => state === 'done');
    const lastDoneElement = [...stepsRefs].reverse()[lastDoneStep];

    const fillStyle = {
      width: '0',
      height: '0',
      maxWidth: '0',
      maxHeight: '0',
    };

    if (lastDoneElement) {
      const lastRef = stepsRefs[stepsRefs.length - 1];
      const step0DOMNode = findDOMNode(stepsRefs[0]) as HTMLElement;
      const step1DOMNode = findDOMNode(stepsRefs[1]) as HTMLElement;
      const lastDoneDOMNode = findDOMNode(lastDoneElement) as HTMLElement;
      const rowDirection = step0DOMNode.offsetTop === step1DOMNode.offsetTop;

      fillStyle.width = fillStyle.maxWidth = rowDirection
        ? lastDoneElement === lastRef ? '100%' : `${lastDoneDOMNode.offsetLeft + lastDoneDOMNode.offsetWidth / 2}px`
        : '100%';

      fillStyle.height = fillStyle.maxHeight = !rowDirection
        ? lastDoneElement === lastRef ? '100%' : `${lastDoneDOMNode.offsetTop + lastDoneDOMNode.offsetHeight / 2}px`
        : '100%';
    }

    this.setState({ fillStyle });
  }

  render() {
    return (
      <div className={style.progressCotainer}>
        <div className={style.progress}>
          <div className={style.progressFill} style={this.state.fillStyle} />
        </div>
      </div>
    );
  }
}

interface IStepsProps {
  stepsStates: Array<{ state: string; reason?: string }>;
}

export default class Steps extends Component<IStepsProps, {}> {
  stepsRefs: JSX.Element[] = [];

  render() {
    const { stepsStates, children } = this.props;

    let stepIndex = 0;
    const decoratedChildren = Children.map(children, (child) => {
      if (!child || typeof child === 'string' || typeof child === 'number') {
        return child;
      }

      const decorated = React.cloneElement(child, {
        ...stepsStates[stepIndex],
        ref: this._onRef(stepIndex),
      });

      ++stepIndex;
      return decorated;
    });
    return (
      <div className={style.self}>
        <Progress stepsStates={stepsStates} stepsRefs={this.stepsRefs} />
        <div className={style.stepsContainer}>{decoratedChildren}</div>
      </div>
    );
  }

  _onRef = (index) => (ref) => (this.stepsRefs[index] = ref);
}

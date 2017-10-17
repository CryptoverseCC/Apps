import { findDOMNode } from 'react-dom';
import React, { Component, PureComponent } from 'react';
import classnames from 'classnames/bind';

import Svg from '@userfeeds/apps-components/src/Svg';
import Icon from '@userfeeds/apps-components/src/Icon';
import Tooltip from '@userfeeds/apps-components/src/Tooltip';

import * as style from './steps.scss';
const cx = classnames.bind(style);

const cubeSvg = require('!!svg-inline-loader?removeTags=true&removeSVGTagAttrs=true!../../../../images/cube.svg');

interface IStepProps {
  icon: JSX.Element;
  state: 'disabled' | 'notstarted' | 'waiting' | 'done';
}

class Step extends PureComponent<IStepProps> {

  render() {
    const { icon, state, children } = this.props;

    return (
      <div className={cx(style.step, { [state]: true })}>
        <div className={style.icon}>{icon}</div>
        <div className={style.content}>{children}</div>
      </div>
    );
  }
}

interface IProgressProps {
  step0State: string;
  step1State: string;
  step2State: string;
  step0Ref: any;
  step1Ref: any;
  step2Ref: any;
}

interface IProgressState {
  fillStyle?: any;
}

class Progress extends Component<IProgressProps, IProgressState> {

  state: IProgressState = {};

  componentWillReceiveProps(newProps) {
    const { step0State, step1State, step2State, step0Ref, step1Ref, step2Ref } = newProps;

    const lastDoneStep = [step2State, step1State, step0State].indexOf('done');
    const lastDoneElement = [step2Ref, step1Ref, step0Ref][lastDoneStep];

    const fillStyle = {
      width: '0',
      height: '0',
      maxWidth: '0',
      maxHeight: '0',
    };

    if (lastDoneElement) {
      const step0DOMNode = findDOMNode(step0Ref) as HTMLElement;
      const step1DOMNode = findDOMNode(step1Ref) as HTMLElement;
      const lastDoneDOMNode = findDOMNode(lastDoneElement) as HTMLElement;
      const rowDirection = step0DOMNode.offsetTop === step1DOMNode.offsetTop;

      fillStyle.width = fillStyle.maxWidth = rowDirection
        ? `${lastDoneDOMNode.offsetLeft + lastDoneDOMNode.offsetWidth / 2}px`
        : '100%';

      fillStyle.height = fillStyle.maxHeight = !rowDirection
        ? `${lastDoneDOMNode.offsetTop + lastDoneDOMNode.offsetHeight / 2}px`
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
  link?: any;
  blockchainState: {
    web3Available: boolean;
    blockNumber: number | null;
    currentBlockNumber: number | null;
  };
}

export default class Steps extends Component<IStepsProps, {}> {

  step0Ref: JSX.Element | undefined;
  step1Ref: JSX.Element | undefined;
  step2Ref: JSX.Element | undefined;

  render() {
    const { link, blockchainState } = this.props;
    let step0State;
    let step0Reason;

    if (link) {
      step0State = 'done';
    } else if (blockchainState.web3Available) {
      if (blockchainState.blockNumber) {
        step0State = 'done';
      } else {
        step0State = 'waiting';
        step0Reason = 'Waiting for blockchain';
      }
    } else {
      step0State = 'disabled';
      step0Reason = 'Web is unavailable';
    }

    const step1State = step0State === 'waiting'
      ? 'notstarted'
      : link ? 'done' : 'waiting';

    const step2State = step1State === 'waiting' || step1State === 'notstarted'
      ? 'notstarted'
      : link && link.whitelisted ? 'done' : 'waiting';

    return (
      <div className={style.self}>
        <Progress
          step0State={step0State}
          step1State={step1State}
          step2State={step2State}
          step0Ref={this.step0Ref}
          step1Ref={this.step1Ref}
          step2Ref={this.step2Ref}
        />
        <div className={style.stepsContainer}>
          <Step
            ref={this._onRef('step0Ref')}
            state={step0State}
            icon={<Tooltip text={step0Reason}><Icon className={style.icon} name="eye" /></Tooltip>}
          >
            <p>Visible on blockchain</p>
          </Step>
          <Step
            ref={this._onRef('step1Ref')}
            state={step1State}
            icon={<Svg svg={cubeSvg} size="1.2em" viewBox="0 0 23 27" />}
          >
            <p>Userfeeds Address</p>
            <span>Visible to publisher</span>
          </Step>
          <Step
            ref={this._onRef('step2Ref')}
            state={step2State}
            icon={<Icon className={style.icon} name="check" />}
          >
            <p>Put on whitelist</p>
            <span>All set!</span>
          </Step>
        </div>
      </div>
    );
  }

  _onRef = (name) => (ref) => this[name] = ref;
}

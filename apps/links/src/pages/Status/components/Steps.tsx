import { h, FunctionalComponent, Component } from 'preact';
import * as classnames from 'classnames/bind';

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

const Step: FunctionalComponent<IStepProps> = ({ icon, state, children }) => (
  <div class={cx(style.step, { [state]: true })}>
    <div class={style.icon}>{icon}</div>
    <div class={style.content}>{children}</div>
  </div>
);

const Progress = ({ step0State, step1State, step2State,
  step0Ref, step1Ref, step2Ref }) => {

  const lastDoneStep = [step2State, step1State, step0State].indexOf('done');
  const lastDoneElement = [step2Ref, step1Ref, step0Ref][lastDoneStep];

  const fillStyle = {
    width: 0,
    height: 0,
    maxWidth: 0,
    maxHeight: 0,
  };

  if (lastDoneElement) {
    const rowDirection = step0Ref.base.offsetTop === step1Ref.base.offsetTop;

    fillStyle.width = fillStyle.maxWidth = rowDirection
      ? lastDoneElement.base.offsetLeft + lastDoneElement.base.offsetWidth / 2
      : '100%';

    fillStyle.height = fillStyle.maxHeight = !rowDirection
      ? lastDoneElement.base.offsetTop + lastDoneElement.base.offsetHeight / 2
      : '100%';
  }

  return (
    <div class={style.progressCotainer}>
      <div class={style.progress}>
        <div class={style.progressFill} style={fillStyle} />
      </div>
    </div>
  );
};

interface IStepsProps {
  asset: string;
  linkId: string;
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

  render({ asset, linkId, link, blockchainState }: IStepsProps) {
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

    const [network] = asset.split(':');
    const networkPrefix = network !== 'ethereum' ? `${network}.` : '';
    const [, tx] = linkId.split(':');
    const etherscanUrl = link ? `https://${networkPrefix}etherscan.io/tx/${tx}` : '';

    return (
      <div class={style.self}>
        <Progress
          step0State={step0State}
          step1State={step1State}
          step2State={step2State}
          step0Ref={this.step0Ref}
          step1Ref={this.step1Ref}
          step2Ref={this.step2Ref}
        />
        <div class={style.stepsContainer}>
          <Step
            ref={this._onRef('step0Ref')}
            state={step0State}
            icon={<Tooltip text={step0Reason}><Icon class={style.icon} name="eye" /></Tooltip>}
          >
            <p>Visible on blockchain</p>
            <a href={etherscanUrl} target="_blank">Etherscan <Icon name="external-link" /></a>
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
            icon={<Icon class={style.icon} name="check" />}
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

import { h, FunctionalComponent } from 'preact';
import * as classnames from 'classnames/bind';

import Svg from '@userfeeds/apps-components/src/Svg';
import Icon from '@userfeeds/apps-components/src/Icon';
import Tooltip from '@userfeeds/apps-components/src/Tooltip';

import * as style from './steps.scss';
const cx = classnames.bind(style);

const cubeSvg = require('!!svg-inline-loader?removeTags=true&removeSVGTagAttrs=true!../../../../images/cube.svg');

interface IStepProps {
  icon: JSX.Element;
  state: 'disabled' | 'waiting' | 'done';
}

const Step: FunctionalComponent<IStepProps> = ({ icon, state, children }) => (
  <div class={cx(style.step, { [state]: true })}>
    <div class={style.icon}>{icon}</div>
    <div class={style.content}>{children}</div>
  </div>
);

interface IStepsProps {
  context: string;
  linkId: string;
  link?: any;
  blockchainState: {
    web3Available: boolean;
    blockNumber: number | null;
    currentBlockNumber: number | null;
  };
}

const Steps = ({ context, linkId, link, blockchainState }: IStepsProps) => {
  let step0State;
  let step0Reason;
  if (blockchainState.web3Available) {
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

  const step1State = link ? 'done' : 'waiting';
  const step2State = link && link.whitelisted ? 'done' : 'waiting';

  const [network] = context.split(':');
  const networkPrefix = network !== 'eth' ? `${network}.` : '';
  const [, tx] = linkId.split(':');
  const etherscanUrl = link ? `https://${networkPrefix}etherscan.io/tx/${tx}` : '';

  return (
    <div class={style.self}>
      <div class={style.progressCotainer}>
        <div class={style.progress} />
      </div>
      <div class={style.stepsContainer}>
        <Step
          state={step0State}
          icon={<Tooltip text={step0Reason}><Icon class={style.icon} name="eye" /></Tooltip>}
        >
          <p>Visible on blockchain</p>
          <a href={etherscanUrl} target="_blank">Etherscan <Icon name="external-link" /></a>
        </Step>
        <Step
          state={step1State}
          icon={<Svg svg={cubeSvg} size="1.2em" viewBox="0 0 23 27" />}
        >
          <p>Userfeeds Address</p>
          <span>Visible to publisher</span>
        </Step>
        <Step
          state={step2State}
          icon={<Icon class={style.icon} name="check" />}
        >
          <p>Put on whitelist</p>
          <span>All set!</span>
        </Step>
      </div>
    </div>
  );
};

export default Steps;

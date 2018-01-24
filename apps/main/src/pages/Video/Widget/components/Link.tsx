import React, { Component } from 'react';
import classnames from 'classnames/bind';

import Icon from '@linkexchange/components/src/Icon';
import ProgressBar from '@linkexchange/components/src/ProgressBar';

import { ILink } from '@linkexchange/types/link';

import * as style from './link.scss';
const cx = classnames.bind(style);

interface IProps {
  link: ILink;
  linkDuration: number;
  tokenSymbol?: string;
  position?: 'top' | 'bottom';
}

interface IState {
  linkProgress: number;
}

export default class Link extends Component<IProps, IState> {
  timeout: number;
  startTime: number;

  constructor(props) {
    super(props);

    this.startTime = Date.now();
    this._runProgress();
    this.state = {
      linkProgress: 0,
    };
  }

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.linkDuration !== this.props.linkDuration) {
      window.clearTimeout(this.timeout);
      this.setState({ linkProgress: 0 });
      this.startTime = Date.now();
      this._runProgress();
    }
  }

  render() {
    const { link, tokenSymbol, position } = this.props;
    const { linkProgress } = this.state;

    return (
      <div className={cx(style.self, { top: position === 'top' })}>
        <ProgressBar className={style.progress} fillClassName={style.fill} progress={linkProgress} />
        <div>
          <p className={style.title}>
            {link.title}: {link.summary}
          </p>
          <a className={style.target}>{link.target}</a>
        </div>
        <div className={style.token}>
          Sponsored with:
          <div className={style.tokenSymbol}>{tokenSymbol}</div>
        </div>
      </div>
    );
  }

  _runProgress = () => {
    this.timeout = window.setTimeout(() => {
      const linkProgress = (Date.now() - this.startTime) / (this.props.linkDuration - 100) * 100;
      this.setState({ linkProgress });
      this._runProgress();
    }, 100);
  };
}

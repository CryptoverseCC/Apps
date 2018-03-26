import React, { Component } from 'react';
import classnames from 'classnames/bind';

import { ILink } from '@linkexchange/types/link';

import * as style from './link.scss';
const cx = classnames.bind(style);

interface IProps {
  link: ILink | undefined;
  linkDuration: number;
  tokenSymbol?: string;
  position?: 'top' | 'bottom';
}

export default class Link extends Component<IProps> {
  fillRef: HTMLDivElement;
  animation: any;

  componentDidMount() {
    this._runProgress(this.props.linkDuration);
  }

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.linkDuration !== this.props.linkDuration || newProps.link !== this.props.link) {
      this._runProgress(newProps.linkDuration);
    }
  }

  render() {
    const { link = { title: '', summary: '', target: '' }, tokenSymbol, position } = this.props;

    return (
      <div className={cx(style.self, { top: position === 'top' })}>
        <div className={style.progress}>
          <div ref={this._onRef} className={style.fill} />
        </div>
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

  _onRef = (ref) => {
    this.fillRef = ref;
  };

  _runProgress = (duration) => {
    try {
      if (this.fillRef) {
        if (this.animation) {
          this.animation.cancel();
        }
        this.animation = (this.fillRef as any).animate([{ width: '0' }, { width: '100%' }], duration - 100);
      }
    } catch (e) {
      // Browser doesn't support .animate()
    }
  };
}

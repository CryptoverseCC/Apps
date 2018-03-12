import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { ILink } from '@linkexchange/types/link';
import { IWidgetSettings } from '@linkexchange/types/widget';
import TokenLogo from '@linkexchange/components/src/TokenLogo';

import * as style from './menu.scss';

class Circle extends PureComponent<{ timeout: number }> {
  static RADIUS = 58;
  static CIRCUMFERENCE = 2 * Math.PI * Circle.RADIUS;

  animation: any;
  circle: SVGCircleElement;

  render() {
    const { children } = this.props;

    return (
      <div className={style.circle}>
        <svg viewBox="0 0 120 120" className={style.svg}>
          <circle cx="60" cy="60" r={Circle.RADIUS} fill="none" stroke="transparent" strokeWidth="4" />
          <circle
            className={style.outerCircle}
            ref={this.onRef}
            cx="60"
            cy="60"
            r={Circle.RADIUS}
            fill="none"
            strokeWidth="4"
            strokeDasharray={Circle.CIRCUMFERENCE}
            strokeDashoffset={Circle.CIRCUMFERENCE}
          />
        </svg>
        {children}
      </div>
    );
  }

  start(stoped: boolean) {
    if (this.animation) {
      this.animation.cancel();
    }

    try {
      this.animation = (this.circle as any).animate(
        [{ strokeDashoffset: Circle.CIRCUMFERENCE }, { strokeDashoffset: 0 }],
        this.props.timeout * 1000,
      );
      if (stoped) {
        this.animation.pause();
      }
    } catch (e) {
      // Browser don't support .animate()
    }
  }

  private onRef = (ref: SVGCircleElement) => {
    this.circle = ref;
  };
}

class Menu extends PureComponent<{
  onClick: () => void;
  widgetSettings: IWidgetSettings;
}> {
  circle: Circle;

  render() {
    const { onClick, widgetSettings, children } = this.props;

    return (
      <div className={style.self}>
        <div className={style.trigger} onClick={onClick}>
          <Circle ref={this.onCircleRef} timeout={widgetSettings.timeslot}>
            <TokenLogo className={style.icon} asset={widgetSettings.asset} />
          </Circle>
          <span className={style.putLink}>
            <FormattedMessage id="banner.putYourLink" defaultMessage="Put your link here" />
          </span>
        </div>
        {children}
      </div>
    );
  }

  restart = (stoped = false) => {
    if (this.circle) {
      this.circle.start(stoped);
    }
  };

  resume = () => {
    if (this.circle && this.circle.animation) {
      this.circle.animation.play();
    }
  };

  pause = () => {
    if (this.circle && this.circle.animation) {
      this.circle.animation.pause();
    }
  };

  private onCircleRef = (ref: Circle) => {
    this.circle = ref;
  };
}

export default Menu;

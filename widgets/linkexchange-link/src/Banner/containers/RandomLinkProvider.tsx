import React, { PureComponent } from 'react';

import { ILink } from '@linkexchange/types/link';

interface IRandomLinkProviderProps {
  onLink(link: ILink, startImmediately?: boolean): void;
  links: ILink[];
  timeslot: number;
}

class Timeout {
  private timeoutId: number | null = null;
  private remaining: number = 0;
  private startTime: number = 0;

  constructor(private func: () => void, private timeout: number, startImmediately = true) {
    this.remaining = timeout;
    if (startImmediately) {
      this.resume();
    }
  }

  pause() {
    this.remaining = this.remaining - (Date.now() - this.startTime);
    this.clear();
  }

  resume() {
    this.startTime = Date.now();
    this.timeoutId = window.setTimeout(this.func, this.remaining);
  }

  clear() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }
}

export default class RandomLinkProvider extends PureComponent<IRandomLinkProviderProps> {
  private timeout: Timeout;
  private currentLink: ILink | undefined;

  componentDidMount() {
    if (this.props.links && this.props.links.length > 0) {
      this.setCurrentLink(this.getRandomLink(this.props.links), this.props.links);
    }
  }

  componentWillReceiveProps(newProps: IRandomLinkProviderProps) {
    if (newProps.links !== this.props.links && newProps.links.length > 0) {
      this.setCurrentLink(this.getRandomLink(newProps.links), newProps.links);
    }
  }

  prev = () => {
    const { links } = this.props;
    if (this.currentLink) {
      const currentIndex = links.indexOf(this.currentLink);
      this.setCurrentLink(links[currentIndex - 1 < 0 ? links.length - 1 : currentIndex - 1], links, false);
    }
  };

  next = () => {
    const { links } = this.props;
    if (this.currentLink) {
      const currentIndex = links.indexOf(this.currentLink);
      this.setCurrentLink(links[currentIndex + 1 >= links.length ? 0 : currentIndex + 1], links, false);
    }
  };

  pause = () => {
    if (this.timeout) {
      this.timeout.pause();
    }
  };

  resume = () => {
    if (this.timeout) {
      this.timeout.resume();
    }
  };

  render() {
    return null;
  }

  private getRandomLink(links: ILink[]): ILink {
    let randomScore = Math.random() * links.reduce((acc, { score }) => acc + score, 0);

    if (randomScore === 0) {
      const index = Math.floor(Math.random() * (links.length - 1));
      return links[index];
    }

    // fileter instead of find to make TS happy
    const link = links.filter(({ score }) => {
      randomScore -= score;
      return randomScore < 0;
    });

    return link[0];
  }

  private setTimeout(links, startImmediately?: boolean) {
    if (this.timeout) {
      this.timeout.clear();
    }

    this.timeout = new Timeout(
      () => {
        this.setCurrentLink(this.getRandomLink(links), links);
      },
      this.props.timeslot * 1000,
      startImmediately,
    );
  }

  private setCurrentLink = (link: ILink, links: ILink[], startImmediately = true) => {
    this.currentLink = link;
    this.props.onLink(link, startImmediately);
    this.setTimeout(links, startImmediately);
  };
}

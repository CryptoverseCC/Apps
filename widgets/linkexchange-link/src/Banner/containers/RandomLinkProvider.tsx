import React, { PureComponent } from 'react';

import { ILink } from '@userfeeds/types/link';

interface IRandomLinkProviderProps {
  onLink(link: ILink): void;
  links: ILink[];
  timeslot: number;
}

export default class RandomLinkProvider extends PureComponent<IRandomLinkProviderProps> {

  _timeout: number | null = null;
  _currentLink: ILink | undefined;

  componentDidMount() {
    if (this.props.links && this.props.links.length > 0) {
      this._setCurrentLink(this._getRandomLink(this.props.links), this.props.links);
    }
  }

  componentWillReceiveProps(newProps: IRandomLinkProviderProps) {
    if (newProps.links !== this.props.links && newProps.links.length > 0) {
      this._setCurrentLink(this._getRandomLink(newProps.links), newProps.links);
    }
  }

  prev = () => {
    const { links } = this.props;
    if (this._currentLink) {
      const currentIndex = links.indexOf(this._currentLink);
      this._setCurrentLink(links[currentIndex - 1 < 0 ? links.length - 1 : currentIndex - 1], links);
    }
  }

  next = () => {
    const { links } = this.props;
    if (this._currentLink) {
      const currentIndex = links.indexOf(this._currentLink);
      this._setCurrentLink(links[currentIndex + 1 >= links.length ? 0 : currentIndex + 1], links);
    }
  }

  render() {
    return null;
  }

  _getRandomLink(links: ILink[]): ILink {
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

  _setTimeout(links) {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = window.setTimeout(() => {
      this._setCurrentLink(this._getRandomLink(links), links);
    }, this.props.timeslot * 1000);
  }

  _setCurrentLink = (link: ILink, links: ILink[]) => {
    this._currentLink = link;
    this.props.onLink(link);
    this._setTimeout(links);
  }
}

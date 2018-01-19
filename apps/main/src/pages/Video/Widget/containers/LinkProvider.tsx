import React, { PureComponent } from 'react';

import { ILink } from '@linkexchange/types/link';

interface ILinkProviderProps {
  onLink(link: ILink): void;
  links: ILink[];
  minTimeslot?: number;
  timeslot?: number;
}

export default class LinkProvider extends PureComponent<ILinkProviderProps> {

  static defaultProps = {
    minTimeslot: 1000,
    timeslot: 5 * 1000,
  };

  _timeout: number | null = null;
  _timeouts: number[] = [];
  _currentLinkIndex: number | undefined;

  componentDidMount() {
    if (this.props.links && this.props.links.length > 0) {
      this._calculateTimeslots(this.props.links);
    }
  }

  componentWillReceiveProps(newProps: ILinkProviderProps) {
    if (newProps.links !== this.props.links && newProps.links.length > 0) {
      this._calculateTimeslots(newProps.links);
    }
  }

  render() {
    return null;
  }

  _run = (index: number, links: ILink[]) => {
    this.props.onLink(links[index]);

    this._timeout = window.setTimeout(() => {
      const nextIndex = index + 1 >= this._timeouts.length ? 0 : index + 1;
      this._run(nextIndex, links);
    }, this._timeouts[index]);
  }

  _calculateTimeslots = (links: ILink[]) => {
    if (this._timeout !== null) {
      clearTimeout(this._timeout);
    }

    this._timeouts = calculateTimeSlots(
      links.map(({ score }) => score),
      this.props.timeslot!,
      this.props.minTimeslot!,
    );

    this._run(0, links);
  }
}

export const calculateTimeSlots = (scores: number[], totalTime: number, shortestTimeslot: number) => {
  const toDistribute = totalTime - (scores.length * shortestTimeslot);
  if (toDistribute < 0) {
    throw Error(`Total time (${totalTime}) is smaller than ${scores.length}*${shortestTimeslot}`);
  }
  const scoreSum = scores.reduce((acc, score) => acc + score, 0);

  let timeslots: number[];
  if (scoreSum !== 0) {
    timeslots = scores.map((score) => score / scoreSum * toDistribute);
  } else {
    timeslots = scores.map((score) => 1 / scores.length * toDistribute);
  }

  return timeslots.map((t) => t + shortestTimeslot);
};

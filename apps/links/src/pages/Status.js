import React, { Component } from 'react';

import style from './Status.scss';

export default class Status extends Component {

  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);

    const context = params.get('context');
    const algorithm = params.get('algorithm');
    const whitelist = params.get('whitelist') || '';
    const linkId = params.get('linkId');

    this.state = {
      linkId,
      context,
      algorithm,
      whitelist,
      publisherNote: params.get('publisherNote'),
    };

    this._fetchLinks(context, algorithm, whitelist)
      .then(this._findLinkById(linkId))
      .then((link) => {
        if (!link) {
          const setTimeoutForFetch = () => {
            setTimeout(() => {
              this._fetchLinks(context, algorithm, whitelist)
                .then(this._findLinkById(linkId))
                .then((link) => !link && setTimeoutForFetch());
            }, 5000);
          };

          setTimeoutForFetch();
        }
      });
  }

  render() {
    if (!this.state.context) {
      return null;
    }

    const { link } = this.state;
    return (
      <div className={style.this}>
        <h1>Link Status:</h1>
        <span><b>Publisher message:</b> {this.state.publisherNote}</span>
        { !link && (
          <p className={style.waiting}>
            Waiting
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </p>
          )}
        { link && (
          <div>
            <p>Whitelisted = {link.whitelisted ? 'true' : 'false'}</p>
            <p>Probability = {link.probability}%</p>
          </div>
        )}
      </div>
    );
  }

  _fetchLinks = async (context, algorithm, whitelist) => {
    const baseURL = 'https://api.userfeeds.io/ranking';

    try {
      const allLinksRequest = fetch(`${baseURL}/${context}/${algorithm}/`)
        .then((res) => res.json());
      const whitelistedLinksRequest = fetch(`${baseURL}/${context}/${algorithm}/?whitelist=${whitelist}`)
        .then((res) => res.json())
        .then(this._calculateProbability);

      const [allLinks, whitelistedLinks] = await Promise.all([allLinksRequest,
        whitelistedLinksRequest]);
      const links = allLinks.items.map((link) => {
        const whitelisted = whitelistedLinks.items.find((a) => link.id === a.id);

        return {
          ...link,
          whitelisted: !!whitelisted,
          probability: whitelisted ? whitelisted.probability : '-',
        };
      });

      return links;
    } catch (_) {
      return [];
    }
  };

  _findLinkById = (linkId) => (links) => {
    const link = links.find((l) => l.id === linkId);
    this.setState({ link });

    return link;
  };

  _calculateProbability = ({ items: links }) => {
    const scoreSum = links.reduce((acc, { score }) => acc + score, 0);
    const probabilities = links.map(({ score }) => (score / scoreSum) * 100);
    const roundedDownProbabilities = probabilities
      .map((probability) => Math.floor(probability));
    const roundedDownProbabilitiesSum = roundedDownProbabilities
      .reduce((acc, probability) => acc + probability, 0);

    let roundedProbabilities;
    if (roundedDownProbabilitiesSum === 100) {
      roundedProbabilities = roundedDownProbabilities;
    } else {
      const toDistribute = 100 - roundedDownProbabilitiesSum;
      const toRoundUp = roundedDownProbabilities
        .map((p, i) => ([probabilities[i] - p, i]))
        .sort(([p1], [p2]) => p2 - p1)
        .slice(0, toDistribute)
        .reduce((acc, [_, i]) => {
          acc[i] = true;
          return acc;
        }, []);

      roundedProbabilities = roundedDownProbabilities
        .map((probability, index) => toRoundUp[index] ? probability + 1 : probability);
    }

    return {
      items: links.map((link, i) => Object.assign({ probability: roundedProbabilities[i] }, link)),
    };
  };
}

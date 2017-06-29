import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import AddLinkDialog from '../components/AddLinkDialog';
import WidgetDetails from '../components/WidgetDetails';
import LinksList from '../components/LinksList';

import style from './Details.scss';

export default class Details extends Component {

  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);

    const context = params.get('context');
    const algorithm = params.get('algorithm');
    const whitelist = params.get('whitelist');

    this.state = { context, algorithm, whitelist, fetching: true, isModalOpen: false };

    this._fetchAds(context, algorithm, whitelist)
      .then(({ links, _sum }) => {
        setTimeout(() => this.setState({
          links,
          fetching: false,
        }), 1000);
      });
  }

  render() {
    if (!this.state.context) {
      return null;
    }

    if (this.state.fetching) {
      return (
        <div className={style.loader}>
          <CircularProgress size={80} thickness={5} />
        </div>
      );
    }
    const { context, algorithm, whitelist, links } = this.state;

    return (
      <div className={style.this}>
        <Paper className={style.paper}>
          <div className={style.header}>
            <TextWithLabel label="Userfeeds address" text={context} />
            <RaisedButton
              label="Whitelist"
              onTouchTap={this._gotoWhitelist}
              style={{ marginLeft: 'auto' }}
            />
            <RaisedButton label="Add link" onTouchTap={this._onAddLink} />
          </div>
          <div className={style.content}>
            <WidgetDetails
              className={style.details}
              context={context}
              algorithm={algorithm}
              whitelist={whitelist}
              links={links}
            />
            <LinksList links={links} context={context} />
          </div>
        </Paper>
        <AddLinkDialog
          context={this.state.context}
          open={this.state.isModalOpen}
          onRequestClose={this._onModalCloseRequest}
        />
      </div>
    );
  }

  _onAddLink = () => {
    this.setState({ isModalOpen: true });
  };

  _onModalCloseRequest = () => {
    this.setState({ isModalOpen: false });
  };

  _gotoWhitelist = () => {
    const { context, algorithm, whitelist } = this.state;

    const baseUrl = 'https://userfeeds.io/';
    const path = 'apps/widgets/#/details/';

    const contextQP = `?context=${context}`;
    const algorithmQP = `&algorithm=${algorithm}`;
    const whitelistQP = whitelist ? `&whitelist=${whitelist}` : '';
    window.open(baseUrl + path + contextQP + algorithmQP + whitelistQP, '_blank');
  };

  _fetchAds = (context, algorithm, whitelist) => {
    const baseURL = 'https://api.userfeeds.io/ranking';
    return fetch(`${baseURL}/${context}/${algorithm}/?whitelist=${whitelist}`)
      .then((res) => res.json())
      .then(({ items: ads }) => {
        if (ads.length === 0) {
          throw new Error('No Data');
        }

        const scoreSum = ads.reduce((acc, { score }) => acc + score, 0);
        const probabilities = ads.map(({ score }) => (score / scoreSum) * 100);
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
          sum: scoreSum,
          links: ads.map((ad, i) => Object.assign({ probability: roundedProbabilities[i] }, ad)),
        };
      });
  }
}

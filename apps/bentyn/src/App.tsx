import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import RandomLinkProvider from '@linkexchange/widgets/src/scenes/Banner/containers/RandomLinkProvider';
import { fetchLinks } from '@linkexchange/widgets/src/ducks/links';
import { visibleLinks } from '@linkexchange/widgets/src/selectors/links';
import { ILink } from '@userfeeds/types/link';

import { IRootState } from './store';
import Link from './components/Link';

interface IAppState {
  currentLink?: ILink;
}

const mapStateToProps = (state: IRootState) => ({
  links: visibleLinks(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchLinks: () => dispatch(fetchLinks()),
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);
type TAppProps = typeof State2Props & typeof Dispatch2Props;

class App extends Component<TAppProps, IAppState> {

  state: IAppState = {};

  componentDidMount() {
    this.props.fetchLinks();
  }

  render() {
    const { currentLink } = this.state;
    const { links } = this.props;
    return (
      <div>
        {currentLink && <Link link={currentLink} />}
        <RandomLinkProvider
          onLink={this._onLink}
          links={links}
          timeslot={5}
        />
      </div>
    );
  }

  _onLink = (currentLink: ILink) => {
    this.setState({ currentLink });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

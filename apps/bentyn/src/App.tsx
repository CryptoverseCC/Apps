import React, { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import { fetchLinks } from '@linkexchange/widgets/src/ducks/links';
import { visibleLinks } from '@linkexchange/widgets/src/selectors/links';
import { ILink } from '@userfeeds/types/link';

import { IRootState } from './store';
import Link from './components/Link';
import LinkProvider from './containers/LinkProvider';

interface IAppState {
  currentLink?: ILink;
}

const mapStateToProps = (state: IRootState) => ({
  widget: state.widget,
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
    const { links, widget } = this.props;
    const { currentLink } = this.state;

    return (
      <div>
        {currentLink && <Link link={currentLink} tokenSymbol={widget.tokenDetails.symbol} />}
        <LinkProvider links={links} onLink={this._onLink} />
      </div>
    );
  }

  _onLink = (currentLink: ILink) => {
    this.setState({ currentLink });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

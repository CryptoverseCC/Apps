import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from '../ducks/index';
import { ITokenDetailsState, loadTokenDetails } from '../ducks/widget';

const mapStateToProps = ({ widget: { tokenDetails } }: IRootState) => ({
  tokenDetails: {
    ...tokenDetails,
    balanceWithDecimalPoint: tokenDetails.balance
      .shift(-tokenDetails.decimals.toNumber())
      .toNumber(),
  },
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ loadTokenDetails }, dispatch);

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type ITokenDetailsProps = typeof State2Props & typeof Dispatch2Props & {
  tokenDetails: ITokenDetailsState;
  loadTokenDetails: any;
  render: any;
};


export class TokenDetailsProvider extends Component<ITokenDetailsProps, {}> {
  componentDidMount() {
    this.props.loadTokenDetails();
  }

  render() {
    const { tokenDetails, render } = this.props;
    return tokenDetails.loaded && render(tokenDetails);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  TokenDetailsProvider,
);

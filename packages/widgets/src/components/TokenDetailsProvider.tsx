import { Component, h } from 'preact';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';

import { IRootState } from '../ducks/index';
import { ITokenDetailsState, loadTokenDetails } from '../ducks/widget';

interface IProps {
  tokenDetails: ITokenDetailsState;
  loadTokenDetails: any;
  render: any;
}

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

export class TokenDetailsProvider extends Component<IProps, {}> {
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

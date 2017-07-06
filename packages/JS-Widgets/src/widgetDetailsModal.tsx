import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from './reducers';
import { modalActions } from './actions/modal';
import { ILink } from './types';

import Switch from './components/utils/switch';

import web3 from './utils/web3';
import Plus from './components/plus';
import AddLink from './components/addLink';
import Button from './components/button';
import TextWithLabel from './components/textWithLabel';

import LinksList from './linksList';

import { openUserfeedsUrl } from './utils/openUserfeedsUrl';

import * as style from './widgetDetailsModal.scss';

interface IWidgetDetailsModalState {
  viewType: 'details' | 'addLink';
  totalEarnings: number;
}

const mapStateToProps = ({ links, widget }: IRootState) => ({
  links: links.links,
  ...widget,
});

const mapDispatchToProps = (dispatch) => ({
  showThankYouModal: (linkId: string) => dispatch(modalActions.open({
    modalName: 'thankYou',
    modalProps: { linkId }
  })),
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type IWidgetDetailsModalProps = typeof State2Props & typeof Dispatch2Props;

@connect(mapStateToProps, mapDispatchToProps)
export default class WidgetDetailsModal extends Component<IWidgetDetailsModalProps, IWidgetDetailsModalState> {

  constructor(props: IWidgetDetailsModalProps) {
    super(props);
    this.state = {
      totalEarnings: 0,
      viewType: 'details',
    };
    this._calcTotalEarnings(props.links);
  }

  componentWillReceiveProps(newProps: IWidgetDetailsModalProps) {
    this._calcTotalEarnings(newProps.links);
  }

  render({ context, links, algorithm, whitelist, web3Available = true }: IWidgetDetailsModalProps,
    { totalEarnings, viewType }: IWidgetDetailsModalState) {
    return (
      <div>
        <div class="row">
          <Button
            hidden={viewType !== 'details'}
            onClick={this._onOpenInSeparateWindowClick}
          >
            Open in<br />
            separate<br />
            window
          </Button>
          <TextWithLabel label="Userfeeds address" text={context} />
          <Button
            style={{ marginLeft: 'auto' }}
            hidden={!web3Available || !whitelist || viewType !== 'details'}
            onClick={this._onWhitelistClick}
          >
            Whitelist
          </Button>
          <Button
            style={{ marginLeft: 'auto' }}
            disabled={!web3Available}
            onClick={this._onAddLinkClick}
          >
            <Switch expresion={viewType}>
              <Switch.Case condition="details">
                <Switch expresion={web3Available}>
                  <Switch.Case condition={true}>
                    <Plus reverseOnHover />  New Link
                  </Switch.Case>
                  <Switch.Case condition={false}>
                    MetaMask not available (o:
                  </Switch.Case>
                </Switch>
              </Switch.Case>
              <Switch.Case condition="addLink">
                Cancel
              </Switch.Case>
            </Switch>
          </Button>
        </div>
        <div class={style.details}>
          <div class={style.summary}>
            <TextWithLabel label="Total Earnings" text={totalEarnings} />
            <TextWithLabel label="Max ad slots" text="10 (hardcode)" />
            <TextWithLabel label="Algorithm" text={algorithm} />
            <TextWithLabel label="Feed type" text="Text (hardcode)" />
          </div>
          <Switch expresion={viewType}>
            <Switch.Case condition="details">
              <LinksList links={links} context={context} />
            </Switch.Case>
            <Switch.Case condition="addLink">
              <AddLink context={context} onSuccess={this._onLinkAdded} onError={this._onLinkNotAdded} />
            </Switch.Case>
          </Switch>
        </div>
      </div>
    );
  }

  _calcTotalEarnings = (links: ILink[]) => {
    const totalEarnings = links
      ? links.reduce((acc, { score }) => acc + score, 0)
      : 0;

    this.setState({ totalEarnings: web3.fromWei(totalEarnings, 'ether') });
  };

  _onOpenInSeparateWindowClick = () => {
    openUserfeedsUrl('apps/widgets/#/details/', this.props);
  };

  _onWhitelistClick = () => {
    openUserfeedsUrl('apps/links/#/whitelist/', this.props);
  };

  _onAddLinkClick = () => {
    this.setState(({ viewType }) => ({ viewType: viewType === 'addLink' ? 'details' : 'addLink' }));
  };

  _onLinkAdded = (linkId) => {
    this.setState({ viewType: 'details' });
    this.props.showThankYouModal(linkId);
  };

  _onLinkNotAdded = () => {
    this.setState({ viewType: 'details' });
  };
}

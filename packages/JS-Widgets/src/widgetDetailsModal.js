import { h, Component } from 'preact';

import style from './widgetDetailsModal.scss';

import Switch from './components/utils/switch';

import web3 from './utils/web3';
import Plus from './components/plus';
import Modal from './components/modal';
import AddAd from './components/addAd';
import Button from './components/button';
import TextWithLabel from './components/textWithLabel';

import AdsList from './adsList';

import { checkNetwork, checkCurrentAccount } from './utils/ethereum';
import { openUserfeedsUrl } from './utils/openUserfeedsUrl';

export default class WidgetDetailsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewType: 'details', // 'details' | 'addAd'
    };
    this._calcTotalEarnings(props);
  }

  componentWillReceiveProps(newProps) {
    this._calcTotalEarnings(newProps);
  }

  render({ isOpen, web3Available, onCloseRequest, onShowThankYouRequest, context, ads, algorithm, whitelist }, { totalEarnings, viewType }) {
    return (
      <Modal isOpen={isOpen} onCloseRequest={onCloseRequest}>
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
            style={{marginLeft: 'auto'}}
            hidden={!web3Available || !whitelist || viewType !== 'details'}
            onClick={this._onWhitelistClick}
          >
            Whitelist
          </Button>
          <Button
            style={{marginLeft: 'auto'}}
            disabled={!web3Available}
            onClick={this._onAddAdClick}
          >
            <Switch expresion={viewType}>
              <Switch.Case condition="details">
                <Switch expresion={web3Available}>
                  <Switch.Case condition={true}>
                    <Plus reverseOnHover />  New Ad
                  </Switch.Case>
                  <Switch.Case condition={false}>
                    MetaMask not available (o:
                  </Switch.Case>
                </Switch>
              </Switch.Case>
              <Switch.Case condition="addAd">
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
              <AdsList ads={ads} context={context} onShowThankYouRequest={onShowThankYouRequest} />
            </Switch.Case>
            <Switch.Case condition="addAd">
              <AddAd context={context} onSuccess={this._onAdAdded} onError={this._onAdNotAdded} />
            </Switch.Case>
          </Switch>
        </div>
      </Modal>
    );
  }

  _calcTotalEarnings = (props) => {
    const totalEarnings = props.ads
      ? props.ads.reduce((acc, { score }) => acc + score, 0)
      : 0;

    this.setState({ totalEarnings: web3.fromWei(totalEarnings, 'ether') });
  };

  _onOpenInSeparateWindowClick = () => {
    openUserfeedsUrl('apps/widgets/#/details/', this.props);
  };

  _onWhitelistClick = () => {
    const [network, account] = this.props.whitelist.split(':');
    if (checkNetwork(network) && checkCurrentAccount(account)) {
      openUserfeedsUrl('apps/links/#/whitelist/', this.props);
    } else {
      window.alert('Please change your current network and address to ' + this.props.whitelist);
    }
  };

  _onAddAdClick = () => {
    this.setState(({ viewType }) => ({ viewType: viewType === 'addAd' ? 'details' : 'addAd' }));
  };

  _onAdAdded = (linkId) => {
    this.setState({ viewType: 'details' });
    this.props.onShowThankYouRequest(linkId);
  };

  _onAdNotAdded = () => {
    this.setState({ viewType: 'details' });
  };
}

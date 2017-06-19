import { h, Component } from 'preact';

import './adDetails.css';

import Switch from './components/utils/switch';

import Ad from './components/ad';
import BidAd from './components/bidAd';
import Date from './components/date';
import Label from './components/label';
import Button from './components/button';
import TextWithLabel from './components/textWithLabel';

export default class AdDetails extends Component {

  state = {
    bidView: false,
  };

  render({ ad, ads, context }, { bidView }) {
    return (
      <div class="ad-details">
        <Switch expresion={bidView}>
          <Switch.Case condition={false}>
            <div class="header">
              <Label>Ad Preview:</Label>
              <Button style={{ marginLeft: 'auto' }} onClick={this._onBidClick}>⇈ Bid Ad</Button>
            </div>
            <div class="ad-preview">
              <Ad ad={ad} />
            </div>
            <div class="footer">
              <TextWithLabel label="Current Ranking Position" text={ads.indexOf(ad) + 1} />
              <TextWithLabel label="Created"><Date date={ad.created_at} /></TextWithLabel>
              <TextWithLabel label="Last bid" text={ad.bids} />
            </div>
          </Switch.Case>
          <Switch.Case condition={true}>
            <BidAd ad={ad} ads={ads} context={context} onFinish={this._onBidFinish} />
          </Switch.Case>
        </Switch>
      </div>
    );
  }

  _onBidFinish = () => {
    this.setState({ bindView: false });
  };

  _onBidClick = () => {
    this.setState(({ bidView }) => ({ bidView: !bidView }));
  };
}

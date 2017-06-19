import { h, Component } from 'preact';

import style from './adDetails.scss';

import { checkNetwork } from './utils/ethereum';

import Switch from './components/utils/switch';

import Ad from './components/ad';
import BidAd from './components/bidAd';
import Date from './components/date';
import Label from './components/label';
import Button from './components/button';
import TextWithLabel from './components/textWithLabel';

export default class AdDetails extends Component {

  constructor(props) {
    super(props);

    const network = props.context.split(':')[0];
    this.state = {
      bidView: false,
      isOnCorrectNetwork: checkNetwork(network),
    };
  }

  render({ ad, ads, context }, { bidView, isOnCorrectNetwork }) {
    return (
      <div class={style.this}>
        <Switch expresion={bidView}>
          <Switch.Case condition={false}>
            <div class={style.header}>
              <Label>Ad Preview:</Label>
              <Button
                style={{ marginLeft: 'auto' }}
                onClick={this._onBidClick}
                disabled={!isOnCorrectNetwork}
              >
                ⇈ Bid Ad
              </Button>
            </div>
            <div class={style.adPreview}>
              <Ad ad={ad} />
            </div>
            <div class={style.footer}>
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

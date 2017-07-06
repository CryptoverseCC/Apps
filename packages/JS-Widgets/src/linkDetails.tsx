import { h, Component } from 'preact';

import { checkNetwork } from './utils/ethereum';

import Switch from './components/utils/switch';

import Link from './components/link';
import BidLink from './components/bidLink';
import Date from './components/date';
import Label from './components/label';
import Button from './components/button';
import TextWithLabel from './components/textWithLabel';

import * as style from  './linkDetails.scss';

interface ILinkDetailsProps {
  link: any;
  links: Array<any>;
  context: string;
  onShowThankYouRequest?(linkId: string): void;
}

interface ILinkDetailsState {
  bidView: boolean;
  isOnCorrectNetwork: boolean;
}

export default class LinkDetails extends Component<ILinkDetailsProps, ILinkDetailsState> {

  constructor(props) {
    super(props);

    const [network] = props.context.split(':');
    this.state = {
      bidView: false,
      isOnCorrectNetwork: checkNetwork(network),
    };
  }

  render({ link, links, context }: ILinkDetailsProps, { bidView, isOnCorrectNetwork }: ILinkDetailsState) {
    return (
      <div class={style.self}>
        <Switch expresion={bidView}>
          <Switch.Case condition={false}>
            <div class={style.header}>
              <Label>Ad Preview:</Label>
              <Button
                style={{ marginLeft: 'auto' }}
                onClick={this._onBidClick}
                disabled={!isOnCorrectNetwork}
              >
                ⇈ Bid Link
              </Button>
            </div>
            <div class={style.linkPreview}>
              <Link link={link} />
            </div>
            <div class={style.footer}>
              <TextWithLabel label="Current Ranking Position" text={links.indexOf(link) + 1} />
              <TextWithLabel label="Created"><Date date={link.created_at} /></TextWithLabel>
              <TextWithLabel label="Last bid" text={link.bids} />
            </div>
          </Switch.Case>
          <Switch.Case condition={true}>
            <BidLink link={link} links={links} context={context} onSuccess={this._onBidSuccess} onError={this._onBidError} />
          </Switch.Case>
        </Switch>
      </div>
    );
  }

  _onBidSuccess = (linkId) => {
    if (this.props.onShowThankYouRequest) {
      this.props.onShowThankYouRequest(linkId);
    }
    this.setState({ bidView: false });
  };

  _onBidError = () => {
    this.setState({ bidView: false });
  };

  _onBidClick = () => {
    this.setState(({ bidView }) => ({ bidView: !bidView }));
  };
}

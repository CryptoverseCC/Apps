import { h, Component } from 'preact';

import style from './widgetDetailsModal.scss';

import Switch from './components/utils/switch';

import Plus from './components/plus';
import Modal from './components/modal';
import AddAd from './components/addAd';
import Button from './components/button';
import TextWithLabel from './components/textWithLabel';

import AdsList from './adsList';

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

  render({ isOpen, onCloseRequest, context, ads, algorithm }, { totalEarnings, viewType }) {
    return (
      <Modal isOpen={isOpen} onCloseRequest={onCloseRequest}>
        <div class="row">
          <TextWithLabel label="Userfeeds address" text={context} />
          <Button
            style={{marginLeft: 'auto'}}
            onClick={this._onAddAdClick}
          >
            <Switch expresion={viewType}>
              <Switch.Case condition="details">
                <Plus reverseOnHover />  New Ad
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
            <TextWithLabel label="Max ad slots" text={10} />
            <TextWithLabel label="Algorithm" text={algorithm} />
            <TextWithLabel label="Feed type" text="Text" />
          </div>
          <Switch expresion={viewType}>
            <Switch.Case condition="details">
              <AdsList ads={ads} context={context} />
            </Switch.Case>
            <Switch.Case condition="addAd">
              <AddAd context={context} onFinish={this._onAdAdded} />
            </Switch.Case>
          </Switch>
        </div>
      </Modal>
    );
  }

  _calcTotalEarnings = (props) => {
    this.setState({
      totalEarnings: props.ads && props.ads.reduce((acc, { score }) => acc + score, 0),
    });
  };

  _onAddAdClick = () => {
    this.setState(({ viewType }) => ({ viewType: viewType === 'addAd' ? 'details' : 'addAd' }));
  };

  _onAdAdded = () => {
    this.setState({ viewType: 'details' });
  };
}

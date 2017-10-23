import React, { PureComponent } from 'react';

import Paper from '@userfeeds/apps-components/src/Paper';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import { EWidgetSize } from '../../../types';

import TokenLogo from '../../../components/TokenLogo';

import * as style from './widgetSpecification.scss';
import { WIDGET_NETWORKS } from '@userfeeds/apps-components/src/Form/Asset';

interface IWidgetSpecificationProps {
  size: EWidgetSize;
  algorithm: string;
  asset: string;
  ref?(ref: any): void;
}

export default class WidgetSpecification extends PureComponent<IWidgetSpecificationProps> {

  render() {
    const { size, algorithm, asset } = this.props;

    return (
      <div className={style.self}>
        <h2>Widget Specification</h2>
        <div className={style.row}>
          <Paper style={{ flex: 1, marginRight: '15px' }}>
            <TextWithLabel label="Size" text={size} />
          </Paper>
          <Paper style={{ flex: 1, marginLeft: '15px' }}>
            <TextWithLabel label="Type" text="Text" />
          </Paper>
        </div>
        <div className={style.row}>
          <Paper style={{ flex: 1, marginRight: '15px' }}>
            <TextWithLabel label="Token">
              <TokenLogo className={style.tokenLogo} asset={asset} /> {this._getTokenName()}
        </TextWithLabel>
          </Paper>
          <Paper style={{ flex: 1, marginLeft: '15px' }}>
            <TextWithLabel label="Algorithm">
              {algorithm}
            </TextWithLabel>
          </Paper>
        </div>
      </div>
    );
  }

  _getTokenName() {
    const [network, token] = this.props.asset.split(':');
    if (typeof token === 'undefined') {
      return 'Ether';
    }
    const tokens = WIDGET_NETWORKS[WIDGET_NETWORKS.findIndex((e) => e.value.toLowerCase() === network)].tokens;
    const index = tokens.findIndex((e) => e.value.toLowerCase() === token);
    if (index >= 0) {
      return tokens[index].label;
    } else {
      return `ERC20 (${token})`;
    }
  }
}

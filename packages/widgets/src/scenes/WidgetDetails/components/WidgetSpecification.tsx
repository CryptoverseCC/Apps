import React, { PureComponent } from 'react';

import Paper from '@userfeeds/apps-components/src/Paper';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import { TWidgetSize } from '../../../types';

import EthereumLogo from '../../../components/EthereumLogo';

import * as style from './widgetSpecification.scss';

interface IWidgetSpecificationProps {
  size: TWidgetSize;
  algorithm: string;
  ref?(ref: any): void;
}

export default class WidgetSpecification extends PureComponent<IWidgetSpecificationProps> {

  render() {
    const { size, algorithm } = this.props;

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
              <EthereumLogo className={style.tokenLogo} /> Ether
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
}
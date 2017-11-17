import React, { PureComponent } from 'react';

import A from '@linkexchange/components/src/A';
import Paper from '@linkexchange/components/src/Paper';
import TokenName from '@linkexchange/components/src/TokenName';
import TokenLogo from '@linkexchange/components/src/TokenLogo';
import TextWithLabel from '@linkexchange/components/src/TextWithLabel';

import { EWidgetSize } from '@userfeeds/types/widget';

import * as style from './widgetSpecification.scss';

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
              <TokenLogo className={style.tokenLogo} asset={asset} />
              <TokenName asset={asset} />
            </TextWithLabel>
          </Paper>
          <Paper style={{ flex: 1, marginLeft: '15px' }}>
            <TextWithLabel label="Algorithm">
              <A
                href="https://userfeeds-platform.readthedocs-hosted.com/en/latest/ref/algorithms.html#links"
                target="_blank"
              >
                Links
              </A>
              {/*TODO: remove hardcoded link description when new algorithms show up*/}
            </TextWithLabel>
          </Paper>
        </div>
      </div>
    );
  }
}

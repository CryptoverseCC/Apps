import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import QRious from 'qrious';

import Icon from '@linkexchange/components/src/Icon';
import Paper from '@linkexchange/components/src/Paper';
import A from '@linkexchange/components/src/A';
import TextWithLabel from '@linkexchange/components/src/TextWithLabel';

import * as style from './userfeedsAddressInfo.scss';

interface IUserfeedsAddressInfoProps {
  recipientAddress: string;
  linksNumber: number;
  ref?(ref: any): void;
}

const renderQR = (recipientAddress, ref) => {
  const qr = new QRious({
    element: ref,
    value: recipientAddress,
  });
};

export default class UserfeedsAddressInfo extends PureComponent<IUserfeedsAddressInfoProps> {
  render() {
    const { recipientAddress, linksNumber } = this.props;
    const etherscanUrl = `https://etherscan.io/address/${recipientAddress}`;

    return (
      <div className={style.self}>
        <h2>
          <FormattedMessage id="userfeedsAddressInfo.title" />
        </h2>
        <div className={style.row}>
          <Paper style={{ flex: 1, marginRight: '15px' }}>
            <TextWithLabel label="Total number of links" text={linksNumber || '0'} />
          </Paper>
          <Paper style={{ flex: 1, marginLeft: '15px' }}>
            <TextWithLabel label="Etherscan">
              <A href={etherscanUrl} target="_blank">
                <Icon name="external-link" /> See it on Etherscan
              </A>
            </TextWithLabel>
          </Paper>
        </div>
        <Paper>
          <TextWithLabel label="Userfeed address">
            <div className={style.row}>
              {recipientAddress}
              <div className={style.qr}>
                <canvas className={style.canvas} ref={renderQR.bind(null, recipientAddress)} />
              </div>
            </div>
          </TextWithLabel>
        </Paper>
      </div>
    );
  }
}

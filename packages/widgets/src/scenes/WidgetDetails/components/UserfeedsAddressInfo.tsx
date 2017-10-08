import React from 'react';
import * as QRious from 'qrious';

import Icon from '@userfeeds/apps-components/src/Icon';
import Paper from '@userfeeds/apps-components/src/Paper';
import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

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

const UserfeedsAddressInfo = ({ recipientAddress, linksNumber }: IUserfeedsAddressInfoProps) => {
  const etherscanUrl = `https://etherscan.io/address/${recipientAddress}`;

  return (
    <div className={style.self}>
      <h2>Userfeed Address</h2>
      <div className={style.row}>
        <Paper style={{ flex: 1, marginRight: '15px' }}>
          <TextWithLabel label="Total number of links" text={linksNumber} />
        </Paper>
        <Paper style={{ flex: 1, marginLeft: '15px' }}>
          <TextWithLabel label="Etherscan">
            <a href={etherscanUrl} target="_blank"><Icon name="external-link" /> See it on Etherscan</a>
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
};

export default UserfeedsAddressInfo;

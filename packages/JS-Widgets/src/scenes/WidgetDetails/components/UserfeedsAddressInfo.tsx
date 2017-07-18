import { h } from 'preact';

import Paper from '../../../components/Paper';
import TextWithLabel from '../../../components/TextWithLabel';

import * as style from './userfeedsAddressInfo.scss';

interface IUserfeedsAddressInfoProps {
  context: string;
  linksNumber: number;
}

const UserfeedsAddressInfo = ({ context, linksNumber }: IUserfeedsAddressInfoProps) => {
  const [network, address] = context.split(':');
  const etherscanUrl = `https://${network}.etherscan.io/address/${address}`;

  return (
    <div class={style.self}>
      <div class="row" style={{ justifyContent: 'space-between' }}>
        <Paper style={{ flex: 1, marginRight: '10px' }}>
          <TextWithLabel label="TOTAL NUMBER OF LINKS" text={linksNumber} />
        </Paper>
        <Paper style={{ flex: 1, marginLeft: '10px' }}>
          <TextWithLabel label="ETHERSCAN">
            <a href={etherscanUrl} target="_blank"> See it on Etherscan</a>
          </TextWithLabel>
        </Paper>
      </div>
    </div>
  );
};

export default UserfeedsAddressInfo;

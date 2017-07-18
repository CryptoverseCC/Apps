import { h } from 'preact';

import Paper from '../../../components/Paper';
import TextWithLabel from '../../../components/TextWithLabel';

interface IUserfeedsAddressInfoProps {
  context: string;
  linksNumber: number;
}

const UserfeedsAddressInfo = ({ context, linksNumber }: IUserfeedsAddressInfoProps) => {
  const [network, address] = context.split(':');
  const etherscanUrl = `https://${network}.etherscan.io/address/${address}`;

  return (
    <div style={{ flex: 1, padding: '10px' }}>
      <h2>Userfeeds Address</h2>
      <div class="row" style={{ justifyContent: 'space-between' }}>
        <Paper style={{ width: '45%' }}>
          <TextWithLabel label="TOTAL NUMBER OF LINKS" text={linksNumber} />
        </Paper>
        <Paper style={{ width: '45%' }}>
          <TextWithLabel label="ETHERSCAN">
            <a href={etherscanUrl} target="_blank"> See it on Etherscan</a>
          </TextWithLabel>
        </Paper>
      </div>
    </div>
  );
};

export default UserfeedsAddressInfo;

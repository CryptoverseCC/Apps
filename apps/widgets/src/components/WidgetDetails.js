import React from 'react';

import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import style from './WidgetDetails.scss';

const WidgetDetails = ({ context, algorithm, whitelist, links }) => {
  const [network, userfeedId] = context.split(':');
  const totalEarnings = web3.fromWei(links.reduce((acc, { score }) => acc + score, 0));

  return (
    <div className={style.this}>
      <TextWithLabel label="Network" text={network} />
      <TextWithLabel label="UserfeedID" text={userfeedId} />
      <TextWithLabel label="Algorithm" text={algorithm} />
      <TextWithLabel label="Whitelist" text={whitelist} />
      <TextWithLabel label="Total Earnings" text={totalEarnings} />
    </div>
  );
};

export default WidgetDetails;

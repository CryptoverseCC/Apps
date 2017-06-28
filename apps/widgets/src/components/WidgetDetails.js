import React from 'react';
import classnames from 'classnames';

import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import style from './WidgetDetails.scss';

const WidgetDetails = ({ className, algorithm, whitelist, links }) => {
  const totalEarnings = web3.fromWei(links.reduce((acc, { score }) => acc + score, 0));

  return (
    <div className={classnames(className, style.this)}>
      <TextWithLabel label="Total Earnings" text={totalEarnings} />
      <TextWithLabel label="Max link slots" text={'10'} />
      <TextWithLabel label="Feed type" text={'text'} />
      <TextWithLabel label="Algorithm" text={algorithm} />
      <TextWithLabel label="Whitelist" text={whitelist} />
    </div>
  );
};

export default WidgetDetails;

import React from 'react';

import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import LinkPreview from './Link';

import style from './LinkDetails.scss';

const LinkDetails = ({ link, position }) => (
  <div className={style.this}>
    <LinkPreview link={link} />
    <div className={style.footer}>
      <TextWithLabel label="Current Ranking Position" text={position} />
      <TextWithLabel label="Created" text={'25-05-2017'} />
      <TextWithLabel label="Last bid" text={'26-05-2017'} />
    </div>
  </div>
);

export default LinkDetails;

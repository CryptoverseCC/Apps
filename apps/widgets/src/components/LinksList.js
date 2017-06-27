import React from 'react';

import TextWithLabel from '@userfeeds/apps-components/src/TextWithLabel';

import LinkPreview from '../components/Link';

import style from './LinksList.scss';

const ListItem = ({ link, position }) => {
  return (
    <div className={style.link}>
      <LinkPreview link={link} />
      <div className={style.footer}>
        <TextWithLabel label="Current Ranking Position" text={position} />
        <TextWithLabel label="Created" text={'25-05-2017'} />
        <TextWithLabel label="Last bid" text={'26-05-2017'} />
      </div>
    </div>
  );
};

const LinksList = ({ links }) => {
  return (
    <div className={style.this}>
      { links.map((link, index) => (
        <ListItem
          key={index + link.target}
          link={link}
          position={index + 1}
        />
      ))}
    </div>
  );
};

export default LinksList;

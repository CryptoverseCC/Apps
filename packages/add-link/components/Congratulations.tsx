import React from 'react';

import Button from '@linkexchange/components/src/NewButton';
import TextWithLabel from '@linkexchange/components/src/TextWithLabel';

import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import * as style from './congratulations.scss';

const heartSvg = require('../images/heart.svg');

const Congratulations = ({ linkId, widgetSettings }) => {
  const goToLinkStatus = () => openLinkexchangeUrl('/direct/status', { linkId, ...widgetSettings });

  return (
    <div className={style.self}>
      <img src={heartSvg} />
      <h2>Congratulations!</h2>
      <p>Thanks you for sending the link</p>
      <TextWithLabel label="Contact method" text={widgetSettings.contactMethod} />
      <Button color="primary" onClick={goToLinkStatus}>
        Link Status
      </Button>
    </div>
  );
};

export default Congratulations;

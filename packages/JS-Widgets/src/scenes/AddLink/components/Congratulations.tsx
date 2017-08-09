import { h } from 'preact';

import Button from '../../../components/Button';
import TextWithLabel from '../../../components/TextWithLabel';

import { openUserfeedsUrl } from '../../../utils/openUserfeedsUrl';

import * as style from './congratulations.scss';

const Congratulations = ({ linkId, widgetSettings }) => {
  const goToLinkStatus = () => openUserfeedsUrl('apps/links/#/status/', { linkId, ...widgetSettings });

  return (
    <div class={style.self}>
      <h2>Congratulations!</h2>
      <p>Thanks you for sending the link</p>
      <TextWithLabel label="Publisher note" text={widgetSettings.publisherNote} />
      <Button onClick={goToLinkStatus}>Link Status</Button>
    </div>
  );
};

export default Congratulations;

import { h } from 'preact';
import { Link } from 'react-router-dom';

import Button from '@userfeeds/apps-components/src/Button';

import * as style from './createWidget.scss';

const CreateWidget = ({ widgetSettings }) => {
  const searchParams = Object.entries(widgetSettings)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  return (
    <Link
      class={style.self}
      to={{
        pathname: '/configurator/summary',
        search: `?${searchParams}`,
      }}
    >
      <Button class={style.button}>
        Create my widget!
      </Button>
    </Link>
  );
};

export default CreateWidget;

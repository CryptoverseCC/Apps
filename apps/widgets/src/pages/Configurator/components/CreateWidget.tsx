import React from 'react';

import Button from '@userfeeds/apps-components/src/Button';

import * as style from './createWidget.scss';

const CreateWidget = ({ onClick }) => {
  return (
    <div className={style.self}>
      <Button className={style.button} onClick={onClick}>
        Create my widget!
      </Button>
    </div>
  );
};

export default CreateWidget;

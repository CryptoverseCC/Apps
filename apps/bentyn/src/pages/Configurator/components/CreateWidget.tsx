import React from 'react';

import Button from '@linkexchange/components/src/NewButton';

import * as style from './createWidget.scss';

const CreateWidget = ({ onClick }) => {
  return (
    <div className={style.self}>
      <Button color="primary" className={style.button} onClick={onClick}>
        Create my widget!
      </Button>
    </div>
  );
};

export default CreateWidget;

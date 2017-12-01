import React from 'react';

import Button from '@linkexchange/components/src/NewButton';

import * as style from './addLinkButton.scss';

const AddLinkButton = (props) => (
  <Button className={style.self} color="empty" {...props}>
    Add link
  </Button>
);

export default AddLinkButton;

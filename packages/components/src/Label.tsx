import React from 'react';

import * as style from './label.scss';

interface ILabelProps {
  children?: string | JSX.Element;
}

const Label = (props: ILabelProps) => <p className={style.self}>{props.children}</p>;

export default Label;

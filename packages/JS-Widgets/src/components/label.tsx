import { h, FunctionalComponent } from 'preact';

import * as style from  './label.scss';

const Label: FunctionalComponent<{}> = (props) => {
  if (props && props.children) {
    return <p class={style.self}>{props.children}</p>;
  }
  
  return <p class={style.self} />
};

export default Label;

import React, { Component } from 'react';
import * as style from './configure.scss';

const InputWrapper = (props) => (
  <div {...props} className={style.InputWrapper}/>
)

const InputTitle = ({children}) => (
  <div className={style.InputHeader}>
    {children}
  </div>
);

const InputDescription = ({children}) => (
  <p className={style.InputDescription}>
    {children}
  </p>
);

export default class Configurator extends Component<{}, {}> {
  render() {
    return (
      <InputWrapper>
        <InputTitle>
          Widget Title
        </InputTitle>
        <InputDescription>
          I think it would be nice to put here a short description
        </InputDescription>
        <input className={style.Input} type="text" value="Widget title" />
      </InputWrapper>
    );
  }
}

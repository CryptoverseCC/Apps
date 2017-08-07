import { h, FunctionalComponent } from 'preact';
import * as classnames from 'classnames/bind';

import * as style from './input.scss';

const cx = classnames.bind(style);

interface IInputProps {
  placeholder: string;
  errorMessage?: string;
}

const Input: FunctionalComponent<IInputProps & JSX.HTMLAttributes> = ({ placeholder, errorMessage, ...restProps }) => {
  return (
    <div class={cx('self', { invalid: !!errorMessage })}>
      <input class={style.input} required {...restProps} />
      <span class={style.placeholder}>{placeholder}</span>
      {errorMessage && <span class={style.error}>{errorMessage}</span>}
    </div>
  );
};

export default Input;

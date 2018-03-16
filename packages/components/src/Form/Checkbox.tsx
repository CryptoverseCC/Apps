import React from 'react';
import styled from 'styled-components';
import styledComponentWithProps from '@linkexchange/utils/styledComponentsWithProps';

type TCheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  checked?: boolean;
  onChange?: (e: any) => void;
};

const Input = styled.input`
  display: none;
`;

const Label = styledComponentWithProps<{ checked?: boolean }, HTMLLabelElement>(styled.label)`
  font-size: 18px;
  display: flex;
  align-items: center;
  ${(props) => props.checked ? `color: #263fff;` : ''};
  cursor: pointer;
`;

const Checkmark = styledComponentWithProps<{ checked?: boolean }, HTMLDivElement>(styled.div)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 21px;
  width: 21px;
  margin-right: 15px;
  border: 1px solid #a6aeb8;
  border-radius: 3px;
  background-color: #ffffff;

  &:after {
    content: '';
    display: none;
    width: 5px;
    height: 10px;
    border: solid #263fff;
    border-width: 0 1px 1px 0;
    transform: rotate(45deg);
    position: relative;
    top: -2px;
  }

  ${Label}:hover & {
    border-color: #263fff;
    box-shadow: 0 4px 8px 0 rgba(38, 63, 255, 0.25);
  }

  ${(props) => props.checked ?
    `
      border-color: #263fff;
      &:after {
        display: block;
      }
    ` : ''};
`;

const Checkbox = (props: TCheckboxProps) => (
  <Label checked={props.checked}>
    <Input type="checkbox" {...props} onClick={props.onClick} />
    <Checkmark checked={props.checked} />
    {props.label}
  </Label>
);

export default Checkbox;

import React, { Component } from 'react';
import * as classnames from 'classnames';

import Icon from './Icon';

import * as style from './accordion.scss';

interface IAccordionProps {
  open?: boolean;
  onChange?: () => void;
  class?: string;
  title: string | JSX.Element;
}

interface IAccordionState {
  isControlled: boolean;
  open: boolean;
}

export default class Accordion extends Component<IAccordionProps, IAccordionState> {

  constructor(props) {
    super(props);

    const isControlled = typeof props.open === 'boolean';
    this.state = {
      isControlled,
      open: isControlled ? props.open : false,
    };
  }

  componentWillReceiveProps(newProps: IAccordionProps) {
    if (this.state.isControlled && newProps.open !== this.props.open) {
      this.setState({ open: !!newProps.open });
    }
  }

  render() {
    return (
      <div className={classnames(style.self, this.props.class)}>
        <div className={style.header} onClick={this._toggle}>
          {this.props.title}
          <Icon className={style.arrow} name={this.state.open ? 'chevron-top' : 'chevron-bottom'}/>
        </div>
        {this.state.open && <div>{this.props.children}</div>}
      </div>
    );
  }

  _toggle = () => {
    this.setState(
      ({ open }) => ({ open: !open }),
      () => {
        if (this.state.isControlled && this.props.onChange) {
          this.props.onChange();
        }
      });
  }
}

import React, { Component } from 'react';
import classnames from 'classnames';

import { ITokenDetails } from '@linkexchange/token-details-provider';
import MetaFox from '@linkexchange/images/metafox_straight.png';

import Header from './Header';
import Footom from './Footton';

import * as style from './confirmation.scss';

interface IProps {
  amount: string;
  positionInSlots: number | null;
  tokenDetails: ITokenDetails;
}

export default class Confirmation extends Component<IProps> {
  render() {
    const { amount, positionInSlots, tokenDetails, children } = this.props;
    return (
      <>
        <Header positionInSlots={positionInSlots} tokenDetails={tokenDetails} />
        <div className={style.body}>{children}</div>
        <div className={style.footer}>
          <img src={MetaFox} className={style.fox} />
          <div className={style.loader} />
        </div>
      </>
    );
  }
}

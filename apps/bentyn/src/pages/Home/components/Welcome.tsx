import React from 'react';

import { withInfura } from '@linkexchange/utils/web3';
import Button from '@linkexchange/components/src/NewButton';

import BlocksTillConclusionComponent from '../../../components/BlocksTillConclusion';

import avatar from '../../../../images/szczepan.jpg';

import * as style from './welcome.scss';

const BlocksTillConclusion = withInfura(BlocksTillConclusionComponent);

interface IProps {
  asset: string;
  startBlock: number;
  endBlock: number;
  purchaseBens(): void;
  gotBens(): void;
}

const Welcome = (props: IProps) => (
  <div className={style.self}>
    <div className={style.avatar}>
      <img src={avatar} />
    </div>
    <div className={style.head}>
      <div className={style.welcome}>Welcome to my stream</div>
      <div className={style.subWelcome}>You can upvote links that are going to be displayed in my next stream.</div>
    </div>
    <div className={style.body}>
      <BlocksTillConclusion
        startBlock={props.startBlock}
        endBlock={props.endBlock}
        asset={props.asset}
      />
      <div className={style.buttons}>
        <Button color="secondary" onClick={props.purchaseBens}>Purchase BENs here</Button>
        <Button color="primary" onClick={props.gotBens}>I have BENs</Button>
      </div>
    </div>
 </div>
);

export default Welcome;

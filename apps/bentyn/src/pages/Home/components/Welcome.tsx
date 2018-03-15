import React from 'react';

import Button from '@linkexchange/components/src/NewButton';
import BlocksTillConclusion from '@linkexchange/blocks-till-conclusion';

import avatar from '../../../../images/szczepan.jpg';

import * as style from './welcome.scss';

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
        className={style.blocksTillConclusion}
        startBlock={props.startBlock}
        endBlock={props.endBlock}
      />
      <div className={style.buttons}>
        <Button color="secondary" onClick={props.purchaseBens}>
          Purchase BENs here
        </Button>
        <Button color="primary" onClick={props.gotBens}>
          I have BENs
        </Button>
      </div>
    </div>
  </div>
);

export default Welcome;

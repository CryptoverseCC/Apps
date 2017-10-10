import React from 'react';
import * as styles from './pictograph.scss';
import Pill from './Pill';

export const PictographLeaderboard = () => (
  <div className={styles.Wrapper}>
    <div className={styles.Header}>
      <span>Leaderboard</span>
      <Pill className={styles.Size}>728 x 90</Pill>
    </div>
    <div className={`${styles.Figure} ${styles.LeaderboardFigure}`} />
  </div>
);

export const PictographRectangle = () => (
  <div className={styles.Wrapper}>
    <div className={styles.Header}>
      <span>Rectangle</span>
      <Pill className={styles.Size}>300 x 250</Pill>
    </div>
    <div className={`${styles.Figure} ${styles.RectangleFigure}`} />
  </div>
);

import React from 'react';
import * as styles from './size.scss';

export const SizeLeaderboard = () => (
  <div className={styles.Wrapper}>
    <div className={styles.Header}>
      <span>Leaderboard</span>
      <span className={styles.Pill}>729 x 90</span>
    </div>
    <div className={`${styles.Figure} ${styles.LeaderboardFigure}`} />
  </div>
);

export const SizeRectangle = () => (
  <div className={styles.Wrapper}>
    <div className={styles.Header}>
      <span>Rectangle</span>
      <span className={styles.Pill}>300 x 250</span>
    </div>
    <div className={`${styles.Figure} ${styles.RectangleFigure}`} />
  </div>
);

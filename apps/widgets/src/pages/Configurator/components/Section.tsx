import React from 'react';

import * as style from './section.scss';

interface ISectionProps {
  header: string;
  description?: string;
}

const Section = ({ header, description, children }) => (
  <div className={style.self}>
    <div className={style.header}>{header}</div>
    {description && <div className={style.description}>{description}</div>}
    {children}
  </div>
);

export default Section;

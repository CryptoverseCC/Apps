import React from 'react';

import * as style from './section.scss';

interface ISectionProps {
  header: string;
  description?: string;
  children: JSX.Element | JSX.Element[];
}

const Section = ({ header, description, children }: ISectionProps) => (
  <div className={style.self}>
    <div className={style.header}>{header}</div>
    {description && <div className={style.description}>{description}</div>}
    {children}
  </div>
);

export default Section;

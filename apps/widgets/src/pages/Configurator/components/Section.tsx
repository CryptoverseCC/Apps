import React from 'react';

import * as style from './section.scss';

interface ISectionProps {
  header: string;
  description?: string;
}

const Section = ({ header, description, children }) => (
  <div class={style.self}>
    <div class={style.header}>{header}</div>
    {description && <div class={style.description}>{description}</div>}
    {children}
  </div>
);

export default Section;

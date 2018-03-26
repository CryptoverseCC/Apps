import React from 'react';

export const ArrowLeft = ({ className, ...restProps }: { className?: string } & React.SVGAttributes<SVGElement>) => (
  <svg className={className} viewBox="0 0 16 16" width="16" height="16" {...restProps}>
    <g>
      <polygon points="11.1,15.7 3.4,8 11.1,0.3 12.6,1.7 6.3,8 12.6,14.3 " />
    </g>
  </svg>
);

export const ArrowRight = ({ className, ...restProps }: { className?: string } & React.SVGAttributes<SVGElement>) => (
  <svg className={className} viewBox="0 0 16 16" width="16" height="16" {...restProps}>
    <g>
      <polygon points="4.9,15.7 3.4,14.3 9.7,8 3.4,1.7 4.9,0.3 12.6,8 " />
    </g>
  </svg>
);

import React from 'react';

const getSvgContentRegxp = /<svg[^>]*>(.*)<\/svg>/;

interface ISvgProps {
  className?: string;
  svg: string;
  size: number | string;
  viewBox: string;
}

const Svg = ({ svg, size, viewBox, className }: ISvgProps) => {
  let svgContent;
  const regexpResult = getSvgContentRegxp.exec(svg);
  if (regexpResult) {
    svgContent = regexpResult[1];
  }

  return (
    <svg
      className={className}
      style={{ width: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    />
  );
};

export default Svg;

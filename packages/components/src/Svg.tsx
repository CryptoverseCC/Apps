import { h, FunctionalComponent } from 'preact';

const getSvgContentRegxp = /<svg[^>]*>(.*)<\/svg>/;

interface ISvgProps {
  class?: string;
  svg: string;
  size: number | string;
  viewBox: string;
}

const Svg = ({ svg, size, viewBox, class: className }: ISvgProps) => {
  let svgContent;
  const regexpResult = getSvgContentRegxp.exec(svg);
  if (regexpResult) {
    svgContent = regexpResult[1];
  }

  return (
    <svg
      class={className}
      style={{ width: size }}
      alt={name}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    />
  );
};

export default Svg;

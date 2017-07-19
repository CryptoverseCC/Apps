import { h } from 'preact';

const getSvgContentRegxp = /<svg[^>]*>(.*)<\/svg>/;

const Svg = ({ path, size, class: className }: IIconProps) => {
  const svg = require(path);

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
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
    />
  );
};

export default Svg;

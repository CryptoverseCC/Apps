import React from 'react';
import hljs from 'highlight.js';

interface IHighlightProps {
  language: string;
  code: string;
}

const Highlight = ({ language, code }: IHighlightProps) => {
  const innerHtml = hljs.highlight(language, code).value;

  return (
    <pre>
      <code className={`hljs ${language}`} dangerouslySetInnerHTML={{ __html: innerHtml }} />
    </pre>
  );
};

export default Highlight;

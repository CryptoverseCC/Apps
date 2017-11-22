import React from 'react';

export default function isType(
  child: React.ReactChild,
  displayName: string,
): child is React.ReactElement<any> {
  return child !== null && isReactComponent(child) && child.props.displayName === displayName;
}
export function isReactComponent(child: React.ReactChild): child is React.ReactElement<any> {
  return typeof child !== 'string' && typeof child !== 'number';
}

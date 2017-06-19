import { h } from 'preact';

const DateComponent = ({ date: inputDate }) => {
  const date = new Date(inputDate);

  return <span>{date.toISOString().substring(0, 10)}</span>;
};

export default DateComponent;

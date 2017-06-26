import { h } from 'preact';

const DateComponent = ({ date: inputDate }) => {
  const date = new Date(inputDate);

  return <span>{!isNaN(date.valueOf()) ? date.toISOString().substring(0, 10) : ''}</span>;
};

export default DateComponent;

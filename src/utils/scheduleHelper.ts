import moment, {Moment} from 'moment/moment';

export const weekOfMonth = (nowDate: Moment) => {
  const weekOfMonthNumber = (date: Moment) =>
    date.week() - moment(date).startOf('month').week() + 1;

  return `${nowDate.format('YYYY.MM')} ${weekOfMonthNumber(nowDate)}주`;
};

export const convertTimeFormat = (timeString: string) => {
  const date = moment(timeString);
  const hours = date.hours();
  const minutes = date.minutes();

  let convertedTime = hours + minutes / 60;
  return Number(convertedTime.toFixed(1));
};

import dayjs from 'dayjs';
import { getRandomInteger } from '../utils/common.js';


const TimesRanges = {
  DAYS: {
    MIN: -3,
    MAX: 3
  },
  HOURS: {
    MIN: 1,
    MAX: 10
  },
  MINUTES: {
    MIN: 1,
    MAX: 59
  }
};

const getRandomDate = () =>
  dayjs().add(getRandomInteger(TimesRanges.DAYS.MIN, TimesRanges.DAYS.MAX), 'day')
    .add(getRandomInteger(TimesRanges.HOURS.MIN, TimesRanges.HOURS.MAX), 'hour')
    .add(getRandomInteger(TimesRanges.MINUTES.MIN, TimesRanges.MINUTES.MAX), 'minute');


const createRandomDates = () => {
  const date1 = getRandomDate();
  const date2 = getRandomDate();

  if (date2.isAfter(date1)) {
    return {
      dateFrom: date1.toISOString(),
      dateTo: date2.toISOString()
    };
  }
  return {
    dateFrom: date2.toISOString(),
    dateTo: date1.toISOString()
  };
};

export { createRandomDates };

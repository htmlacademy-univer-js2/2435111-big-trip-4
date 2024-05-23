import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/IsSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/IsSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const isEscapeKey = (evt) => evt.key === 'Escape';

const isPastEvent = (dateTo) => dayjs(dateTo).isSameOrBefore(dayjs());

const isPresentEvent = (dateFrom, dateTo) => dayjs(dateFrom).isSameOrBefore(dayjs()) && dayjs(dateTo).isSameOrAfter(dayjs());

const isFutureEvent = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());

const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortByTime = (pointA, pointB) => dayjs(pointB.dateTo).diff(pointB.dateFrom) - dayjs(pointA.dateTo).diff(pointA.dateFrom);

const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export { isEscapeKey, isPastEvent, isPresentEvent, isFutureEvent, sortByDay, sortByTime, sortByPrice };

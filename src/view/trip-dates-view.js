import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

const DATE_FORMAT = 'MMM DD';

function createTripDatesTemplate(datesFrom) {
  const startDate = dayjs(datesFrom[0]);
  const endDate = dayjs(datesFrom[datesFrom.length - 1]);

  let endDateFormat = DATE_FORMAT;

  if (endDate.isSame(startDate, 'month')) {
    endDateFormat = 'DD';
  }

  return `<p class="trip-info__dates">
            ${startDate.format(DATE_FORMAT)}&nbsp;&mdash;&nbsp;${endDate.format(endDateFormat)}
          </p>`;
}

export default class TripDatesView extends AbstractView {
  #datesFrom = null;

  constructor(datesFrom) {
    super();

    this.#datesFrom = datesFrom;
  }

  get template() {
    return createTripDatesTemplate(this.#datesFrom);
  }

}

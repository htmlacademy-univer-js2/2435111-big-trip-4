import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES } from '../mock/const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { ucFirst } from '../utils/common.js';

const DefaultPointData = {
  DATE_FROM: dayjs().toISOString(),
  DATE_TO: dayjs().add(30, 'minutes').toISOString(),
  TYPE: POINT_TYPES[0]
};

const BLANK_POINT = {
  basePrice: '',
  dateFrom: DefaultPointData.DATE_FROM,
  dateTo: DefaultPointData.DATE_TO,
  destination: '',
  id: '',
  isFavorite: false,
  offers: [],
  type: DefaultPointData.TYPE
};

function createEditPointTemplate(point, offersByType, destinations) {
  const { type, dateFrom, dateTo, basePrice, destination, offers } = point;

  const isNewPoint = !point.id;
  const isValidForm = destination && basePrice;

  const pointTypeOffer = offersByType.find((offer) => offer.type === type);
  const pointDestination = destinations.find((appointment) => destination === appointment.id);

  let offersTemplate = '';
  if (pointTypeOffer) {
    offersTemplate = `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${pointTypeOffer.offers.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${offer.id}" type="checkbox" name="${offer.title}" data-offer-id="${offer.id}" ${offers.includes(offer.id) ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`).join('')}
          </div>
      </section>`;
  }

  let pointDestinationTemplate = '';
  if (pointDestination) {
    pointDestinationTemplate = `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointDestination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pointDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}"></img>`).join('')}
        </div>
      </div>
    </section>`;
  }

  const destinationOptionsTemplate = destinations.map((element) => `<option value="${element.name}"></option>`).join('');

  const typeOptionsTemplate = POINT_TYPES.map((pointType) => `
    <div class="event__type-item">
      <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${ucFirst(pointType)}</label>
    </div>`).join('');

  const parsDateTo = dayjs(dateTo);
  const parsDateFrom = dayjs(dateFrom);

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${typeOptionsTemplate}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination ? pointDestination.name : ''}" list="destination-list-1" required>
                    <datalist id="destination-list-1">
                      ${destinationOptionsTemplate}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${parsDateFrom.format('DD/MM/YY HH:mm')}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${parsDateTo.format('DD/MM/YY HH:mm')}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value=${point.basePrice ? basePrice : 0} required>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isValidForm ? '' : 'disabled'}>Save</button>
                  <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
                  ${isNewPoint ? '' : `<button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`}
                </header>
                <section class="event__details">
                  ${offersTemplate}
                  ${pointDestinationTemplate}
                </section>
              </form>
            </li>`;
}

export default class EditPointView extends AbstractStatefulView {
  #offersBytype = null;
  #destinations = null;

  #handleFormSubmit = null;
  #handleRollupButtonClick = null;
  #handleResetButtonClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point = BLANK_POINT, offersByType, destinations, onFormSubmit, onRollupButtonClick, onResetButtonClick }) {
    super();

    this._setState(EditPointView.parsePointToState(point));
    this.#offersBytype = offersByType;
    this.#destinations = destinations;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButtonClick = onRollupButtonClick;
    this.#handleResetButtonClick = onResetButtonClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offersBytype, this.#destinations);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  static parsePointToState = (point) => ({ ...point });

  static parseStateToPoint = (state) => ({ ...state });

  reset(point) {
    this.updateElement(EditPointView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeToggleHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#eventDestinationToggleHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputHandler);
    this.element.querySelectorAll('.event__offer-selector input')
      .forEach((offer) => offer.addEventListener('change', this.#offersChangeHandler));
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    if (this._state.id) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupButtonClickHandler);
    }

    this.#setDatePickerFrom();
    this.#setDatePickerTo();
  }

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #eventDestinationToggleHandler = (evt) => {
    evt.preventDefault();

    let selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);
    if (!selectedDestination) {
      selectedDestination = '';
    }

    this.updateElement({
      destination: selectedDestination.id
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: evt.target.value
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    evt.target.toggleAttribute('checked');

    let selectedOffers = this._state.offers;

    if (evt.target.hasAttribute('checked')) {
      selectedOffers.push(+(evt.target.dataset.offerId));
    } else {
      selectedOffers = selectedOffers.filter((id) => id !== +(evt.target.dataset.offerId));
    }

    this._setState({
      offers: selectedOffers
    });
  };

  #dateFromChangeHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom: dateFrom
    });
  };

  #dateToChangeHandler = ([dateTo]) => {
    this.updateElement({
      dateTo: dateTo
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetButtonClick(EditPointView.parseStateToPoint(this._state));
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButtonClick();
  };

  #setDatePickerFrom() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('input[name=event-start-time]'),
      {
        dateFormat: 'j/m/y H:i',
        defaultDate: this._state.dateFrom,
        minDate: 'today',
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true
      }
    );
  }

  #setDatePickerTo() {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('input[name=event-end-time]'),
      {
        dateFormat: 'j/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true
      }
    );
  }
}

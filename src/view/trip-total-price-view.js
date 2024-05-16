import AbstractView from '../framework/view/abstract-view.js';

function createTripTotalPriceTemplate() {
  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
          </p>`;
}

export default class TripTotalPriceView extends AbstractView {

  get template() {
    return createTripTotalPriceTemplate();
  }

}


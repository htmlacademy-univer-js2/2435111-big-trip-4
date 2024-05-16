import AbstractView from '../framework/view/abstract-view.js';

function createTripTotalPriceTemplate(totalPrice) {
  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
          </p>`;
}

export default class TripTotalPriceView extends AbstractView {
  #totalPrice = null;

  constructor(totalPrice) {
    super();

    this.#totalPrice = totalPrice;
  }

  get template() {
    return createTripTotalPriceTemplate(this.#totalPrice);
  }

}


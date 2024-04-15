import { createElement } from '../render.js';

function createTripTotalPriceTemplate() {
  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
          </p>`;
}

export default class TripTotalPriceView {
  getTemplate() {
    return createTripTotalPriceTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
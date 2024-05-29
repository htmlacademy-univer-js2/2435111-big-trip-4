import { offersByType } from '../mock/point.js';

export default class OffersByTypeModel {
  #offersByType = offersByType;

  get offersByType() {
    return this.#offersByType;
  }
}

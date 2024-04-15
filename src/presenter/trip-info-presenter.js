import TripInfoView from '../view/trip-info-view.js';
import TripRouteView from '../view/trip-route-view.js';
import TripTotalPriceView from '../view/trip-total-price-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripInfoPresenter {
  tripInfoComponent = new TripInfoView();

  constructor({ tripInfoContainer }) {
    this.tripInfoContainer = tripInfoContainer;
  }

  init() {
    render(this.tripInfoComponent, this.tripInfoContainer, RenderPosition.AFTERBEGIN);
    render(new TripRouteView(), this.tripInfoComponent.getElement());
    render(new TripTotalPriceView(), this.tripInfoComponent.getElement());
  }
}
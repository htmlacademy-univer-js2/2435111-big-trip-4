import TripInfoView from '../view/trip-info-view.js';
import TripInfoMainView from '../view/trip-info-main-view.js';
import TripDatesView from '../view/trip-dates-view.js';
import TripRouteView from '../view/trip-route-view.js';
import TripTotalPriceView from '../view/trip-total-price-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { destinations } from '../mock/point.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;

  #tripInfoComponent = new TripInfoView();
  #tripInfoMainComponent = new TripInfoMainView();

  #listPoints = [];

  constructor({ tripInfoContainer, pointsModel }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];

    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    render(this.#tripInfoMainComponent, this.#tripInfoComponent.element);
    this.#renderTotalPrice(this.#listPoints);
    this.#renderTripRoute(this.#listPoints);
    this.#renderTripDates(this.#listPoints);
  }

  #renderTripRoute(points) {
    const routeCities = [];
    points.forEach((point) => {
      const pointDestination = destinations.find((appointment) => point.destination === appointment.id);
      routeCities.push(pointDestination.name);
    });

    const waypoints = Array.from(new Set(routeCities));
    render(new TripRouteView(waypoints), this.#tripInfoMainComponent.element);
  }

  #renderTripDates(points) {
    const datesFrom = [];
    points.forEach((point) => {
      datesFrom.push(point.dateFrom);
    });

    datesFrom.sort(); // временное решение

    render(new TripDatesView(datesFrom), this.#tripInfoMainComponent.element);
  }

  #renderTotalPrice(points) {
    let totalPrice = 0;
    points.forEach((point) => {
      totalPrice += point.basePrice;
    });

    render(new TripTotalPriceView(totalPrice), this.#tripInfoComponent.element);
  }
}

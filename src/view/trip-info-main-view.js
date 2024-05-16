import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoMainTemplate() {
  return '<div class="trip-info__main"></div>';
}

export default class TripInfoMainView extends AbstractView {

  get template() {
    return createTripInfoMainTemplate();
  }

}

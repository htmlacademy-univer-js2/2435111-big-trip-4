import PointsModel from './model/points-model.js';
import ListPresenter from './presenter/list-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import { render } from './framework/render.js';
import AddNewPointButtonView from './view/add-new-point-button-view.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import OffersByTypeModel from './model/offers-by-type-model.js';
import DestinationsModel from './model/destinations-model.js';

const tripMain = document.querySelector('.trip-main');
const tripFilterContainer = tripMain.querySelector('.trip-controls__filters');
const siteMain = document.querySelector('.page-main');
const tripEventsContainer = siteMain.querySelector('.trip-events');
const pointsModel = new PointsModel();
const offersByTypeModel = new OffersByTypeModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const newPointButtonComponent = new AddNewPointButtonView({
  onClick: handleNewPointButtonClick
});

const listPresenter = new ListPresenter({
  listContainer: tripEventsContainer,
  pointsModel,
  offersByTypeModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewPointButtonClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripFilterContainer,
  filterModel,
  pointsModel
});

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer: tripMain,
  pointsModel,
  offersByTypeModel,
  destinationsModel
});

function handleNewPointButtonClick() {
  listPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

function handleNewPointButtonClose() {
  newPointButtonComponent.element.disabled = false;
}

render(newPointButtonComponent, tripMain);

tripInfoPresenter.init();
filterPresenter.init();
listPresenter.init();


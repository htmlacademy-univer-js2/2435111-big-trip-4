import PointListMessageView from '../view/point-list-empty-message-view.js';
import PointListView from '../view/point-list-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import SortView from '../view/sort-view.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils/point.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ErrorView from '../view/error-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class ListPresenter {
  #listContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #listComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #sortComponent = null;
  #listMessageComponent = null;

  #pointPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ listContainer, pointsModel, filterModel, onNewPointDestroy }) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointsModel,
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[currentFilterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
    }

    return filteredPoints.sort(sortByDay);
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  #renderListMessage() {
    this.#listMessageComponent = new PointListMessageView(this.#filterModel.filter);

    render(this.#listMessageComponent, this.#listComponent.element);
  }

  #renderLoadingMessage() {
    render(this.#loadingComponent, this.#listComponent.element);
  }

  #renderErrorMessage() {
    render(this.#errorComponent, this.#listComponent.element);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#listMessageComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    render(this.#listComponent, this.#listContainer);

    if (this.#isLoading) {
      this.#renderLoadingMessage();
      return;
    }

    const points = this.points;

    if (!points.length && !this.#pointsModel.offers.length && !this.#pointsModel.destinations.length) {
      this.#renderErrorMessage();
      return;
    }

    this.#renderSort();

    if (points.length) {
      remove(this.#listMessageComponent);
      for (let i = 0; i < points.length; i++) {
        this.#renderPoint(points[i]);
      }
    } else {
      this.#renderListMessage();
    }
  }
}

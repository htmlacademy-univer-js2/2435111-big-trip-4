import PointListMessageView from '../view/point-list-empty-message-view.js';
import PointListView from '../view/point-list-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import SortView from '../view/sort-view.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils/point.js';

export default class ListPresenter {
  #listContainer = null;
  #pointsModel = null;

  #listComponent = new PointListView();
  #sortComponent = null;
  #listMessageComponent = new PointListMessageView();

  #listPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor({ listContainer, pointsModel }) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderList();
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#listPoints.sort(sortByPrice);
        break;
      case SortType.TIME:
        this.#listPoints.sort(sortByTime);
        break;
      default:
        this.#listPoints.sort(sortByDay);
    }

    this.#currentSortType = sortType;
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  #renderListMessage() {
    render(this.#listMessageComponent, this.#listComponent.element);
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderList() {
    render(this.#listComponent, this.#listContainer);

    if (this.#listPoints.length) {
      this.#sortPoints(this.#currentSortType);
      for (let i = 0; i < this.#listPoints.length; i++) {
        this.#renderPoint(this.#listPoints[i]);
      }
    } else {
      this.#renderListMessage();
    }
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderList();
  }
}

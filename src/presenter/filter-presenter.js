import { FilterType, UpdateType } from '../const.js';
import { remove, render, replace } from '../framework/render';
import { filter } from '../utils/filter.js';
import FilterView from '../view/filter-view';


export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        name: FilterType.EVERYTHING,
        count: filter[FilterType.EVERYTHING](points).length
      },
      {
        name: FilterType.PAST,
        count: filter[FilterType.PAST](points).length
      },
      {
        name: FilterType.PRESENT,
        count: filter[FilterType.PRESENT](points).length
      },
      {
        name: FilterType.FUTURE,
        count: filter[FilterType.FUTURE](points).length
      }
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

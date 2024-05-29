import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import { remove, render, replace } from '../framework/render.js';
import { isEscapeKey } from '../utils/point.js';
import { UpdateType, UserAction } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #offersByTypeModel = null;
  #destinationsModel = null;

  #pointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({ offersByTypeModel, destinationsModel, pointListContainer, onDataChange, onModeChange }) {
    this.#offersByTypeModel = offersByTypeModel;
    this.#destinationsModel = destinationsModel;

    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offersByType: this.#offersByTypeModel.offersByType,
      destinations: this.#destinationsModel.destinations,
      onRollupButtonClick: this.#handleRollupButtonClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new EditPointView({
      point: this.#point,
      offersByType: this.#offersByTypeModel.offersByType,
      destinations: this.#destinationsModel.destinations,
      onFormSubmit: this.#handleEditFormSubmit,
      onRollupButtonClick: this.#handleEditFormRollupButtonClick,
      onResetButtonClick: this.#handleEditFormDeleteButtonClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #escapeKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escapeKeydownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleRollupButtonClick = () => {
    this.#replacePointToForm();
  };

  #handleEditFormRollupButtonClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #handleEditFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point
    );
    this.#replaceFormToPoint();
  };

  #handleEditFormDeleteButtonClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };
}

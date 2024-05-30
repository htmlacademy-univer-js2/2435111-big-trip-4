import EditPointView from '../view/edit-point-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { isEscapeKey } from '../utils/point.js';
import { UpdateType, UserAction } from '../const.js';

export default class NewPointPresenter {
  #offers = null;
  #destinations = null;

  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({ offers, destinations, pointListContainer, onDataChange, onDestroy }) {
    this.#offers = offers;
    this.#destinations = destinations;

    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditPointView({
      offersByType: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onResetButtonClick: this.#handleFormCancelButtonClick
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escapeKeydownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escapeKeydownHandler);
  }

  #escapeKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
    this.destroy();
  };

  #handleFormCancelButtonClick = () => {
    this.destroy();
  };

}

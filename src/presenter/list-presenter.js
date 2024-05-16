import EditPointView from '../view/edit-point-view.js';
import PointListView from '../view/point-list-view.js';
import PointListMessageView from '../view/point-list-empty-message-view.js';
import PointView from '../view/point-view.js';
import { isEscapeKey } from '../utils/point.js';
import { render, replace } from '../framework/render.js';


export default class ListPresenter {
  #listContainer = null;
  #pointsModel = null;

  #listPoints = [];

  #listComponent = new PointListView();

  constructor({ listContainer, pointsModel }) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];

    render(this.#listComponent, this.#listContainer);

    if (this.#listPoints.length > 0) {
      for (let i = 0; i < this.#listPoints.length; i++) {
        this.#renderPoint(this.#listPoints[i]);
      }
    } else {
      render(new PointListMessageView(), this.#listComponent.element);
    }
  }

  #renderPoint(point) {
    const escapeKeydownHandler = (evt) => {
      if (isEscapeKey) {
        evt.preventDefault();
        replaceFormToPoint.call(this);
        document.removeEventListener('keydown', escapeKeydownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      onRollupButtonClick: () => {
        replacePointToForm(this);
        document.addEventListener('keydown', escapeKeydownHandler);
      }
    });

    const pointEditComponent = new EditPointView({
      point,
      onFormSubmit: () => {
        replaceFormToPoint(this);
        document.removeEventListener('keydown', escapeKeydownHandler);
      },
      onRollupButtonClick: () => {
        replaceFormToPoint(this);
        document.removeEventListener('keydown', escapeKeydownHandler);
      }
    });

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    render(pointComponent, this.#listComponent.element);
  }
}


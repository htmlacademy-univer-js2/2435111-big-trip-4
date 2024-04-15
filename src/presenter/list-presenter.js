import AddNewPointView from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import { RenderPosition, render } from '../render.js';
import { getRandomArrayElement } from '../utils.js';

export default class ListPresenter {
  listComponent = new PointListView();

  constructor({ listContainer, pointsModel }) {
    this.listContainer = listContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.listPoints = [...this.pointsModel.getPoints()];

    render(this.listComponent, this.listContainer);
    render(new AddNewPointView(), this.listComponent.getElement());
    render(new EditPointView(getRandomArrayElement(this.listPoints)), this.listComponent.getElement(), RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.listPoints.length; i++) {
      render(new PointView({ point: this.listPoints[i] }), this.listComponent.getElement());
    }
  }
}

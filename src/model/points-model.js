import { createMockPoints } from '../mock/point.js';

const POINTS_COUNT = 5;

export default class PointsModel {
  points = createMockPoints(POINTS_COUNT);

  getPoints() {
    return this.points;
  }
}
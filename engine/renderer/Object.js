import {Vertex} from './Basic.js';

export class Object {
  constructor(x, y, z, w, h, r, g, b, alpha, slot, px, py, theta) {
    this.Vertexes = [
      new Vertex(
          x, y, z, r, g, b, alpha, slot, 1.0, 1.0, w / 2, h / 2, px, py, theta),
      new Vertex(
          x, y, z, r, g, b, slot, alpha, 1.0, 0.0, w / 2, -h / 2, px, py,
          theta),
      new Vertex(
          x, y, z, r, g, b, slot, alpha, 0.0, 0.0, -w / 2, -h / 2, px, py,
          theta),
      new Vertex(
          x, y, z, r, g, b, slot, alpha, 0.0, 1.0, -w / 2, h / 2, px, py,
          theta),
    ];

    this.x = x;
    this.y = y;

    this.z = z;

    this.w = w;
    this.h = h;
    this.r = r;
    this.g = g;
    this.b = b;
    this.slot = slot;
    this.px = px;
    this.py = py;
    this.theta = theta;
    this.alpha = alpha;
  }

  update() {
    this.Vertexes = [
      new Vertex(
          this.x, this.y, this.z, this.r, this.g, this.b, this.alpha, this.slot,
          1.0, 1.0, this.w / 2, this.h / 2, this.px, this.py, this.theta),
      new Vertex(
          this.x, this.y, this.z, this.r, this.g, this.b, this.alpha, this.slot,
          1.0, 0.0, this.w / 2, -this.h / 2, this.px, this.py, this.theta),
      new Vertex(
          this.x, this.y, this.z, this.r, this.g, this.b, this.alpha, this.slot,
          0.0, 0.0, -this.w / 2, -this.h / 2, this.px, this.py, this.theta),
      new Vertex(
          this.x, this.y, this.z, this.r, this.g, this.b, this.alpha, this.slot,
          0.0, 1.0, -this.w / 2, this.h / 2, this.px, this.y, this.theta),
    ];
  }
}
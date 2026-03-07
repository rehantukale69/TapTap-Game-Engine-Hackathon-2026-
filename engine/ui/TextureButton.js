import {Vertex} from '../renderer/Basic.js';

export class TextureButton {
  constructor(x, y, z, w, h, r, g, b, alpha, slot, px, py, theta) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.w = w;
    this.h = h;

    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = alpha;

    this.slot = slot;

    this.px = px;
    this.py = py;
    this.theta = theta;

    this.Vertexes = [];

    this.Selected = false;
  }

  isInside(mx, my) {
    let halfW = this.w * 0.5 * 3.25;
    let halfH = this.h * 0.5 * 3.25;

    return (
        mx >= this.x - halfW && mx <= this.x + halfW && my >= this.y - halfH &&
        my <= this.y + halfH);
  }

  MouseClicked(mx, my) {
    return this.isInside(mx, my);
  }

  update() {
    this.Vertexes.length = 0;

    this.Vertexes.push(

        new Vertex(
            this.x, this.y, this.z, this.r, this.g, this.b, this.alpha,
            this.slot, 1.0, 1.0, this.w / 2, this.h / 2, this.px, this.py,
            this.theta),

        new Vertex(
            this.x, this.y, this.z, this.r, this.g, this.b, this.alpha,
            this.slot, 1.0, 0.0, this.w / 2, -this.h / 2, this.px, this.py,
            this.theta),

        new Vertex(
            this.x, this.y, this.z, this.r, this.g, this.b, this.alpha,
            this.slot, 0.0, 0.0, -this.w / 2, -this.h / 2, this.px, this.py,
            this.theta),

        new Vertex(
            this.x, this.y, this.z, this.r, this.g, this.b, this.alpha,
            this.slot, 0.0, 1.0, -this.w / 2, this.h / 2, this.px, this.py,
            this.theta));

    /*console.log(
        'Bounds:', this.x - this.w / 2, this.x + this.w / 2,
        this.y - this.h / 2, this.y + this.h / 2); */
  }

  clear() {
    this.Vertexes.length = 0;
  }
}
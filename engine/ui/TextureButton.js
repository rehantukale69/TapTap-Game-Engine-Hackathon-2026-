import {Object} from '../renderer/Object.js';

export class TextureButton {
  constructor(x, y, z, w, h, r, g, b, alpha, slot, px, py, theta) {
    this.RenderObject =
        new Object(x, y, z, w, h, r, g, b, alpha, slot, px, py, theta);
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
    /*console.log(
        'Bounds:', this.x - this.w / 2, this.x + this.w / 2,
        this.y - this.h / 2, this.y + this.h / 2); */
  }

  clear() {
    this.RenderObject.Vertxes.length = 0;
  }
}
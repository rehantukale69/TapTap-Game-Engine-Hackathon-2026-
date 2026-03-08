import {Vertex} from '../renderer/Basic.js';

export class TextButton {
  constructor(text, x, y, z, r, g, b, a, scale, slot, glyphMap) {
    this.RenderText = new Text(text, x, y, z, r, g, b, a, scale, slot);

    this.x = x;
    this.y = y;
    this.z = z;

    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = a;

    this.scale = scale;
    this.slot = slot;
  }

  isInside(mx, my) {
    let halfW = this.width * 0.5 * 3.25;
    let halfH = this.height * 0.5 * 3.25;

    return (
        mx >= this.x - halfW && mx <= this.x + halfW && my >= this.y - halfH &&
        my <= this.y + halfH);
  }

  MouseClicked(mx, my) {
    return this.isInside(mx, my);
  }


  update() {}

  clear() {
    this.RenderText.Vertexes.length = 0;
  }
}
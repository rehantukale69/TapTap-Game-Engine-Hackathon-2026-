import {Vertex} from './Basic.js';

export class Text {
  constructor(text, x, y, z, r, g, b, alpha, scale, slot) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = alpha;
    this.scale = scale;
    this.slot = slot;

    this.Vertexes = [];
    this.theta = 0.0;
  };

  update(glyphMap) {
    let x = this.x;
    let y = this.y;

    let px = 0;
    let py = 0;

    for (let char of this.text) {
      let g = glyphMap[char];
      if (!g) continue;

      let w = g.width * this.scale;
      let h = g.height * this.scale;

      let x0 = x;
      let x1 = x + w;

      let y0 = y;
      let y1 = y + h;

      // top right
      this.Vertexes.push(new Vertex(
          x1, y1, this.z, this.r, this.g, this.b, this.alpha, this.slot, g.u1,
          g.v0, 0, 0, px, py, this.theta));

      // bottom right
      this.Vertexes.push(new Vertex(
          x1, y0, this.z, this.r, this.g, this.b, this.alpha, this.slot, g.u1,
          g.v1, 0, 0, px, py, this.theta));

      // bottom left
      this.Vertexes.push(new Vertex(
          x0, y0, this.z, this.r, this.g, this.b, this.alpha, this.slot, g.u0,
          g.v1, 0, 0, px, py, this.theta));

      // top left
      this.Vertexes.push(new Vertex(
          x0, y1, this.z, this.r, this.g, this.b, this.alpha, this.slot, g.u0,
          g.v0, 0, 0, px, py, this.theta));

      // move pen position
      x += g.advance * this.scale;
    }
  }

  clear() {
    this.Vertexes = [];
  }
}
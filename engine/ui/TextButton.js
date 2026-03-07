import {Vertex} from '../renderer/Basic.js';

export class TextButton {
  constructor(text, x, y, z, r, g, b, a, scale, slot, glyphMap) {
    this.text = text;

    this.x = x;
    this.y = y;
    this.z = z;

    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = a;

    this.scale = scale;
    this.slot = slot;

    this.glyphMap = glyphMap;

    this.Vertexes = [];
    this.theta = 0;

    this.left = 0;
    this.right = 0;
    this.top = 0;
    this.bottom = 0;

    this.width = 0;
    this.height = 0;

    for (let char of text) {
      let g = glyphMap[char];
      if (!g) continue;

      this.width += g.advance * scale;
      this.height = Math.max(this.height, g.height * scale);
    }
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


  update() {
    let scale = this.scale;

    // ---- compute total width ----
    let totalWidth = 0;
    let maxHeight = 0;

    for (let char of this.text) {
      let g = this.glyphMap[char];
      if (!g) continue;

      totalWidth += g.advance * scale;
      maxHeight = Math.max(maxHeight, g.height * scale);
    }

    // ---- center start position ----
    let x = this.x - totalWidth * 0.5;
    let y = this.y - maxHeight * 0.5;



    for (let char of this.text) {
      let g = this.glyphMap[char];
      if (!g) continue;

      let w = g.width * scale;
      let h = g.height * scale;

      let x0 = x;
      let x1 = x + w;

      let y0 = y;
      let y1 = y + h;

      this.Vertexes.push(

          new Vertex(
              x1, y1, this.z, this.r, this.g, this.b, this.alpha, this.slot,
              g.u1, g.v0, 0, 0, 0, 0, this.theta),
          new Vertex(
              x1, y0, this.z, this.r, this.g, this.b, this.alpha, this.slot,
              g.u1, g.v1, 0, 0, 0, 0, this.theta),
          new Vertex(
              x0, y0, this.z, this.r, this.g, this.b, this.alpha, this.slot,
              g.u0, g.v1, 0, 0, 0, 0, this.theta),
          new Vertex(
              x0, y1, this.z, this.r, this.g, this.b, this.alpha, this.slot,
              g.u0, g.v0, 0, 0, 0, 0, this.theta)

      );

      x += g.advance * scale;
    }

    // ---- update bounding box ----
    this.left = this.x - totalWidth * 0.5;
    this.right = this.x + totalWidth * 0.5;

    this.bottom = this.y - maxHeight * 0.5;
    this.top = this.y + maxHeight * 0.5;
  }

  clear() {
    this.Vertexes.length = 0;
  }
}
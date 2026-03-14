import {Text} from '../renderer/Text.js';

export class TextButton {
  constructor(
      textcontent, x, y, z, r, g, b, a, scale, slot, glyphMap, action = null) {
    this.RenderText =
        new Text(textcontent, x, y, z, r, g, b, a, scale, slot, glyphMap);

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
    this.action = action;

    this.MouseClicked = false;
  }

  isInside(mx, my) {
    let halfW = this.RenderText.width * 0.5 * 3.25;
    let halfH = this.RenderText.height * 0.5 * 3.25;

    return (
        mx >= this.x - halfW && mx <= this.x + halfW && my >= this.y - halfH &&
        my <= this.y + halfH);
  }



  update(mx, my, click) {
    this.MouseClicked = false;
    if (this.isInside(mx, my) && click) {
      this.MouseClicked = true;
    }
  }

  clear() {
    this.RenderText.Vertexes.length = 0;
  }
}
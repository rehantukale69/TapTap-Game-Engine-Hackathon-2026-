// Import Vertex class used for rendering character quads
import {Vertex} from './Basic.js';

/*
=========================================================
TEXT RENDERING CLASS
---------------------------------------------------------
Responsible for rendering text in the engine using a
glyph atlas.

Each character is converted into a quad (4 vertices)
with texture coordinates pointing to the glyph inside
the font atlas.

Responsibilities:
- Store text properties
- Compute text dimensions
- Generate vertex data for characters
- Send vertex data to renderer
=========================================================
*/

export class Text {
  /*
  -------------------------------------------------------
  Constructor
  Initializes the text object and calculates its initial
  width and height based on glyph metrics.

  Parameters:
  text      → string to render
  x,y,z     → text position
  r,g,b,a   → color and transparency
  scale     → font size scaling
  slot      → texture slot used for glyph atlas
  glyphMap  → mapping of characters to glyph data
  -------------------------------------------------------
  */
  constructor(text, x, y, z, r, g, b, alpha, scale, slot, glyphMap) {
    // Text content
    this.text = text;

    // Position
    this.x = x;
    this.y = y;
    this.z = z;

    // Text color
    this.r = r;
    this.g = g;
    this.b = b;

    // Transparency
    this.alpha = alpha;

    // Text scale
    this.scale = scale;

    // Texture slot for glyph atlas
    this.slot = slot;

    // Vertex list used for rendering
    this.Vertexes = [];

    // Rotation angle (optional)
    this.theta = 0.0;

    // Glyph atlas containing font character data
    this.glyphMap = glyphMap;

    // Text bounding dimensions
    this.width = 0;
    this.height = 0;

    /*
    -----------------------------------------------------
    Compute text width and height
    -----------------------------------------------------
    Each glyph has metrics describing its advance width
    and height inside the font atlas.
    */

    for (let char of text) {
      let g = glyphMap[char];

      if (!g) continue;

      this.width += g.advance * scale;

      this.height = Math.max(this.height, g.height * scale);
    }
  };

  /*
  -------------------------------------------------------
  update()
  -------------------------------------------------------
  Generates vertex data for each character.

  Steps:
  1. Compute total text width and height
  2. Center text around (x, y)
  3. Create a quad (4 vertices) for each character
  -------------------------------------------------------
  */
  update() {
    let scale = this.scale;

    /* ------------------------------
       Compute text dimensions
    ------------------------------ */

    let totalWidth = 0;
    let maxHeight = 0;

    for (let char of this.text) {
      let g = this.glyphMap[char];

      if (!g) continue;

      totalWidth += g.advance * scale;

      maxHeight = Math.max(maxHeight, g.height * scale);
    }

    /* ------------------------------
       Center text on given position
    ------------------------------ */

    let x = this.x - totalWidth * 0.5;
    let y = this.y - maxHeight * 0.5;

    /*
    -----------------------------------------------------
    Generate vertices for each character
    -----------------------------------------------------
    Each glyph is rendered as a quad using four vertices.
    */

    for (let char of this.text) {
      let g = this.glyphMap[char];

      if (!g) continue;

      // Character width and height
      let w = g.width * scale;
      let h = g.height * scale;

      // Character quad positions
      let x0 = x;
      let x1 = x + w;

      let y0 = y;
      let y1 = y + h;

      // Add vertices forming the character quad
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

      // Move cursor forward by glyph advance width
      x += g.advance * scale;
    }
  }

  /*
  -------------------------------------------------------
  clear()
  -------------------------------------------------------
  Clears vertex data used for rendering.

  Useful when text content changes or the object
  is removed from the scene.
  -------------------------------------------------------
  */
  clear() {
    this.Vertexes = [];
  }
}
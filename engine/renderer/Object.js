// Import Vertex class used to build renderable geometry
import {Vertex} from './Basic.js';

/*
=========================================================
RENDER OBJECT
---------------------------------------------------------
Represents a renderable rectangular object (quad) in the
engine. The object is composed of four vertices which
form a rectangle that can be rendered using two triangles
in the GPU.

Responsibilities:
- Store object transformation and color data
- Generate vertex data for rendering
- Update vertex data when object properties change
=========================================================
*/

export class Object {
  /*
  -------------------------------------------------------
  Constructor
  Creates a rectangular render object using four vertices.

  Parameters:
  x,y,z        → position of object
  w,h          → width and height
  r,g,b,alpha  → color and transparency
  slot         → texture slot index
  px,py        → pivot point for rotation
  theta        → rotation angle
  -------------------------------------------------------
  */
  constructor(x, y, z, w, h, r, g, b, alpha, slot, px, py, theta) {
    /*
    -----------------------------------------------------
    Create the four vertices that form a quad
    -----------------------------------------------------
    Each vertex contains position, color, texture
    coordinates, offset and transformation information.
    */

    this.Vertexes = [

      // Top-right vertex
      new Vertex(
          x, y, z, r, g, b, alpha, slot, 1.0, 1.0, w / 2, h / 2, px, py, theta),

      // Bottom-right vertex
      new Vertex(
          x, y, z, r, g, b, slot, alpha, 1.0, 0.0, w / 2, -h / 2, px, py,
          theta),

      // Bottom-left vertex
      new Vertex(
          x, y, z, r, g, b, slot, alpha, 0.0, 0.0, -w / 2, -h / 2, px, py,
          theta),

      // Top-left vertex
      new Vertex(
          x, y, z, r, g, b, slot, alpha, 0.0, 1.0, -w / 2, h / 2, px, py,
          theta),
    ];

    /*
    -----------------------------------------------------
    Store object transformation and appearance data
    -----------------------------------------------------
    */

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

    // Pivot point used for rotation
    this.px = px;
    this.py = py;

    // Rotation angle
    this.theta = theta;
  }

  /*
  -------------------------------------------------------
  update()
  -------------------------------------------------------
  Rebuilds the vertex data when object properties such
  as position, rotation, color or size change.

  This ensures the renderer receives updated geometry
  every frame.
  -------------------------------------------------------
  */
  update() {
    this.Vertexes = [

      // Top-right vertex
      new Vertex(
          this.x, this.y, this.z, this.r, this.g, this.b, this.alpha, this.slot,
          1.0, 1.0, this.w / 2, this.h / 2, this.px, this.py, this.theta),

      // Bottom-right vertex
      new Vertex(
          this.x, this.y, this.z, this.r, this.g, this.b, this.alpha, this.slot,
          1.0, 0.0, this.w / 2, -this.h / 2, this.px, this.py, this.theta),

      // Bottom-left vertex
      new Vertex(
          this.x, this.y, this.z, this.r, this.g, this.b, this.alpha, this.slot,
          0.0, 0.0, -this.w / 2, -this.h / 2, this.px, this.py, this.theta),

      // Top-left vertex
      new Vertex(
          this.x, this.y, this.z, this.r, this.g, this.b, this.alpha, this.slot,
          0.0, 1.0, -this.w / 2, this.h / 2, this.px, this.y, this.theta),
    ];
  }
}
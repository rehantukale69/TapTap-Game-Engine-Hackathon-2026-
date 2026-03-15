/*
=========================================================
VERTEX CLASS
---------------------------------------------------------
Represents a single vertex used by the rendering system.

Each vertex stores all data required by the GPU shader,
including:
- Position in 3D space
- Color information
- Texture coordinates
- Transformation data (offset, pivot, rotation)
- Texture slot for atlas rendering

Vertices are typically grouped together to form
triangles or quads that are rendered on screen.
=========================================================
*/

export class Vertex {
  /*
  -------------------------------------------------------
  Constructor
  Initializes all vertex attributes used by the renderer.

  Parameters:
  x,y,z        → vertex position
  r,g,b,alpha  → vertex color and transparency
  slot         → texture slot index (used for texture atlas)
  tx,ty        → texture coordinates
  ox,oy        → vertex offset from object center
  px,py        → pivot point for rotation
  theta        → rotation angle
  -------------------------------------------------------
  */
  constructor(x, y, z, r, g, b, alpha, slot, tx, ty, ox, oy, px, py, theta) {
    /*
    -----------------------------------------------------
    Location
    -----------------------------------------------------
    3D position of the vertex in world space.
    Stored in Float32Array for efficient GPU transfer.
    */
    this.Location = new Float32Array([x, y, z]);

    /*
    -----------------------------------------------------
    Color
    -----------------------------------------------------
    RGBA color used for tinting the vertex.
    */
    this.Color = new Float32Array([r, g, b, alpha]);

    /*
    -----------------------------------------------------
    Texture Slot
    -----------------------------------------------------
    Index of texture used from the texture atlas.
    */
    this.Slot = slot;

    /*
    -----------------------------------------------------
    Texture Coordinates
    -----------------------------------------------------
    Coordinates used to sample the texture.
    */
    this.TextureCoordinates = new Float32Array([tx, ty]);

    /*
    -----------------------------------------------------
    Offset
    -----------------------------------------------------
    Offset from the object's center used for building
    quads or shapes.
    */
    this.Offset = new Float32Array([ox, oy]);

    /*
    -----------------------------------------------------
    Pivot
    -----------------------------------------------------
    Pivot point used for object rotation.
    */
    this.Pivot = new Float32Array([px, py]);

    /*
    -----------------------------------------------------
    Rotation
    -----------------------------------------------------
    Rotation angle applied to the vertex.
    */
    this.theta = theta;
  }
}
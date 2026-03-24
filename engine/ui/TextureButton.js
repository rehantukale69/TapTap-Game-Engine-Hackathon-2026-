// Import render object used for textured UI elements
import {Object} from '../renderer/Object.js';

/*
=========================================================
TEXTURE BUTTON UI ELEMENT
---------------------------------------------------------
Represents a clickable UI button rendered using a
textured rectangle (sprite).

Responsibilities:
- Render a textured UI element
- Detect mouse interaction inside button bounds
- Trigger events when clicked
=========================================================
*/

export class TextureButton {
  /*
  -------------------------------------------------------
  Constructor
  Creates a textured button and initializes all
  rendering and interaction parameters.

  Parameters:
  x,y,z   → position of the button
  w,h     → width and height of the button
  r,g,b   → color tint
  alpha   → transparency
  slot    → render layer slot
  px,py   → texture coordinates (atlas position)
  theta   → rotation
  action  → event triggered when button is clicked
  -------------------------------------------------------
  */
  constructor(
      x, y, z, w, h, r, g, b, alpha, slot, px, py, theta, action = null, randp,
      scale, texturesize) {
    // Position
    this.x = randp ?
        (Math.floor(Math.random() * (randp.max.x - randp.min.x + 1)) +
         randp.min.x) :
        x;
    this.y = randp ?
        (Math.floor(Math.random() * (randp.max.y - randp.min.y + 1)) +
         randp.min.y) :
        y;

    this.z = z;

    // Size of button
    this.w = texturesize.w * scale;
    this.h = texturesize.h * scale;

    // Color tint
    this.r = r;
    this.g = g;
    this.b = b;

    this.randp = randp;

    // Transparency
    this.alpha = alpha;

    // Rendering layer
    this.slot = slot;

    this.texturesize = texturesize;
    this.scale = scale;

    // Create render object representing the textured UI quad
    this.RenderObject = new Object(
        this.x, this.y, this.z, this.w, this.h, this.r, this.g, this.b,
        this.alpha, this.slot, px, py, theta, this.texturesize);



    // Selection state (can be used for highlighting)
    this.Selected = false;

    // Action/event triggered when button is clicked
    this.action = action;

    // Flag indicating whether button was clicked this frame
    this.MouseClicked = false;
  }

  /*
  -------------------------------------------------------
  isInside(mx, my)
  -------------------------------------------------------
  Checks whether the mouse position lies within the
  clickable region of the button.

  Parameters:
  mx → mouse x coordinate
  my → mouse y coordinate

  Returns:
  true if mouse is inside button bounds
  -------------------------------------------------------
  */
  isInside(mx, my) {
    // Compute half width and height for bounding box
    let halfW = this.w * 0.5 * 3.25;
    let halfH = this.h * 0.5 * 3.25;

    return (
        mx >= this.x - halfW && mx <= this.x + halfW && my >= this.y - halfH &&
        my <= this.y + halfH);
  }

  /*
  -------------------------------------------------------
  update(mx, my, click)
  -------------------------------------------------------
  Updates button interaction each frame.

  Parameters:
  mx    → current mouse x position
  my    → current mouse y position
  click → whether mouse button was pressed

  If the mouse is inside the button and clicked,
  MouseClicked becomes true.
  -------------------------------------------------------
  */
  update(mx, my, click) {
    // Reset click state each frame
    this.MouseClicked = false;

    // Detect click inside button
    if (this.isInside(mx, my) && click) {
      this.MouseClicked = true;
    }
  }

  /*
  -------------------------------------------------------
  clear()
  -------------------------------------------------------
  Clears the vertex data used by the renderer.
  Useful when removing the button from the scene
  or freeing rendering resources.
  -------------------------------------------------------
  */
  clear() {
    // Remove vertex data from render object
    this.RenderObject.Vertxes.length = 0;
  }
}
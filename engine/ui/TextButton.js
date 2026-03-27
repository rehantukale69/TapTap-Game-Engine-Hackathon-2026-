// Import text renderer used to display button text
import {Text} from '../renderer/Text.js';

/*
=========================================================
TEXT BUTTON UI ELEMENT
---------------------------------------------------------
This class represents a clickable UI button rendered
using text. It detects mouse interaction and triggers
actions defined by the UI system.

Responsibilities:
- Render text on screen
- Detect mouse clicks inside button area
- Trigger events when clicked
=========================================================
*/

export class TextButton {
  /*
  -------------------------------------------------------
  Constructor
  Creates a new text-based button and initializes all
  rendering and interaction properties.

  Parameters:
  textcontent → text displayed on button
  x,y,z       → button position
  r,g,b,a     → color and transparency
  scale       → text scale
  slot        → render layer slot
  glyphMap    → font atlas for rendering
  action      → event triggered when button is clicked
  -------------------------------------------------------
  */
  constructor(
      textcontent, x, y, z, r, g, b, a, scale, slot, glyphMap, action = null,
      randp, canvas, id) {
    this.x = randp ?
        (Math.floor(Math.random() * (randp.max.x - randp.min.x + 1)) +
         randp.min.x) :
        x;
    this.y = randp ?
        (Math.floor(Math.random() * (randp.max.y - randp.min.y + 1)) +
         randp.min.y) :
        y;

    this.z = z;


    // Color tint
    this.r = r;
    this.g = g;
    this.b = b;

    this.alpha = a;

    // Rendering layer
    this.slot = slot;

    this.randp = randp;

    // Transparency
    this.alpha = a;

    // Rendering layer
    this.slot = slot;

    this.ID = id;

    // Create text render object
    this.RenderText = new Text(
        textcontent, this.x, this.y, this.z, this.r, this.g, this.b, this.alpha,
        scale, this.slot, glyphMap);



    // Font glyph atlas
    this.glyphMap = glyphMap;

    // Action/event triggered when button is clicked
    this.action = action;

    // Flag that becomes true when button is clicked
    this.MouseClicked = false;

    this.glcanvas = canvas;
  }

  /*
  -------------------------------------------------------
  isInside(mx, my)
  -------------------------------------------------------
  Checks whether the mouse position is inside the
  clickable area of the button.

  Parameters:
  mx → mouse x coordinate
  my → mouse y coordinate

  Returns:
  true if mouse is inside button bounds
  -------------------------------------------------------
  */
  isInside(mx, my) {
    // Compute half width and height of button area
    // (scaled based on rendered text size)


    let rect = this.glcanvas.getBoundingClientRect();

    let f = 1 / Math.tan((45 * Math.PI / 180) / 2);
    let scale = f / Math.abs(this.z);

    let ndcX = (this.x * scale) * (rect.height / rect.width);
    let ndcY = (this.y * scale);

    // Convert to pixels
    let cx = (ndcX) * 0.5 * rect.width;
    let cy = (ndcY) * 0.5 * rect.height;


    let halfW = this.RenderText.width * 0.25 * scale *
        (rect.height / rect.width) * rect.width;
    let halfH = this.RenderText.height * 0.25 * scale * rect.height;


    return (
        mx >= cx - halfW && mx <= cx + halfW && my >= cy - halfH &&
        my <= cy + halfH);
  }

  /*
  -------------------------------------------------------
  update(mx, my, click)
  -------------------------------------------------------
  Updates button interaction every frame.

  Parameters:
  mx    → current mouse x position
  my    → current mouse y position
  click → whether mouse button was pressed

  If mouse is inside button area and clicked,
  MouseClicked becomes true.
  -------------------------------------------------------
  */
  update(mx, my, click) {
    // Reset click state each frame
    this.MouseClicked = false;

    // Check if mouse is inside button and clicked
    if (this.isInside(mx, my) && click) {
      this.MouseClicked = true;
    }
  }

  /*
  -------------------------------------------------------
  clear()
  -------------------------------------------------------
  Clears the vertex data used by the text renderer.
  Useful when removing the button from the scene.
  -------------------------------------------------------
  */
  clear() {
    this.RenderText.Vertexes.length = 0;
  }
}
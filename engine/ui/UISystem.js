/*
=========================================================
UI / INPUT SYSTEM
---------------------------------------------------------
Responsible for handling user input from:
- Mouse (movement, click, press, release)
- Keyboard (pressed, held, released)

This system tracks input states every frame so that
game logic and UI elements can respond accordingly.

Input states tracked:
- Pressed   → triggered once when key/button is pressed
- Down      → true while key/button is held
- Released  → triggered once when key/button is released
=========================================================
*/

export class UISystem {
  /*
  -------------------------------------------------------
  Constructor
  Initializes mouse and keyboard input tracking and
  attaches event listeners to the canvas and window.
  -------------------------------------------------------
  */
  constructor(glcanvas) {
    // Canvas used for rendering
    this.glcanvas = glcanvas;

    /* ---------------------------
       Mouse state variables
    --------------------------- */

    // Current mouse position on canvas
    this.mouseX = 0;
    this.mouseY = 0;

    // True while mouse button is held
    this.mouseDown = false;

    // True for one frame when mouse button is pressed
    this.mousePressed = false;

    // True for one frame when mouse button is released
    this.mouseReleased = false;

    /* ---------------------------
       Keyboard state variables
    --------------------------- */

    // Keys currently held down
    this.keysDown = {};

    // Keys pressed this frame
    this.keysPressed = {};

    // Keys released this frame
    this.keysReleased = {};

    /* =================================================
       Mouse Event Listeners
       ================================================= */

    // Mouse movement
    this.glcanvas.addEventListener('mousemove', (e) => {
      const rect = this.glcanvas.getBoundingClientRect();

      const scaleX = this.glcanvas.width / rect.width;
      const scaleY = this.glcanvas.height / rect.height;



      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;
    });

    // Mouse button pressed
    this.glcanvas.addEventListener('mousedown', () => {
      // Detect first press event
      if (!this.mouseDown) {
        this.mousePressed = true;
      }

      this.mouseDown = true;
    });

    // Mouse button released
    this.glcanvas.addEventListener('mouseup', () => {
      this.mouseReleased = true;
      this.mouseDown = false;
    });

    /* =================================================
       Keyboard Event Listeners
       ================================================= */

    // Key pressed
    window.addEventListener('keydown', (e) => {
      // Prevent browser scrolling with arrow keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
              e.code)) {
        e.preventDefault();
      }

      // Detect first press event
      if (!this.keysDown[e.code]) {
        this.keysPressed[e.code] = true;
      }

      // Mark key as held
      this.keysDown[e.code] = true;
    });

    // Key released
    window.addEventListener('keyup', (e) => {
      this.keysReleased[e.code] = true;

      this.keysDown[e.code] = false;
    });
  }

  /*
  -------------------------------------------------------
  Keyboard Query Functions
  -------------------------------------------------------
  Used by game logic to check key states
  -------------------------------------------------------
  */

  // Returns true while key is held
  isDown(key) {
    return this.keysDown[key];
  }

  // Returns true for one frame when key is pressed
  isPressed(key) {
    return this.keysPressed[key];
  }

  // Returns true for one frame when key is released
  isReleased(key) {
    return this.keysReleased[key];
  }

  /*
  -------------------------------------------------------
  Mouse Query Functions
  -------------------------------------------------------
  Used by UI buttons and gameplay systems
  -------------------------------------------------------
  */

  // True while mouse button is held
  isMouseDown() {
    return this.mouseDown;
  }

  // True if mouse was clicked
  isMouseClicked() {
    return this.mouseClicked;
  }

  // True on first frame of mouse press
  isMousePressed() {
    return this.mousePressed;
  }

  // True on first frame of mouse release
  isMouseReleased() {
    return this.mouseReleased;
  }

  /*
  -------------------------------------------------------
  getMousePos()
  -------------------------------------------------------
  Converts canvas mouse coordinates into world
  coordinates centered around the screen.

  Returns:
  { x, y } → world-space mouse position
  -------------------------------------------------------
  */
  getMousePos() {
    let worldX = this.mouseX - this.glcanvas.width / 2;
    let worldY = this.glcanvas.height / 2 - this.mouseY;

    return {x: worldX, y: worldY};
  }

  /*
  -------------------------------------------------------
  endFrame()
  -------------------------------------------------------
  Clears one-frame input states so that pressed/released
  events only trigger once per frame.
  -------------------------------------------------------
  */
  endFrame() {
    // Reset keyboard events
    this.keysPressed = {};
    this.keysReleased = {};

    // Reset mouse events
    this.mousePressed = false;
    this.mouseReleased = false;
    this.mouseClicked = false;
  }

  /*
  Optional update method (currently unused)
  Can be used for additional input processing.
  */
  update() {}
}
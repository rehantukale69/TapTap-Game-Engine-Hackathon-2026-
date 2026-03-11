export class UISystem {
  constructor(glcanvas) {
    this.glcanvas = glcanvas;

    this.mouseX = 0;
    this.mouseY = 0;

    this.mouseClicked = false;
    this.mouseDown = false;

    this.keysDown = {};
    this.keysPressed = {};
    this.keysReleased = {};

    // Mouse movement
    this.glcanvas.addEventListener('mousemove', (e) => {
      const rect = this.glcanvas.getBoundingClientRect();

      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    // Mouse click
    this.glcanvas.addEventListener('mousedown', () => {
      this.mouseClicked = true;
      this.mouseDown = true;
    });

    this.glcanvas.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });

    // Keyboard input
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
              e.code)) {
        e.preventDefault();
      }

      if (!this.keysDown[e.code]) {
        this.keysPressed[e.code] = true;
      }

      this.keysDown[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keysReleased[e.code] = true;
      this.keysDown[e.code] = false;
    });
  }


  isDown(key) {
    return this.keysDown[key];
  }

  isPressed(key) {
    return this.keysPressed[key];
  }

  isReleased(key) {
    return this.keysReleased[key];
  }

  isMouseDown() {
    return this.mouseDown;
  }

  isMouseClicked() {
    return this.mouseClicked;
  }

  getMousePos() {
    let worldX = this.mouseX - this.glcanvas.width / 2;
    let worldY = this.glcanvas.height / 2 - this.mouseY;

    return {x: worldX, y: worldY};
  }

  endFrame() {
    this.keysPressed = {};
    this.keysReleased = {};
    this.mouseClicked = false;
  }

  update() {
    this.endFrame();
  }
}
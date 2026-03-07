

export class UISystem {
  constructor(glcanvas) {
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseClicked = false;
    this.glcanvas = glcanvas;

    this.glcanvas.addEventListener('mousemove', (e) => {
      const rect = this.glcanvas.getBoundingClientRect();

      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.glcanvas.addEventListener('mousedown', () => {
      this.mouseClicked = true;
    });
  }

  isMouseClicked() {
    return this.mouseClicked;
  }

  getMousePos() {
    let worldX = this.mouseX - this.glcanvas.width / 2;
    let worldY = this.glcanvas.height / 2 - this.mouseY;

    return {x: worldX, y: worldY};
  }



  update() {
    if (this.mouseClicked) {
      this.mouseClicked = false;
    }

    // console.log(this.getMousePos());
  }
}
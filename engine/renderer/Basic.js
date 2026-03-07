export class Vertex {
  constructor(x, y, z, r, g, b, alpha, slot, tx, ty, ox, oy, px, py, theta) {
    this.Location = new Float32Array([x, y, z]);
    this.Color = new Float32Array([r, g, b, alpha]);
    this.Slot = slot;
    this.TextureCoordinates = new Float32Array([tx, ty]);
    this.Offset = new Float32Array([ox, oy]);
    this.Pivot = new Float32Array([px, py]);
    this.theta = theta;
  }
}

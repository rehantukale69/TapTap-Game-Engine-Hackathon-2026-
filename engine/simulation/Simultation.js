// import planck from
// 'https://cdn.jsdelivr.net/npm/planck-js@latest/dist/planck.min.js';

export class Simulation {
  constructor(gravity = [0, -10]) {
    this.pl = planck;

    this.world =
        new this.pl.World({gravity: this.pl.Vec2(gravity[0], gravity[1])});

    this.destroyQueue = [];
  }

  step(dt) {
    const velocityIterations = 8;
    const positionIterations = 3;

    this.world.step(dt, velocityIterations, positionIterations);

    for (const body of this.destroyQueue) {
      this.world.destroyBody(body);
    }

    this.destroyQueue.length = 0;
  }

  createBoxBody(x, y, type = 'dynamic') {
    const body = this.world.createBody({
      type: type === 'static' ? 'static' : 'dynamic',
      position: this.pl.Vec2(x, y)
    });

    return body;
  }

  destroyBody(body) {
    this.destroyQueue.push(body);
  }

  ReturnWorld() {
    return this.world;
  }
}
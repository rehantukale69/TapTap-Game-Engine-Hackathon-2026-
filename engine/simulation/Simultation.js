import planck from 'planck-js';

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

  createBoxBody(x, y, w, h, type = 'dynamic') {
    const body =
        this.world.createBody({type: type, position: this.pl.Vec2(x, y)});
    return body;
  }

  destroyBody(body) {
    this.destroyQueue.push(body);
  }

  ReturnWorld() {
    return this.world;
  }
}
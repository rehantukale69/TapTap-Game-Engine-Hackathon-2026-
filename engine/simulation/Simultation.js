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

    for (const body of this.destroyQueue) {
      this.world.destroyBody(body);
    }

    this.destroyQueue.length = 0;
    this.world.step(dt, velocityIterations, positionIterations);
  }

  createBoxBody(Object, type = 'dynamic') {
    const body = this.world.createBody(
        {type: type, position: this.pl.Vec2(Object.x, Object.y)});

    body.createFixture(
        this.pl.Box(Object.w, Object.h), {density: 1, friction: 0.3});

    return body;
  }

  destroyBody(body) {
    this.destroyQueue.push(body);
  }
}

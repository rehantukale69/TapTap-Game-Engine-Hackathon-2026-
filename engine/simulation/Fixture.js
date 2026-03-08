import planck from 'planck-js';

export class Fixture {
  constructor(
      ID, body, x, y, w, h, density, friction, restitution, issensor, theta) {
    this.ID = ID;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.density = density;
    this.friction = friction;
    this.restitution = restitution;
    this.issensor = issensor;
    this.theta = theta;

    this.body = body;

    this.shape =
        planck.Box(this.w, this.h, planck.Vec2(this.x, this.y), tthis.heta);
    this.fixture = this.body.createFixture(this.shape, {
      density: this.density,
      friction: this.friction,
      restitution: this.restitution,
      isSensor: this.issensor
    });
  }


  ReturnFixture() {
    return this.fixture;
  }

  Delete() {
    this.body.destroyFixture(this.fixture);
  }

  update() {
    this.body.destroyFixture(this.fixture);
    this.shape = planck.Box(this.w, this.h, planck.Vec2(x, y), this.theta);
    this.fixture = this.body.createFixture(this.shape, {
      density: this.density,
      friction: this.friction,
      restitution: this.restitution,
      issensor: this.issensor
    });
  }
}
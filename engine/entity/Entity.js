import {Object} from '../renderer/Object';
import {Fixture} from '../simulation/Fixture';

export class Entity {
  constructor(
      x, y, z, w, h, r, g, b, alpha, slot, px, py, theta, SimultaionWorld,
      bodytype) {
    this.RenderObject =
        new Object(x, y, z, w, h, r, g, b, alpha, slot, px, py, theta);
    this.World = SimultaionWorld;
    this.bodytype = bodytype;
    this.body =
        this.World.createBoxBody(this.x, this.y, this.w, this.h, this.bodytype);
    this.fixtures = [];

    this.Selected = false;
  }


  AddFixture(x, y, w, h, density, friction, restitution, issensor, theta) {
    const fix = new Fixture(
        this.fixtures.length + 1, this.body, x, y, w, h, density, friction,
        restitution, issensor, theta);

    this.fixtures.push(fix);

    return fix;
  }

  RemoveFixture(fixture) {
    fixture.Delete();

    const index = this.fixtures.indexOf(fixture);

    if (index !== -1) {
      this.fixtures.splice(index, 1);
    }
  }


  RemoveAllFixtures() {
    for (let fixture of this.fixtures) {
      fixture.Delete();
    }

    this.fixtures = [];
  }
  update() {
    if (!this.Selected) {
      const pos = this.body.getPosition();

      this.RenderObject.x = pos.x;
      this.RenderObject.y = pos.y;

      this.RenderObject.theta = this.body.getAngle();
    }
  }
}
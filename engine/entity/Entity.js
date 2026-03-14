import {Object} from '../renderer/Object.js';
import {Fixture} from '../simulation/Fixture.js';

const SCALE = 50;

export class Entity {
  constructor(
      x, y, z, w, h, r, g, b, alpha, slot, px, py, theta, simulationWorld,
      bodytype, ID) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.World = simulationWorld;
    this.bodytype = bodytype;

    this.RenderObject =
        new Object(x, y, z, w, h, r, g, b, alpha, slot, px, py, theta);

    // Convert pixels → physics meters
    this.body = this.World.createBoxBody(x / SCALE, y / SCALE, bodytype);

    this.body.setAwake(true);


    this.fixtures = [];
    this.fixtureID = 0;
    this.ID = ID;

    this.Selected = false;
  }

  AddFixture(x, y, w, h, density, friction, restitution, issensor, theta) {
    this.fixtureID++;

    const fix = new Fixture(
        this.fixtureID, this.body, x, y, w / SCALE / 2, h / SCALE / 2, density,
        friction, restitution, issensor, theta);

    this.fixtures.push(fix);

    this.body.setAwake(true);

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

  GetEntityID() {
    return this.ID;
  }

  DeleteEntity() {
    this.RemoveAllFixtures();

    if (this.body) this.World.destroyBody(this.body);
  }

  update() {
    const pos = this.body.getPosition();

    if (!this.Selected) {
      // Physics → render conversion
      this.RenderObject.x = pos.x * SCALE;
      this.RenderObject.y = pos.y * SCALE;
      this.RenderObject.theta = this.body.getAngle();

    } else {
      // If entity is moved manually in editor
      this.body.setTransform(
          {x: this.RenderObject.x / SCALE, y: this.RenderObject.y / SCALE},
          this.RenderObject.theta);
    }
  }
}
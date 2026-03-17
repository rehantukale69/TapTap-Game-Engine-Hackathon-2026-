/*
=========================================================
PHYSICS FIXTURE
---------------------------------------------------------
Represents a physics collision shape attached to a body
in the Planck.js physics engine.

Responsibilities:
- Define collision shape (box)
- Store physics properties
- Attach fixture to a physics body
- Allow updating or deleting the fixture
=========================================================
*/

export class Fixture {
  /*
  -------------------------------------------------------
  Constructor
  Creates a physics fixture and attaches it to a body.

  Parameters:
  ID          → unique identifier for fixture
  body        → physics body this fixture belongs to
  x,y         → local offset position on the body
  w,h         → half width and half height of box shape
  density     → mass density of fixture
  friction    → surface friction
  restitution → bounce coefficient
  issensor    → whether fixture acts as a sensor
  theta       → rotation of the fixture
  -------------------------------------------------------
  */
  constructor(
      ID, body, x, y, w, h, density, friction, restitution, issensor, theta,
      categoryBits, maskBits) {
    // Unique fixture ID
    this.ID = ID;

    // Local offset relative to body center
    this.x = x;
    this.y = y;

    // Half-width and half-height of box shape
    this.w = w;
    this.h = h;

    // Physics properties
    this.density = density;
    this.friction = friction;
    this.restitution = restitution;

    // Sensor flag (used for triggers instead of collisions)
    this.issensor = issensor;

    // Rotation of fixture
    this.theta = theta;

    // Physics body to which the fixture is attached
    this.body = body;

    this.CategoryBits = categoryBits;
    this.MaskBits = maskBits;

    /* --------------------------------------------------
       Create Planck.js collision shape
    -------------------------------------------------- */

    this.shape =
        planck.Box(this.w, this.h, planck.Vec2(this.x, this.y), this.theta);

    /* --------------------------------------------------
       Attach fixture to body
    -------------------------------------------------- */

    this.fixture = this.body.createFixture(this.shape, {
      density: this.density,
      friction: this.friction,
      restitution: this.restitution,
      isSensor: this.issensor,
      filterCategoryBits: this.CategoryBits,
      filterMaskBits: this.MaskBits
    });
  }

  /*
  -------------------------------------------------------
  ReturnFixture()
  -------------------------------------------------------
  Returns the underlying Planck.js fixture object.
  Useful when interacting directly with the physics
  engine (for collision detection, etc.).
  -------------------------------------------------------
  */
  ReturnFixture() {
    return this.fixture;
  }

  /*
  -------------------------------------------------------
  Delete()
  -------------------------------------------------------
  Removes the fixture from the physics body.
  -------------------------------------------------------
  */
  Delete() {
    this.body.destroyFixture(this.fixture);
  }

  /*
  -------------------------------------------------------
  update()
  -------------------------------------------------------
  Recreates the fixture using updated parameters.

  This is necessary because Planck.js fixtures cannot
  be directly resized or modified after creation.
  -------------------------------------------------------
  */
  update() {
    // Remove old fixture
    this.body.destroyFixture(this.fixture);

    // Recreate collision shape
    this.shape =
        planck.Box(this.w, this.h, planck.Vec2(this.x, this.y), this.theta);

    // Create new fixture with updated properties
    this.fixture = this.body.createFixture(this.shape, {
      density: this.density,
      friction: this.friction,
      restitution: this.restitution,
      issensor: this.issensor
    });
  }
}
// Import rendering object used to display the entity
import {Object} from '../renderer/Object.js';
// Import physics fixture class
import {Fixture} from '../simulation/Fixture.js';

// Conversion factor between pixels and physics world units
const SCALE = 50;

/*
=========================================================
ENTITY CLASS
---------------------------------------------------------
Represents a game object inside the scene.

Responsibilities:
- Maintain render representation
- Maintain physics body
- Manage collision fixtures
- Synchronize physics simulation with rendering
=========================================================
*/

export class Entity {
  /*
  -------------------------------------------------------
  Constructor
  Creates a new entity with rendering and physics body.

  Parameters:
  x,y,z        → entity position
  w,h          → width and height
  r,g,b,alpha  → color and transparency
  slot         → render layer
  px,py        → texture atlas coordinates
  theta        → rotation
  simulationWorld → physics simulation reference
  bodytype     → physics body type ("dynamic" or "static")
  ID           → unique entity identifier
  -------------------------------------------------------
  */
  constructor(
      x, y, z, scale, r, g, b, alpha, slot, px, py, theta, simulationWorld,
      bodytype, ID, categoryBits, maskmap, texturesize, gravity = null,
      velocity = null, randp, randv) {
    // Position and size
    this.x = randp ?
        (Math.floor(Math.random() * (randp.max.x - randp.min.x + 1)) +
         randp.min.x) :
        x;
    this.y = randp ?
        (Math.floor(Math.random() * (randp.max.y - randp.min.y + 1)) +
         randp.min.y) :
        y;
    this.w = texturesize.w * scale;
    this.h = texturesize.h * scale;

    this.scale = scale;

    // Reference to physics simulation world
    this.World = simulationWorld;

    // Body type (static/dynamic)
    this.bodytype = bodytype;

    this.gravity = gravity;
    this.velocity = {
      x: randv ? Math.floor(Math.random() * (randv.max.x - randv.min.x + 1)) +
              randv.min.x :
                 (velocity?.x ?? 0),

      y: randv ? Math.floor(Math.random() * (randv.max.y - randv.min.y + 1)) +
              randv.min.y :
                 (velocity?.y ?? 0)
    };
    /*
    -----------------------------------------------------
    Rendering Object
    -----------------------------------------------------
    Represents the visual appearance of the entity.
    */


    this.RenderObject = new Object(
        this.x, this.y, z, this.w, this.h, r, g, b, alpha, slot, px, py, theta,
        texturesize);

    /*
    -----------------------------------------------------
    Create Physics Body
    -----------------------------------------------------
    Physics engines use meter units instead of pixels,
    so positions are converted using SCALE.
    */
    this.body =
        this.World.createBoxBody(this.x / SCALE, this.y / SCALE, bodytype);

    if (bodytype == 'kinematic') {
      this.body.setLinearVelocity(
          planck.Vec2(this.velocity.x, this.velocity.y));
    }

    this.body.setGravityScale(this.gravity ?? 1);

    // Wake body so physics simulation affects it
    this.body.setAwake(true);

    /*
    -----------------------------------------------------
    Fixture Management
    -----------------------------------------------------
    Fixtures define the collision shapes of the entity.
    */
    this.fixtures = [];
    this.fixtureID = 0;



    this.randp = randp;
    this.randv = randv;

    // Unique entity identifier
    this.ID = ID;

    // Used in editor mode when manually moving entities
    this.Selected = false;

    this.CategoryBits = categoryBits;
    this.MasksMap = maskmap || {};

    this.TextureSize = texturesize;


    this.body.setUserData(this);
  }

  /*
  -------------------------------------------------------
  AddFixture()
  -------------------------------------------------------
  Creates a new physics fixture and attaches it to the
  entity's body.

  Returns:
  The newly created fixture
  -------------------------------------------------------
  */
  AddFixture(x, y, w, h, density, friction, restitution, issensor, theta) {
    this.fixtureID++;

    let maskBits = 0;

    for (const key in this.MasksMap) {
      maskBits |= Number(key);
    }

    const fix = new Fixture(
        this.fixtureID, this.body, x, y, (w / 2) / SCALE, (h / 2) / SCALE,
        density, friction, restitution, issensor, theta, this.CategoryBits,
        maskBits);

    this.fixtures.push(fix);
    this.body.setAwake(true);

    return fix;
  }

  /*
  -------------------------------------------------------
  RemoveFixture()
  -------------------------------------------------------
  Removes a specific fixture from the entity.
  -------------------------------------------------------
  */
  RemoveFixture(fixture) {
    // Remove fixture from physics body
    fixture.Delete();

    const index = this.fixtures.indexOf(fixture);

    if (index !== -1) {
      this.fixtures.splice(index, 1);
    }
  }

  /*
  -------------------------------------------------------
  RemoveAllFixtures()
  -------------------------------------------------------
  Deletes all fixtures attached to this entity.
  -------------------------------------------------------
  */
  RemoveAllFixtures() {
    for (let fixture of this.fixtures) {
      fixture.Delete();
    }

    this.fixtures = [];
  }

  /*
  -------------------------------------------------------
  GetEntityID()
  -------------------------------------------------------
  Returns the unique entity ID.
  -------------------------------------------------------
  */
  GetEntityID() {
    return this.ID;
  }

  /*
  -------------------------------------------------------
  DeleteEntity()
  -------------------------------------------------------
  Completely removes the entity from the physics world.
  -------------------------------------------------------
  */
  DeleteEntity() {
    this.RemoveAllFixtures();

    if (this.body) this.World.destroyBody(this.body);
  }

  /*
  -------------------------------------------------------
  update()
  -------------------------------------------------------
  Synchronizes physics simulation with rendering.

  Two modes:
  1. Physics Mode (normal gameplay)
     → physics controls render position

  2. Editor Mode (Selected = true)
     → manual movement updates physics body
  -------------------------------------------------------
  */
  update() {
    const pos = this.body.getPosition();

    if (!this.Selected) {
      // Physics → Render conversion
      this.RenderObject.x = pos.x * SCALE;
      this.RenderObject.y = pos.y * SCALE;
      this.RenderObject.theta = this.body.getAngle();

    } else {
      // Editor manipulation → update physics body
      this.body.setTransform(
          {x: this.RenderObject.x / SCALE, y: this.RenderObject.y / SCALE},
          this.RenderObject.theta);
    }
  }
}
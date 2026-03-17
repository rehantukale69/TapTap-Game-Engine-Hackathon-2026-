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
      x, y, z, w, h, r, g, b, alpha, slot, px, py, theta, simulationWorld,
      bodytype, ID, categoryBits, maskmap) {
    // Position and size
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // Reference to physics simulation world
    this.World = simulationWorld;

    // Body type (static/dynamic)
    this.bodytype = bodytype;

    /*
    -----------------------------------------------------
    Rendering Object
    -----------------------------------------------------
    Represents the visual appearance of the entity.
    */
    this.RenderObject =
        new Object(x, y, z, w, h, r, g, b, alpha, slot, px, py, theta);

    /*
    -----------------------------------------------------
    Create Physics Body
    -----------------------------------------------------
    Physics engines use meter units instead of pixels,
    so positions are converted using SCALE.
    */
    this.body = this.World.createBoxBody(x / SCALE, y / SCALE, bodytype);

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

    // Unique entity identifier
    this.ID = ID;

    // Used in editor mode when manually moving entities
    this.Selected = false;

    this.CategoryBits = categoryBits;
    this.MasksMap = maskmap || {};



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
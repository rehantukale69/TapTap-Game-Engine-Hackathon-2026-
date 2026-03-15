/*
=========================================================
PHYSICS SIMULATION SYSTEM
---------------------------------------------------------
Handles the physics simulation using the Planck.js
physics engine (a JavaScript implementation of Box2D).

Responsibilities:
- Create and manage the physics world
- Step the simulation each frame
- Create physics bodies
- Safely destroy bodies after simulation step
=========================================================
*/

export class Simulation {
  /*
  -------------------------------------------------------
  Constructor
  Initializes the physics world with gravity.

  Parameters:
  gravity → array [gx, gy] representing gravity vector
  -------------------------------------------------------
  */
  constructor(gravity = [0, -10]) {
    // Reference to Planck physics library
    this.pl = planck;

    // Create physics world with gravity
    this.world =
        new this.pl.World({gravity: this.pl.Vec2(gravity[0], gravity[1])});

    // Queue used to safely remove bodies after physics step
    this.destroyQueue = [];
  }

  /*
  -------------------------------------------------------
  step(dt)
  -------------------------------------------------------
  Advances the physics simulation by one frame.

  Parameters:
  dt → delta time (time elapsed since last frame)

  Planck requires velocity and position iterations
  for accurate collision resolution.
  -------------------------------------------------------
  */
  step(dt) {
    const velocityIterations = 8;
    const positionIterations = 3;

    // Advance physics simulation
    this.world.step(dt, velocityIterations, positionIterations);

    // Safely destroy bodies queued for deletion
    for (const body of this.destroyQueue) {
      this.world.destroyBody(body);
    }

    // Clear destruction queue
    this.destroyQueue.length = 0;
  }

  /*
  -------------------------------------------------------
  createBoxBody(x, y, type)
  -------------------------------------------------------
  Creates a physics body in the simulation world.

  Parameters:
  x, y → body position
  type → body type ("dynamic" or "static")

  Returns:
  Created Planck.js body object
  -------------------------------------------------------
  */
  createBoxBody(x, y, type = 'dynamic') {
    const body = this.world.createBody({
      type: type === 'static' ? 'static' : 'dynamic',
      position: this.pl.Vec2(x, y)
    });

    return body;
  }

  /*
  -------------------------------------------------------
  destroyBody(body)
  -------------------------------------------------------
  Schedules a physics body for destruction.

  Bodies cannot be removed during the physics step,
  so they are added to a queue and removed afterwards.
  -------------------------------------------------------
  */
  destroyBody(body) {
    this.destroyQueue.push(body);
  }

  /*
  -------------------------------------------------------
  ReturnWorld()
  -------------------------------------------------------
  Returns the physics world instance.

  Useful for accessing the world directly when needed.
  -------------------------------------------------------
  */
  ReturnWorld() {
    return this.world;
  }
}
// Import required engine components
import {Entity} from '../entity/Entity.js';
import {TextButton} from '../ui/TextButton.js';
import {TextureButton} from '../ui/TextureButton.js';

// Conversion factor between physics units and render units
const SCALE = 50;

/*
=========================================================
STATE MANAGER
---------------------------------------------------------
This class manages the entire game state including:
- Entities in the scene
- UI elements
- Input events
- Audio system
- Scene serialization and loading
- Event handling and state transitions
=========================================================
*/

export class StateManager {
  /*
  -------------------------------------------------------
  Constructor
  Initializes the state manager and stores references
  to all major engine systems.
  -------------------------------------------------------
  */
  constructor(
      gravity, cameraPos, simulationWorld, glyphMap, engine, UISystem,
      audiosystem) {
    // List of all physics/render entities
    this.Entities = [];

    // Map for fast lookup of entities using their ID
    this.EntityMap = new Map();

    // UI elements (buttons etc.)
    this.UI = [];

    // Physics gravity settings
    this.gravity = gravity;

    // Camera position
    this.CameraPos = cameraPos;

    // Planck physics world
    this.simulationWorld = simulationWorld;

    // Input handling system
    this.UISystem = UISystem;

    // Font glyph atlas used for text rendering
    this.glyphMap = glyphMap;

    // Rendering engine
    this.Engine = engine;

    // Audio system
    this.audio = audiosystem;

    // Event queue
    this.Events = [];

    // Input event bindings
    this.InputEvents = [];

    // Current scene/state name
    this.gameState = 'Test';
  }

  /* =====================================================
        ENTITY SERIALIZATION
     Converts entities into JSON format so they can be
     saved or exported as scene data
     ===================================================== */

  SerializeEntity(entity) {
    const obj = entity.RenderObject;

    const entityData = {

      // Rendering and transform information
      entity: {
        x: obj.x,
        y: obj.y,
        z: obj.z,
        w: obj.w,
        h: obj.h,

        r: obj.r,
        g: obj.g,
        b: obj.b,
        alpha: obj.alpha,

        slot: obj.slot,

        px: obj.px,
        py: obj.py,

        theta: obj.theta,

        bodytype: entity.bodytype,
        id: entity.ID
      },

      // Physics fixtures
      fixtures: []
    };

    // Save all physics fixtures
    for (let fix of entity.fixtures) {
      entityData.fixtures.push({

        x: fix.x,
        y: fix.y,

        // Convert physics units to render units
        w: fix.w * (SCALE * 2),
        h: fix.h * (SCALE * 2),

        density: fix.density,
        friction: fix.friction,
        restitution: fix.restitution,

        issensor: fix.issensor,
        theta: fix.theta
      });
    }

    return entityData;
  }

  /*
  -------------------------------------------------------
  Serializes all entities in the scene
  -------------------------------------------------------
  */
  SerializeScene(entities) {
    const sceneData = [];

    for (let entity of entities) {
      sceneData.push(this.SerializeEntity(entity));
    }

    return sceneData;
  }


  /*
  -------------------------------------------------------
  Creates a new Entity from saved scene data
  -------------------------------------------------------
  */
  LoadEntity(data) {
    const e = data.entity;

    const entity = new Entity(

        e.x, e.y, e.z, e.w, e.h,

        e.r, e.g, e.b, e.alpha,

        e.slot,

        e.px, e.py, e.theta,

        this.simulationWorld, e.bodytype, e.id);

    // Restore physics fixtures
    for (let f of data.fixtures || []) {
      entity.AddFixture(

          f.x, f.y, f.w, f.h,

          f.density, f.friction, f.restitution,

          f.issensor, f.theta);
    }

    return entity;
  }

  /*
  -------------------------------------------------------
  Serializes button action events
  (used for UI interactions)
  -------------------------------------------------------
  */
  SerializeButtonAction(action) {
    if (!action || !Array.isArray(action.event)) return null;

    return {
      event: action.event.map(
          e => ({
            ...e,

            // Convert loop string to boolean
            loop: e.loop === 'true' ? true :
                e.loop === 'false'  ? false :
                                      e.loop,

            // Ensure volume is numeric
            volume: e.volume !== undefined ? Number(e.volume) : e.volume
          }))
    };
  }

  /*
  -------------------------------------------------------
  Serializes a TextButton UI element
  -------------------------------------------------------
  */
  SerializeTextButton(button) {
    return {

      type: 'TextButton',

      text: button.RenderText.text,

      x: button.x,
      y: button.y,
      z: button.z,

      r: button.r,
      g: button.g,
      b: button.b,

      alpha: button.alpha,

      scale: button.scale,

      slot: button.slot,

      action: this.SerializeButtonAction(button.action)
    };
  }

  /*
  -------------------------------------------------------
  Serializes a TextureButton UI element
  -------------------------------------------------------
  */
  SerializeTextureButton(button) {
    return {

      type: 'TextureButton',

      x: button.x,
      y: button.y,
      z: button.z,

      w: button.w,
      h: button.h,

      r: button.r,
      g: button.g,
      b: button.b,

      alpha: button.alpha,

      slot: button.slot,

      px: button.RenderObject.px,
      py: button.RenderObject.py,

      theta: button.RenderObject.theta,

      action: this.SerializeButtonAction(button.action)
    };
  }

  /*
  -------------------------------------------------------
  Loads audio files defined in scene data
  -------------------------------------------------------
  */
  LoadAudio(data) {
    for (let file of data) {
      this.audio.loadSound(file.id, file.path);
    }
  }

  /*
  -------------------------------------------------------
  Serializes keyboard input event mapping
  -------------------------------------------------------
  */
  SerializeInput(input) {
    return {

      key: input.key,

      condition: input.condition,

      event: input.event.map(
          e => ({
            ...e,

            loop: e.loop === 'true' ? true :
                e.loop === 'false'  ? false :
                                      e.loop,

            volume: e.volume !== undefined ? Number(e.volume) : e.volume
          }))
    };
  }

  /*
  -------------------------------------------------------
  Serializes all input bindings
  -------------------------------------------------------
  */
  SerializeInputEvents() {
    const data = [];

    for (let input of this.InputEvents) {
      data.push(this.SerializeInput(input));
    }

    return data;
  }

  /*
  -------------------------------------------------------
  Serializes all UI elements
  -------------------------------------------------------
  */
  SerializeUI(uiElements) {
    const data = [];

    for (let ui of uiElements) {
      if (ui instanceof TextButton) {
        data.push(this.SerializeTextButton(ui));
      }

      else if (ui instanceof TextureButton) {
        data.push(this.SerializeTextureButton(ui));
      }
    }

    return data;
  }

  /*
  -------------------------------------------------------
  Loads UI elements from scene data
  -------------------------------------------------------
  */
  LoadUI(data) {
    for (let ui of (data || [])) {
      const action =
          ui.action && Array.isArray(ui.action.event) ? ui.action : null;

      if (ui.type === 'TextButton') {
        this.UI.push(new TextButton(

            ui.text, ui.x, ui.y, ui.z,

            ui.r, ui.g, ui.b,

            ui.alpha,

            ui.scale,

            ui.slot,

            this.glyphMap,

            action));
      }

      else if (ui.type === 'TextureButton') {
        this.UI.push(new TextureButton(

            ui.x, ui.y, ui.z,

            ui.w, ui.h,

            ui.r, ui.g, ui.b,

            ui.alpha,

            ui.slot,

            ui.px, ui.py,

            ui.theta,

            action));
      }
    }
  }

  /*
  -------------------------------------------------------
  Synchronizes loaded entities and UI with the renderer
  -------------------------------------------------------
  */
  SyncEngine() {
    this.Engine.sceneObjects.length = 0;
    this.Engine.TextObjects.length = 0;

    for (let e of this.Entities) {
      this.Engine.AddObject(e.RenderObject);
    }

    for (let ui of this.UI) {
      if (ui instanceof TextButton) {
        this.Engine.AddText(ui.RenderText);

      } else if (ui instanceof TextureButton) {
        this.Engine.AddObject(ui.RenderObject);
      }
    }
  }

  /*
  -------------------------------------------------------
  Loads input bindings
  -------------------------------------------------------
  */
  LoadInputEvents(inputs) {
    if (!Array.isArray(inputs)) {
      this.InputEvents = [];
      return;
    }

    this.InputEvents = inputs;
  }

  /*
  Adds a new input binding
  */
  AddInputEvent(inputevent) {
    this.InputEvents.push(inputevent);

    console.log(inputevent);
  }

  /*
  -------------------------------------------------------
  Changes the current game state/scene
  -------------------------------------------------------
  */
  ChangeState() {
    for (let entity of this.Entities) {
      entity.RemoveAllFixtures();

      if (entity.body) this.simulationWorld.destroyBody(entity.body);
    }

    this.reset();

    this.EntityMap.clear();

    this.LoadfromLocal(this.gameState);
  }

  /*
  -------------------------------------------------------
  Serializes audio files
  -------------------------------------------------------
  */
  SerializeAudio() {
    const data = [];

    for (let name in this.audio.soundspath) {
      data.push({id: name, path: this.audio.soundspath[name]});
    }

    return data;
  }

  /*
  -------------------------------------------------------
  Saves entire game scene into local storage
  -------------------------------------------------------
  */
  SaveGameData(sceneName) {
    const gameScene = {

      metadata: {

        name: sceneName,

        version: 1,

        engine: 'TapTap'
      },

      physics: this.gravity,

      camera: this.CameraPos,

      entities: this.SerializeScene(this.Entities),

      ui: this.SerializeUI(this.UI),

      input: this.SerializeInputEvents(),

      audio: this.SerializeAudio()
    };

    const json = JSON.stringify(gameScene, null, 2);

    localStorage.setItem(sceneName, json);
  }

  /*
  -------------------------------------------------------
  Loads a scene from JSON data
  -------------------------------------------------------
  */
  LoadScene(data) {
    if (data.metadata?.version !== 1) {
      console.warn('Scene version mismatch');
    }

    this.gravity = data.physics;

    this.CameraPos = data.camera;

    for (let e of data.entities || []) {
      const entity = this.LoadEntity(e);

      this.AddEntity(entity);
    }

    this.LoadInputEvents(data.input);

    this.LoadUI(data.ui);

    this.LoadAudio(data.audio);

    this.SyncEngine();
  }

  /*
  -------------------------------------------------------
  Loads scene JSON from disk using fetch
  -------------------------------------------------------
  */
  async LoadfomDisk(path) {
    path = path + '.json';

    const res = await fetch(path);

    const data = await res.json();

    localStorage.setItem(data.metadata.name, JSON.stringify(data));

    this.LoadScene(data);
  }

  /*
  Loads scene stored in browser localStorage
  */
  LoadfromLocal(sceneName) {
    const json = localStorage.getItem(sceneName);

    if (!json) return;

    const data = JSON.parse(json);

    stateManager.LoadScene(data);
  }

  /*
  Adds a new event to the event queue
  */
  AddEvent(event) {
    this.Events.push(event);
  }

  /*
  Removes an entity from the scene
  */
  RemoveEntity(entity) {
    const index = this.Entities.indexOf(entity);

    entity.DeleteEntity();

    if (index !== -1) {
      this.Entities.splice(index, 1);
    }

    this.Engine.RemoveObj(entity.RenderObject);
  }

  /*
  -------------------------------------------------------
  Exports scene to JSON file for download
  -------------------------------------------------------
  */
  SaveToDisk(sceneName) {
    const scene = {
      metadata: {name: sceneName, version: 1},

      physics: this.gravity,
      camera: this.CameraPos,

      entities: this.SerializeScene(this.Entities),
      ui: this.SerializeUI(this.UI),
      input: this.SerializeInputEvents(),
      audio: this.SerializeAudio()
    };

    const json = JSON.stringify(scene, null, 2);

    const blob = new Blob([json], {type: 'application/json'});

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = sceneName + '.json';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  /*
  -------------------------------------------------------
  Handles all gameplay events
  (physics, camera, state changes, audio etc.)
  -------------------------------------------------------
  */
  HandleEvent(event) {
    const e = event.entityID ? this.EntityMap.get(event.entityID) : null;

    switch (event.type) {
      case 'MOVE_ENTITY':

        if (!e) return;

        const pos = e.body.getPosition();

        e.body.setTransform(
            planck.Vec2(event.dx + pos.x, event.dy + pos.y), e.body.getAngle());

        break;

      case 'SET_ENTITY_POS':

        if (!e) return;

        e.body.setTransform(
            this.simulationWorld.pl.Vec2(event.x, event.y), e.body.getAngle());

        break;

      case 'ROT_ENTITY':

        if (!e) return;

        e.body.setTransform(e.body.getPosition(), event.theta);

        break;

      case 'DESTROY_ENTITY':

        if (!e) return;

        this.RemoveEntity(e);

        break;

      case 'APPLY_FORCE':

        if (!e) return;

        e.body.applyForceToCenter(
            this.Simulation.pl.Vec2(event.fx, event.fy), true);

        break;

      case 'APPLY_IMP':

        if (!e) return;

        e.body.applyLinearImpulse(
            this.Simulation.pl.Vec2(event.xImp, event.yImp),
            e.body.getWorldCenter(), true);

        break;

      case 'SET_VELOCITY':

        if (!e) return;

        e.body.setLinearVelocity(this.Simulation.pl.Vec2(event.vx, event.vy));

        break;

      case 'SET_CAMERA_POSITION':

        this.Engine.CameraPos = [event.x, event.y, event.z];

        break;

      case 'MOVE_CAMERA':

        this.Engine.CameraPos[0] += event.x;
        this.Engine.CameraPos[1] += event.y;
        this.Engine.CameraPos[2] += event.z;

        break;

      case 'CHANGE_STATE':

        this.gameState = event.state;

        this.ChangeState();

        break;

      case 'LOAD_SCENE':

        this.LoadScene(event.scene);

        break;

      case 'PLAY_AUDIO':

        this.audio.playSound(event.audio, event.loop, event.volume);

        break;
    }
  }

  /*
  -------------------------------------------------------
  Main update loop for the StateManager
  Handles entities, UI and input events
  -------------------------------------------------------
  */
  update(mx, my, click) {
    // Update entities
    for (let e of this.Entities) {
      e.update();
    }

    // Update UI elements
    for (let ui of this.UI) {
      ui.update(mx, my, click);

      // If button clicked trigger its events
      if (ui.MouseClicked && ui.action && Array.isArray(ui.action.event)) {
        for (let e of ui.action.event) {
          this.AddEvent(e);
        }
      }
    }

    // Process input bindings
    for (let input of (this.InputEvents || null)) {
      let triggered = false;

      if (input.condition === 'pressed' && this.UISystem.isPressed(input.key))
        triggered = true;

      if (input.condition === 'hold' && this.UISystem.isDown(input.key))
        triggered = true;

      if (input.condition === 'released' && this.UISystem.isReleased(input.key))
        triggered = true;

      if (triggered) {
        for (let e of input.event) {
          this.AddEvent(e);
        }
      }
    }

    // Execute queued events
    for (let event of this.Events) {
      this.HandleEvent(event);
    }

    // Clear event queue
    this.Events = [];
  }

  /*
  Resets scene data completely
  */
  reset() {
    for (let entity of this.Entities) {
      entity.RemoveAllFixtures();

      if (entity.body) this.simulationWorld.destroyBody(entity.body);
    }

    this.Entities = [];
    this.UI = [];
    this.InputEvents = [];

    this.audio.sounds = {};
    this.audio.soundspath = {};
  }

  /*
  Adds entity to the scene and map
  */
  AddEntity(entity) {
    this.Entities.push(entity);

    this.EntityMap.set(entity.ID, entity);
  }

  /*
  Adds UI element
  */
  AddUI(UI) {
    this.UI.push(UI);
  }
}
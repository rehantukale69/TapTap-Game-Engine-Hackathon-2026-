
import {Entity} from '../entity/Entity.js';
import {TextButton} from '../ui/TextButton.js';
import {TextureButton} from '../ui/TextureButton.js';

const SCALE = 50;

export class StateManager {
  constructor(gravity, cameraPos, simulationWorld, glyphMap, engine, UISystem) {
    this.Entities = [];
    this.EntityMap = new Map();
    this.UI = [];

    this.gravity = gravity;
    this.CameraPos = cameraPos;

    this.simulationWorld = simulationWorld;
    this.UISystem = UISystem;
    this.glyphMap = glyphMap;
    this.Engine = engine;

    this.Events = [];

    this.InputEvents = [];
    this.gameState = 'Test';
  }

  /* =========================
        ENTITY SERIALIZATION
     ========================= */

  SerializeEntity(entity) {
    const obj = entity.RenderObject;

    const entityData = {

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

      fixtures: []

    };

    for (let fix of entity.fixtures) {
      entityData.fixtures.push({

        x: fix.x,
        y: fix.y,
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


  SerializeScene(entities) {
    const sceneData = [];

    for (let entity of entities) {
      sceneData.push(this.SerializeEntity(entity));
    }

    return sceneData;
  }



  LoadEntity(data) {
    const e = data.entity;

    const entity = new Entity(

        e.x, e.y, e.z, e.w, e.h,

        e.r, e.g, e.b, e.alpha,

        e.slot,

        e.px, e.py, e.theta,

        this.simulationWorld, e.bodytype, e.id

    );

    for (let f of data.fixtures || []) {
      entity.AddFixture(

          f.x, f.y, f.w, f.h,

          f.density, f.friction, f.restitution,

          f.issensor, f.theta

      );
    }

    return entity;
  }



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
      action: button.action || null

    };
  }


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
      action: button.action || null

    };
  }

  SerializeInput(input) {
    return {key: input.key, event: input.event || null};
  }

  SerializeInputEvents() {
    const data = [];
    for (let input of this.InputEvents) {
      data.push(this.SerializeInput(input));
    }

    return data;
  }


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



  LoadUI(data) {
    for (let ui of data || []) {
      if (ui.type === 'TextButton') {
        this.UI.push(

            new TextButton(

                ui.text, ui.x, ui.y, ui.z,

                ui.r, ui.g, ui.b,

                ui.alpha,

                ui.scale,

                ui.slot,

                this.glyphMap,

                ui.action

                )

        );

      }

      else if (ui.type === 'TextureButton') {
        this.UI.push(

            new TextureButton(

                ui.x, ui.y, ui.z,

                ui.w, ui.h,

                ui.r, ui.g, ui.b,

                ui.alpha,

                ui.slot,

                ui.px, ui.py,

                ui.theta, ui.action

                )

        );
      }
    }
  }



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

  LoadInputEvents(inputs) {
    this.InputEvents = [];
    for (let input of inputs || []) {
      this.InputEvents.push(input);
    }
  }

  AddInputEvent(inputevent) {
    this.InputEvents.push(inputevent);
    console.log(inputevent);
  }

  ChangeState() {
    for (let entity of this.Entities) {
      entity.RemoveAllFixtures();

      if (entity.body) this.simulationWorld.destroyBody(entity.body);
    }

    this.InputEvents = [];
    this.UI = [];
    this.Entities = [];

    this.EntityMap.clear();
    this.LoadfromLocal(this.gameState);
  }



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

      input: this.SerializeInputEvents()
    };

    const json = JSON.stringify(gameScene, null, 2);

    localStorage.setItem(sceneName, json);
  }



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

    this.SyncEngine();
  }

  async LoadfomDisk(path) {
    const res = await fetch(path);
    const data = await res.json();

    localStorage.setItem(data.metadata.name, JSON.stringify(data));

    this.LoadScene(data);
  }

  LoadfromLocal(sceneName) {
    const json = localStorage.getItem(sceneName);

    if (!json) return;

    const data = JSON.parse(json);

    stateManager.LoadScene(data);
  }



  AddEvent(event) {
    this.Events.push(event);
  }

  RemoveEntity(entity) {
    const index = this.Entities.indexOf(entity);

    entity.DeleteEntity();

    if (index !== -1) {
      this.Entities.splice(index, 1);
    }
    this.Engine.RemoveObj(entity.RenderObject);
  }

  SaveToDisk(sceneName) {
    const scene = {
      metadata: {name: sceneName, version: 1},

      physics: this.gravity,
      camera: this.CameraPos,

      entities: this.SerializeScene(this.Entities),
      ui: this.SerializeUI(this.UI),
      input: this.SerializeInputEvents()
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
    }
  }

  update(mx, my, click) {
    for (let e of this.Entities) {
      // console.log(e.ID);
      e.update();
    }

    for (let ui of this.UI) {
      ui.update(mx, my, click);

      if (ui.MouseClicked) {
        this.AddEvent(ui.action);
      }
    }

    for (let input of this.InputEvents) {
      if (this.UISystem.isDown(input.key)) {
        this.AddEvent(input.event);
      }
    }



    for (let event of this.Events) {
      this.HandleEvent(event);
    }


    this.Events = [];
  }



  AddEntity(entity) {
    this.Entities.push(entity);
    this.EntityMap.set(entity.ID, entity);
  }

  AddUI(UI) {
    this.UI.push(UI);
  }
}
import {Entity} from '../entity/Entity.js';
import {TextButton} from '../ui/TextButton.js';
import {TextureButton} from '../ui/TextureButton.js';

const SCALE = 50;

export class StateManager {
  constructor(gravity, cameraPos, simulationWorld, glyphMap, engine) {
    this.Entities = [];
    this.EntityMap = new Map();
    this.UI = [];

    this.gravity = gravity;
    this.CameraPos = cameraPos;

    this.simulationWorld = simulationWorld;
    this.glyphMap = glyphMap;
    this.Engine = engine;

    this.Events = [];
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

        bodytype: entity.bodytype
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

        this.simulationWorld, e.bodytype

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

      slot: button.slot

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

      theta: button.RenderObject.theta

    };
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
    const uiElements = [];

    for (let ui of data || []) {
      if (ui.type === 'TextButton') {
        uiElements.push(

            new TextButton(

                ui.text, ui.x, ui.y, ui.z,

                ui.r, ui.g, ui.b,

                ui.alpha,

                ui.scale,

                ui.slot,

                this.glyphMap

                )

        );

      }

      else if (ui.type === 'TextureButton') {
        uiElements.push(

            new TextureButton(

                ui.x, ui.y, ui.z,

                ui.w, ui.h,

                ui.r, ui.g, ui.b,

                ui.alpha,

                ui.slot,

                ui.px, ui.py,

                ui.theta

                )

        );
      }
    }

    return uiElements;
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

      ui: this.SerializeUI(this.UI)

    };

    const json = JSON.stringify(gameScene, null, 2);

    localStorage.setItem(sceneName, json);
  }



  LoadGameData(sceneName) {
    const json = localStorage.getItem(sceneName);

    if (!json) {
      console.warn('Scene not found:', sceneName);

      return;
    }

    const data = JSON.parse(json);


    if (data.metadata?.version !== 1) {
      console.warn('Scene version mismatch');
    }


    this.gravity = data.physics;

    this.CameraPos = data.camera;



    for (let entity of this.Entities) {
      entity.RemoveAllFixtures();

      this.simulationWorld.destroyBody(entity.body);
    }



    this.Entities = [];

    for (let e of data.entities || []) {
      this.Entities.push(this.LoadEntity(e));
    }



    this.UI = this.LoadUI(data.ui);
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

  AddEvent(event) {
    this.Events.push(event);
  }

  Handlevent(event) {
    switch (event.type) {
      case 'MOVE_ENTITY':
        const e = this.EntityMap.get(event.entityID);

        e.RenderObject.x += event.dx;
        e.RenderObject.y += event.dy;
        break;


      case 'CHANGE_STATE':
        this.gameState = event.state;
        break;


      case 'LOAD_SCENE':
        this.LoadGameData(event.scene);
        this.SyncEngine();
        break;
    }
  }

  update() {
    for (let e of this.Entities) {
      e.update();
      console.log(e);
    }

    for (let event of this.Events) {
      this.Handlevent(event);
    }
  }



  AddEntity(entity) {
    this.Entities.push(entity);
    this.EntityMap.set(entity.ID, entity);
  }

  AddUI(UI) {
    this.UI.push(UI);
  }
}
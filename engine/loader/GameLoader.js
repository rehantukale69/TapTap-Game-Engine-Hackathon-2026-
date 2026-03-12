
import {Entity} from '../entity/Entity.js';
import {TextButton} from '../ui/TextButton.js';
import {TextureButton} from '../ui/TextureButton.js';
const SCALE = 50;

export class GameLoader {
  constructor(gravity, cameraPos, simulationWorld, glyphMap, engine) {
    this.gravity = gravity;
    this.CameraPos = cameraPos;

    this.simulationWorld = simulationWorld;
    this.glyphMap = glyphMap;
    this.Engine = engine
  }



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


  /* =========================
        ENTITY LOADING
     ========================= */

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


  /* =========================
        UI SERIALIZATION
     ========================= */

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


  /* =========================
        UI LOADING
     ========================= */

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



  /* =========================
        SAVE SCENE
     ========================= */

  SaveGameData(sceneName, entities, ui) {
    const gameScene = {

      metadata: {

        name: sceneName,

        version: 1,

        engine: 'TapTap'

      },

      physics: this.gravity,

      camera: this.CameraPos,

      entities: this.SerializeScene(entities),

      ui: this.SerializeUI(ui)

    };

    const json = JSON.stringify(gameScene, null, 2);

    localStorage.setItem(sceneName, json);
  }


  /* =========================
        LOAD SCENE
     ========================= */

  LoadGameData(sceneName, entities, ui) {
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


    /* ---- clear old physics bodies ---- */

    for (let entity of entities) {
      entity.RemoveAllFixtures();

      this.simulationWorld.destroyBody(entity.body);
    }


    /* ---- load entities ---- */

    entities = [];

    for (let e of data.entities || []) {
      entities.push(this.LoadEntity(e));
    }


    /* ---- load UI ---- */

    ui = this.LoadUI(data.ui);
  }
}
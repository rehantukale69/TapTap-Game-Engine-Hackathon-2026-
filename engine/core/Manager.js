import * as glMatrix from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';

import {AudioSystem} from '../audio/AudioSystem.js';
import {Entity} from '../entity/Entity.js';
import {Object} from '../renderer/Object.js';
import {Renderer} from '../renderer/Renderer.js';
import {Text} from '../renderer/Text.js';
import {Simulation} from '../simulation/Simultation.js';
import {StateManager} from '../state/GameStateManager.js';
import {TextButton} from '../ui/TextButton.js'
import {TextureButton} from '../ui/TextureButton.js';
import {UISystem} from '../ui/UISystem.js';

export class Manager {
  constructor(VertexShaderData, FragmentShaderData, gravity = [0, -10]) {
    this.VertexShaderData = VertexShaderData;
    this.FragmentShaderData = FragmentShaderData;
    this.Render = this.Render.bind(this);
    this.gravity = gravity;
    this.fixedDT = 1 / 60;
  };
  InitializeRenderer() {
    this.Engine = new Renderer();
    this.Engine.CreateBasicShaders(
        this.VertexShaderData, this.FragmentShaderData);
    this.Engine.CreateBasicBuffer();


    this.Engine.InitializeTextures();
    this.Engine.InitializeFont();

    /* this.Engine.LoadTexture('../../Resources/1.png', 1);
     this.Engine.LoadTexture('../../Resources/2.png', 2);
     this.Engine.LoadTexture('../../Resources/3.png', 3);



     /* this.Shot = new TextButton(
          'Kya Bolti Public', 0, 0, -400, 1.0, 1.0, 1.0, 1.0, 0.3, 0,
          this.Engine.glyphMap, {
            event: [
              {type: 'MOVE_ENTITY', entityID: 'Player', dx: 0.05, dy: 0},
              {type: 'PLAY_AUDIO', audio: 'bgm', loop: 'false', volume: '0.75'}
            ]
          });


      this.Engine.AddText(this.Shot.RenderText);

      this.d = new TextureButton(
          0, 0, -400, 200, 200, 1.0, 1.0, 1.0, 1.0, 1.0, 0, 0, 0);
      // this.Engine.AddObject(this.d.RenderObject); */
  };

  InitializeUISystem() {
    this.UI = new UISystem(this.Engine.glcanvas);
  };
  InitializeSImultaion() {
    this.Simulation = new Simulation(this.gravity);
    this.World = this.Simulation.ReturnWorld();


    /*this.Entity1 = new Entity(
        0, 0, -400, 50, 50, 1.0, 1.0, 1.0, 1.0, 1.0, 0, 0, 0, this.Simulation,
        'dynamic', 'Player');
    console.log(this.Entity1.AddFixture(0, 0, 50, 50, 1, 1, 1, false, 0.0));
    this.Engine.AddObject(this.Entity1.RenderObject);

    this.Entity2 = new Entity(
        0, -100, -400, 50, 50, 1.0, 1.0, 1.0, 1.0, 1.0, 0, 0, 0,
        this.Simulation, 'static', 'Ground');
    console.log(this.Entity2.AddFixture(0, 0, 50, 50, 1, 1, 1, false, 0.0));
    this.Engine.AddObject(this.Entity2.RenderObject); */
  };

  InitializeSoundSystem() {
    this.audio = new AudioSystem();
  }

  InitializeStateManager() {
    this.StateManager = new StateManager(
        this.gravity, this.Engine.ReturnCameraPos(), this.Simulation,
        this.Engine.glyphMap, this.Engine, this.UI, this.audio);

    this.StateManager.SyncEngine();

    this.StateManager.reset();
    this.StateManager.LoadfomDisk('../../scenes/menu');
    this.StateManager.SyncEngine();
  }
  update() {};
  Render() {
    this.Engine.update();

    this.UI.update();
    let pos = this.UI.getMousePos();



    this.Simulation.step(this.fixedDT);

    /* if (this.UI.isPressed('KeyA')) {
       this.StateManager.reset();
       this.StateManager.LoadfomDisk('../../scenes/menu');
       this.StateManager.SyncEngine();
     }

     /*if (this.UI.isPressed('KeyB')) {
       this.StateManager.SaveToDisk('scene1');
     } */



    this.StateManager.update(pos.x, pos.y, this.UI.mousePressed);

    this.UI.endFrame();



    this.Engine.Render();
    requestAnimationFrame(this.Render);
  };
}
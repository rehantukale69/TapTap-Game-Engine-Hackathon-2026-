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
  };

  InitializeUISystem() {
    this.UI = new UISystem(this.Engine.glcanvas);
  };
  InitializeSImultaion() {
    this.Simulation = new Simulation(this.gravity);
    this.World = this.Simulation.ReturnWorld();
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

    this.StateManager.update(pos.x, pos.y, this.UI.mousePressed);

    this.UI.endFrame();


    this.Engine.Render();
    requestAnimationFrame(this.Render);
  };
}
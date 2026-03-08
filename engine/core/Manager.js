import * as glMatrix from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';

import {Object} from '../renderer/Object.js';
import {Renderer} from '../renderer/Renderer.js';
import {Text} from '../renderer/Text.js';
import {TextButton} from '../ui/TextButton.js'
import {TextureButton} from '../ui/TextureButton.js';
import {UISystem} from '../ui/UISystem.js';

export class Manager {
  constructor(VertexShaderData, FragmentShaderData) {
    this.VertexShaderData = VertexShaderData;
    this.FragmentShaderData = FragmentShaderData;
    this.Render = this.Render.bind(this);
  };
  InitializeRenderer() {
    this.Engine = new Renderer();
    this.Engine.CreateBasicShaders(
        this.VertexShaderData, this.FragmentShaderData);
    this.Engine.CreateBasicBuffer();


    this.Engine.InitializeTextures();
    this.Engine.InitializeFont();
    this.Engine.LoadTexture('../../Resources/1.png', 1);
    this.Engine.LoadTexture('../../Resources/2.png', 2);


    /*this.Shot = new TextButton(
        'Kya Bolti Public', 0, 0, -400, 1.0, 1.0, 1.0, 1.0, 0.3, 0,
        this.Engine.glyphMap);


    this.Engine.AddUI(this.Shot); */

    this.d = new TextureButton(
        0, 0, -400, 200, 200, 1.0, 1.0, 1.0, 1.0, 1.0, 0, 0, 0);
    this.Engine.AddObject(this.d.RenderObject);
  };

  InitializeUISystem() {
    this.UI = new UISystem(this.Engine.glcanvas);
  };
  InitializeSImultaion() {};
  update() {};
  Render() {
    this.Engine.update();

    let pos = this.UI.getMousePos();

    if (this.d.MouseClicked(pos.x, pos.y) && this.UI.mouseClicked) {
      console.log('CHod diya');
    }

    /*

    if (this.Shot.MouseClicked(pos.x, pos.y) && this.UI.mouseClicked) {
      console.log('HO Gya diya');
    } */


    this.UI.update();

    this.Engine.Render();
    requestAnimationFrame(this.Render);
  };
}
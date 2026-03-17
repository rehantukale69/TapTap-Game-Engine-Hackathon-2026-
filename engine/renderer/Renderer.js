import * as glMatrix from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';

import {Shader} from './Shader.js';


const NumberofVertices = 10000;
const NumberofTextures = 32;

export class Renderer {
  constructor() {
    this.mat4 = glMatrix.mat4;
    console.log('mat4 =', this.mat4);

    this.glcanvas = document.getElementById('glcanvas');

    let gl2 = this.glcanvas.getContext('webgl2');
    let gl1 = this.glcanvas.getContext('webgl');

    this.gl = gl2 || gl1;
    if (!this.gl) throw new Error('WebGL not supported');

    this.BasicShader = null;
    this.VAO = null;
    this.IBO = null;
    this.VBO = null;

    this.Vertices = [];
    this.Indices = [];
    this.POV = 45;
    this.VerticesCount = 0;
    this.IndicesCount = 0;
    this.TextureCount = 0;

    this.Textures = null;

    this.Render = this.Render.bind(this);
    this.AddVertexData = this.AddVertexData.bind(this);
    this.AddIndexData = this.AddIndexData.bind(this);

    this.sceneObjects = [];
    this.TextObjects = [];

    this.TextureMap = {};
    this.TexturePaths = {};
    this.TextureSizes = {};
    this.TextureReverse = new Map();


    this.CameraPos = [0, 0, 0];
  }

  CreateBasicShaders(VertexData, FragmentData) {
    this.BasicShader = new Shader(VertexData, FragmentData);
    this.BasicShader.Initialize();

    this.gl.viewport(0, 0, this.glcanvas.width, this.glcanvas.height);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }

  CreateBasicBuffer() {
    this.VAO = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.VAO);

    this.VBO = this.gl.createBuffer();
    const VerticesTyped = new Float32Array(this.Vertices);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
    this.gl.bufferData(
        this.gl.ARRAY_BUFFER, VerticesTyped, this.gl.DYNAMIC_DRAW);

    this.IBO = this.gl.createBuffer();
    const IndicesTyped = new Uint16Array(this.Indices);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IBO);
    this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER, IndicesTyped, this.gl.STATIC_DRAW);

    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 15 * 4, 0);
    this.gl.enableVertexAttribArray(0);

    this.gl.vertexAttribPointer(1, 4, this.gl.FLOAT, false, 15 * 4, 3 * 4);
    this.gl.enableVertexAttribArray(1);

    this.gl.vertexAttribPointer(2, 1, this.gl.FLOAT, false, 15 * 4, 7 * 4);
    this.gl.enableVertexAttribArray(2);

    this.gl.vertexAttribPointer(3, 2, this.gl.FLOAT, false, 15 * 4, 8 * 4);
    this.gl.enableVertexAttribArray(3);

    this.gl.vertexAttribPointer(4, 1, this.gl.FLOAT, false, 15 * 4, 10 * 4);
    this.gl.enableVertexAttribArray(4);

    this.gl.vertexAttribPointer(5, 2, this.gl.FLOAT, false, 15 * 4, 11 * 4);
    this.gl.enableVertexAttribArray(5);

    this.gl.vertexAttribPointer(6, 2, this.gl.FLOAT, false, 15 * 4, 13 * 4);
    this.gl.enableVertexAttribArray(6);


    let ProjectionMatrix = this.mat4.create();
    this.mat4.perspective(
        ProjectionMatrix, (this.POV * Math.PI) / 180,
        this.glcanvas.width / this.glcanvas.height, 0.1, 1000);

    let ProjectionMatrixLocation = this.gl.getUniformLocation(
        this.BasicShader.GetShaderProgram(), 'Projection');

    this.gl.uniformMatrix4fv(ProjectionMatrixLocation, false, ProjectionMatrix);
  }


  AddIndexData() {
    let base = this.VerticesCount;

    this.Indices.push(base + 0);
    this.Indices.push(base + 1);
    this.Indices.push(base + 2);
    this.Indices.push(base + 2);
    this.Indices.push(base + 3);
    this.Indices.push(base + 0);

    this.VerticesCount += 4;
    this.IndicesCount += 6;
  }

  AddVertexData(Vertexes) {
    let count = 0;
    for (let v of Vertexes) {
      this.Vertices.push(
          v.Location[0], v.Location[1], v.Location[2], v.Color[0], v.Color[1],
          v.Color[2], v.Color[3], v.Slot, v.TextureCoordinates[0],
          v.TextureCoordinates[1], v.theta, v.Pivot[0], v.Pivot[1], v.Offset[0],
          v.Offset[1]);

      count++;
    }

    for (let i = 0; i < count / 4; ++i) {
      this.AddIndexData();
    }
  }



  InitializeFont() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1960;
    this.canvas.height = 1960;

    this.ctx = this.canvas.getContext('2d');

    // transparent background
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '128px MyFont';
    this.ctx.textBaseline = 'alphabetic';

    let chars = '';

    for (let i = 32; i <= 126; i++) {
      chars += String.fromCharCode(i);
    }

    let x = 0;
    let y = 0;
    let padding = 8;

    this.glyphMap = {};

    for (let char of chars) {
      const metrics = this.ctx.measureText(char);

      const left = metrics.actualBoundingBoxLeft;
      const right = metrics.actualBoundingBoxRight;
      const ascent = metrics.actualBoundingBoxAscent;
      const descent = metrics.actualBoundingBoxDescent;

      const w = Math.ceil(left + right);
      const h = Math.ceil(ascent + descent);

      // new row if needed
      if (x + w + padding > this.canvas.width) {
        x = 0;
        y += h + padding;
      }

      // draw glyph with proper offset
      const drawX = x + left;
      const drawY = y + ascent;

      this.ctx.fillText(char, drawX, drawY);

      // compute UVs
      const u0 = x / this.canvas.width;
      const v0 = 1 - (y / this.canvas.height);
      const u1 = (x + w) / this.canvas.width;
      const v1 = 1 - ((y + h) / this.canvas.height);

      this.glyphMap[char] =
          {u0, v0, u1, v1, width: w, height: h, advance: metrics.width};

      x += w + padding;
    }

    // upload atlas
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.Textures);

    this.gl.texSubImage3D(
        this.gl.TEXTURE_2D_ARRAY, 0, 0, 0, 0, this.canvas.width,
        this.canvas.height, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
        this.canvas);

    const loc = this.gl.getUniformLocation(
        this.BasicShader.GetShaderProgram(), 'Textures');

    this.gl.uniform1i(loc, 0);
  }

  InitializeTextures() {
    this.Textures = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.Textures);

    // allocate empty storage for N layers
    this.gl.texStorage3D(
        this.gl.TEXTURE_2D_ARRAY,
        1,  // number of mipmap levels (use >1 if using mipmaps)
        this.gl.RGBA8, 1960, 1960, NumberofTextures);

    this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE);

    this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE);

    this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(
        this.gl.TEXTURE_2D_ARRAY, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);


    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.Textures);

    let TextureLoc = this.gl.getUniformLocation(
        this.BasicShader.GetShaderProgram(), 'Textures');

    this.gl.uniform1i(TextureLoc, 0);
  }

  LoadTexture(name, Path, depth) {
    return new Promise((resolve) => {
      if (depth == null) depth = this.TextureCount;

      this.TextureMap[name] = depth;
      this.TexturePaths[name] = Path;

      this.TextureReverse.set(depth, name);

      if (depth >= NumberofTextures) {
        console.error('Texture array full!');
        return;
      }

      const img = new Image();
      img.src = Path;

      img.onload = () => {
        this.TextureSizes[name] = {w: img.width, h: img.height};

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.Textures);

        if (img.width > 1960 || img.height > 1960) {
          img.width = 1960;
          img.height = 1960;
        }

        this.gl.texSubImage3D(
            this.gl.TEXTURE_2D_ARRAY, 0, 0, 0, depth, img.width, img.height, 1,
            this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);

        resolve();
      };

      this.TextureCount++;
    });
  }



  update() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }


  Render() {
    for (let obj of this.sceneObjects) {
      obj.update();
      this.AddVertexData(obj.Vertexes);
    }

    for (let text of this.TextObjects) {
      text.update();
      this.AddVertexData(text.Vertexes);
      text.clear();
    }


    this.gl.bindVertexArray(this.VAO);

    const IndicesTyped = new Uint16Array(this.Indices);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IBO);
    this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER, IndicesTyped, this.gl.STATIC_DRAW);

    const VerticesTyped = new Float32Array(this.Vertices);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
    this.gl.bufferData(
        this.gl.ARRAY_BUFFER, VerticesTyped, this.gl.DYNAMIC_DRAW);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.Textures);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.IBO);

    this.BasicShader.UseProgram();

    this.gl.drawElements(
        this.gl.TRIANGLES, this.IndicesCount, this.gl.UNSIGNED_SHORT, 0);



    this.VerticesCount = 0;
    this.IndicesCount = 0;
    this.IndicesCount = 0;
    this.Vertices = [];
    this.Indices = [];
  }

  AddObject(obj) {
    this.sceneObjects.push(obj);
  }

  AddText(texts) {
    this.TextObjects.push(texts);
    console.log('Adding text:', texts);
  };

  reset() {
    this.TextureCount = 0;
    this.TextureMap = {};
    this.TexturePaths = {};
    this.TextureReverse = new Map();
    this.TextureSizes = {};
  }

  RemoveObj(Obj) {
    const index = this.sceneObjects.indexOf(Obj);

    if (index !== -1) {
      this.sceneObjects.splice(index, 1);
    }
  }

  RemoveText(text) {
    const index = this.TextObjects.indexOf(text);

    if (index !== -1) {
      this.TextObjects.splice(index, 1);
    }
  }

  ReturnCameraPos() {
    return this.CameraPos
  }
}
import * as glMatrix from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';

import {Manager} from './Manager.js';


const {mat4, vec3, vec2, mat3} = glMatrix;
console.log('mat4 =', mat4);

const glcanvas = document.getElementById('glcanvas');
const gl = glcanvas.getContext('webgl2');
const NumberofVertices = 10000;
const NumberofTextures = 1;

let x = 0;
let n = 0;
let Vertices = [];
let Indices = [];

let Textures;

if (!gl) {
  alert('WebGL not supported');
}

const VertexShaderData = `#version 300 es
precision mediump float;
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec4 color;
layout (location = 2) in float slot;
layout (location = 3) in vec2 texturecoordinates;
layout (location = 4) in float theta;
layout (location = 5) in vec2 pivot;
layout (location = 6) in vec2 offset;

out vec4 Color;
out float Slot;
out vec2 TextureCoordinates;
uniform mat4 Projection;

void main()
{ 
    float c = cos(theta);
    float s = sin(theta);

    mat2 R = mat2(
    c, -s,
    s,  c
    );

    vec2 rotated = R * (offset - pivot);
    vec2 finalPos = aPos.xy + pivot + rotated;

    gl_Position = Projection* vec4(finalPos, aPos.z, 1.0);
    Color = color;
    Slot = slot;
    TextureCoordinates = texturecoordinates;        
}`;

const FragmentShaderData = `#version 300 es
precision mediump float;
precision mediump sampler2DArray;
in vec4 Color;
in float Slot;
uniform sampler2DArray Textures;
in vec2 TextureCoordinates;
out vec4 fragColor;
void main(){ 
 vec4 TexData = texture(Textures, vec3(TextureCoordinates, Slot));
fragColor = TexData * Color; }
`;

window.onload = () => {
  let system = new Manager(VertexShaderData, FragmentShaderData);

  system.InitializeRenderer();
  system.InitializeSImultaion();
  system.InitializeUISystem();
  system.InitializeStateManager();


  system.Render();
};

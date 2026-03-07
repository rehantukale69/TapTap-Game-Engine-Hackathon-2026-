const glcanvas = document.getElementById('glcanvas');
const gl = glcanvas.getContext('webgl2');

export class Shader {
  constructor(VertexShaderData, FragmentShaderData) {
    this.VertexShaderData = VertexShaderData;
    this.FragmentShaderData = FragmentShaderData;
    this.ShaderProgram = null;
  }

  Initialize() {
    let VertexShader = gl.createShader(gl.VERTEX_SHADER);
    let FragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    this.ShaderProgram = gl.createProgram();

    gl.shaderSource(VertexShader, this.VertexShaderData);
    gl.compileShader(VertexShader);

    gl.shaderSource(FragmentShader, this.FragmentShaderData);
    gl.compileShader(FragmentShader);

    gl.attachShader(this.ShaderProgram, VertexShader);
    gl.attachShader(this.ShaderProgram, FragmentShader);
    gl.linkProgram(this.ShaderProgram);

    gl.deleteShader(VertexShader);
    gl.deleteShader(FragmentShader);

    gl.useProgram(this.ShaderProgram);

    gl.getShaderParameter(VertexShader, gl.COMPILE_STATUS);
    console.log(gl.getShaderInfoLog(VertexShader));

    gl.getShaderParameter(FragmentShader, gl.COMPILE_STATUS);
    console.log(gl.getShaderInfoLog(FragmentShader));

    gl.getProgramParameter(this.ShaderProgram, gl.LINK_STATUS);
    console.log(gl.getProgramInfoLog(this.ShaderProgram));
  }

  GetShaderProgram() {
    return this.ShaderProgram;
  }

  UseProgram() {
    gl.useProgram(this.ShaderProgram);
  }
}
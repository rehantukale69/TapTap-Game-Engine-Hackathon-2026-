// Get WebGL canvas and rendering context
const glcanvas = document.getElementById('glcanvas');
const gl = glcanvas.getContext('webgl2');

/*
=========================================================
SHADER CLASS
---------------------------------------------------------
Handles creation and management of GPU shader programs.

Responsibilities:
- Compile vertex and fragment shaders
- Link them into a shader program
- Activate the shader program for rendering
- Provide access to the compiled program

Shaders run on the GPU and control how vertices are
processed and how pixels are rendered.
=========================================================
*/

export class Shader {
  /*
  -------------------------------------------------------
  Constructor
  Stores the source code for vertex and fragment shaders.

  Parameters:
  VertexShaderData   → GLSL source code for vertex shader
  FragmentShaderData → GLSL source code for fragment shader
  -------------------------------------------------------
  */
  constructor(VertexShaderData, FragmentShaderData) {
    // Vertex shader source code
    this.VertexShaderData = VertexShaderData;

    // Fragment shader source code
    this.FragmentShaderData = FragmentShaderData;

    // Final linked shader program
    this.ShaderProgram = null;
  }

  /*
  -------------------------------------------------------
  Initialize()
  -------------------------------------------------------
  Compiles vertex and fragment shaders, links them into
  a GPU program, and activates it for rendering.

  Steps:
  1. Create shader objects
  2. Compile shaders
  3. Attach shaders to program
  4. Link program
  5. Delete temporary shader objects
  -------------------------------------------------------
  */
  Initialize() {
    // Create vertex and fragment shader objects
    let VertexShader = gl.createShader(gl.VERTEX_SHADER);
    let FragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Create shader program
    this.ShaderProgram = gl.createProgram();

    /*
    -----------------------------------------------------
    Compile Vertex Shader
    -----------------------------------------------------
    */
    gl.shaderSource(VertexShader, this.VertexShaderData);
    gl.compileShader(VertexShader);

    /*
    -----------------------------------------------------
    Compile Fragment Shader
    -----------------------------------------------------
    */
    gl.shaderSource(FragmentShader, this.FragmentShaderData);
    gl.compileShader(FragmentShader);

    /*
    -----------------------------------------------------
    Attach shaders to program
    -----------------------------------------------------
    */
    gl.attachShader(this.ShaderProgram, VertexShader);
    gl.attachShader(this.ShaderProgram, FragmentShader);

    /*
    -----------------------------------------------------
    Link shader program
    -----------------------------------------------------
    */
    gl.linkProgram(this.ShaderProgram);

    /*
    -----------------------------------------------------
    Shader objects no longer needed after linking
    -----------------------------------------------------
    */
    gl.deleteShader(VertexShader);
    gl.deleteShader(FragmentShader);

    /*
    -----------------------------------------------------
    Activate shader program
    -----------------------------------------------------
    */
    gl.useProgram(this.ShaderProgram);

    /*
    -----------------------------------------------------
    Debug: Print shader compilation logs
    -----------------------------------------------------
    */
    gl.getShaderParameter(VertexShader, gl.COMPILE_STATUS);
    console.log(gl.getShaderInfoLog(VertexShader));

    gl.getShaderParameter(FragmentShader, gl.COMPILE_STATUS);
    console.log(gl.getShaderInfoLog(FragmentShader));

    /*
    -----------------------------------------------------
    Debug: Print program linking log
    -----------------------------------------------------
    */
    gl.getProgramParameter(this.ShaderProgram, gl.LINK_STATUS);
    console.log(gl.getProgramInfoLog(this.ShaderProgram));
  }

  /*
  -------------------------------------------------------
  GetShaderProgram()
  -------------------------------------------------------
  Returns the compiled shader program object.
  -------------------------------------------------------
  */
  GetShaderProgram() {
    return this.ShaderProgram;
  }

  /*
  -------------------------------------------------------
  UseProgram()
  -------------------------------------------------------
  Activates the shader program so it can be used for
  rendering operations.
  -------------------------------------------------------
  */
  UseProgram() {
    gl.useProgram(this.ShaderProgram);
  }
}
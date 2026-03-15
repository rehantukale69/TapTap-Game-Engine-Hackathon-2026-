# TapTap Engine – JSON Driven Game Runtime

A lightweight modular game engine built for the **TapTap Hackathon**.
The engine demonstrates a **data-driven architecture** where gameplay, UI, and input mappings are loaded dynamically from JSON scene files.

The system separates **engine runtime logic** from **game data**, allowing different games or scenes to be created simply by modifying JSON files.

---

# Features

* WebGL based renderer
* Physics simulation using Planck.js
* Entity system with fixtures and physics bodies
* Event-driven gameplay system
* JSON driven scene loading
* Runtime UI system
* Keyboard and mouse input handling
* Scene serialization and saving
* Dynamic scene switching
* UI actions mapped to engine events

---

# Running the Engine

No build process is required.

Simply open:

```
index.html
```

in a browser.

Alternatively you may run a simple local server:

```
python -m http.server
```

Then open:

```
http://localhost:8000
```

---

# Controls

| Key / Input        | Action                                   |
|--------------------|-------------------------------------------|
| **A**              | Load scene from JSON file                 |
| **B**              | Save current scene to disk                |
| **P**              | Play background music                     |
| **I**              | Move player to the **left**               |
| **UI Button**      | Move player to the **right**              |
| **Mouse Click**    | Trigger UI buttons                        |
| **Configured Keys**| Trigger input events defined in JSON      |



Input behavior such as movement or actions is defined through the **scene JSON input mapping system**.

Example input mapping:

```json
{
  "key": "KeyW",
  "condition": "hold",
  "event": {
    "type": "MOVE_ENTITY",
    "entityID": "Player",
    "dx": 0,
    "dy": 0.1
  }
}
```

---

# Engine Architecture

The engine follows a **modular design**.

```
src/

renderer/
  Renderer.js
  Object.js
  Text.js

entity/
  Entity.js

simulation/
  Simulation.js

ui/
  UISystem.js
  TextButton.js
  TextureButton.js

state/
  GameStateManager.js

manager/
  Manager.js
```

Game data is stored separately in:

```
scenes/
   scene1.json
```

This separation ensures that the engine runtime remains reusable while the gameplay configuration is handled through external data files.

---

# Scene JSON Structure

Scenes are defined using JSON files which describe:

* metadata
* physics configuration
* camera settings
* entities
* UI elements
* input mappings

Example structure:

```json
{
  "metadata": {
    "name": "scene1",
    "version": 1
  },

  "physics": [0, -10],

  "camera": [0, 0, 0],

  "entities": [],
  "ui": [],
  "input": []
}
```

---

# Entity Definition

Entities define visual objects with physics bodies.

```json
{
  "entity": {
    "id": "Player",
    "x": 0,
    "y": 0,
    "z": -400,
    "w": 50,
    "h": 50,
    "bodytype": "dynamic"
  },
  "fixtures": []
}
```

---

# UI System

UI elements are defined in JSON and created dynamically at runtime.

Supported UI types:

* **TextButton**
* **TextureButton**

Example:

```json
{
  "type": "TextButton",
  "text": "Move Player",
  "x": 0,
  "y": 200,
  "z": -400,
  "action": {
    "type": "MOVE_ENTITY",
    "entityID": "Player",
    "dx": 0.1,
    "dy": 0
  }
}
```

---

# Event System

Gameplay behavior is controlled through a central **event dispatcher**.

Supported events include:

* MOVE_ENTITY
* SET_ENTITY_POS
* ROT_ENTITY
* APPLY_FORCE
* APPLY_IMP
* SET_VELOCITY
* DESTROY_ENTITY
* SET_CAMERA_POSITION
* MOVE_CAMERA
* CHANGE_STATE
* LOAD_SCENE

Events can be triggered by:

* UI buttons
* keyboard input
* scene scripts

---

# Scene Loading

Scenes can be loaded dynamically at runtime.

Example:

```javascript
StateManager.LoadFromDisk("../../scenes/scene1");
```

The engine will automatically:

1. Parse the JSON file
2. Create entities
3. Construct UI
4. Register input events
5. Sync objects with the renderer

---

# Scene Saving

Scenes can be exported to JSON using:

```
B key
```

This serializes the current runtime scene and downloads a JSON file.

---

# Engine Loop

The engine runs using a continuous update loop:

```
Input → Update → Physics → Render → Repeat
```

Implemented using `requestAnimationFrame`.

---

# Technologies Used

* **WebGL**
* **gl-matrix**
* **Planck.js Physics Engine**
* **JavaScript ES Modules**

---

# Hackathon Objective

This project demonstrates a **modular JSON-driven game engine runtime** where gameplay behavior can be modified without altering engine source code.

The architecture separates:

```
Engine Runtime
Game Data
```

allowing the engine to serve as a reusable platform for multiple games.

---

# Author

Rehant Ukale

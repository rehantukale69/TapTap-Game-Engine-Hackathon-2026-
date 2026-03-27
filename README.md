# 🚀 TaPTaP Game Engine – Hackathon Submission

---

## 📌 Project Overview

TaPTaP is a custom-built **WebGL-based game engine** designed to demonstrate core game engine architecture along with a functional gameplay prototype.

The engine is built with a strong focus on:

* ⚡ Real-time rendering
* 🧩 Modular architecture
* 📦 Data-driven design (JSON-based scenes)
* 🎮 Interactive gameplay systems

The project culminates in a fully playable prototype that showcases how multiple engine systems work together seamlessly.

---

## ✨ Key Features

* ⚡ Fully **event-driven architecture**
* 🧩 **Modular system design**
* 📦 **JSON-driven scenes (no hardcoded logic)**
* 🎨 WebGL2 **GPU rendering pipeline**
* ⚙️ Real-time **physics simulation (Planck.js)**
* 🖱️ Interactive **UI system (Text + Texture buttons)**
* 🔊 Integrated **audio system with toggle support**
* 🔁 Dynamic **scene switching**
* 🎮 Multiple gameplay scenarios

---

## 🏗️ Engine Architecture

The engine follows a **modular and event-driven architecture**.

### Core Systems:

* 🎨 Renderer (WebGL2)
* ⚙️ Simulation (Physics – Planck.js)
* 🧩 UI System
* 🔊 Audio System
* 🧠 State Manager (central controller)

All systems communicate through an **event queue**, ensuring:

* Loose coupling
* High scalability
* Easy feature extension

👉 Game logic is entirely controlled via **JSON scene files**, making the engine fully data-driven.

---

## 🧠 Development Phases

### 🧩 1. Engine Blueprint

* Designed system architecture
* Planned rendering pipeline
* Defined entity structure
* Organized modular folder structure

**Outcome:** Structured and scalable engine design

---

### ⚙️ 2. Core Engine Proof

* Implemented entity system
* Built rendering pipeline
* Integrated input system
* Created update loop

**Outcome:** Functional engine core

---

### 🎮 3. Prototype Build

* Player movement system
* Obstacle spawning
* Collision detection
* Gameplay loop

**Outcome:** Fully playable game prototype

---

## 🎮 Game Scenarios

### 1. Endless Runner

* Player moves left/right
* Obstacles spawn dynamically
* Collision triggers game over

---

### 2. Physics Sandbox

* Spawn objects dynamically
* Real-time physics interaction
* Demonstrates engine flexibility

---

### 3. UI-Based Scenes

* Menu Scene
* Pause System
* Game Over Screen

---

## ⚡ Event System

The engine operates using a centralized **event-driven system**.

### Example Events:

* MOVE_ENTITY
* APPLY_FORCE
* SET_VELOCITY
* CHANGE_STATE
* LOAD_SCENE
* PLAY_AUDIO
* REMOVE_UI
* TOGGLE_AUDIO

All interactions (input, UI, physics) generate events processed by the **State Manager**.

### Benefits:

* Clean logic separation
* High flexibility
* Easy debugging and scaling

---

## 📂 Project Structure

```
engine/
  core/
  renderer/
  simulation/
  state/
  ui/
  audio/

scenes/
  menu.json
  game.json
  pause.json
  sandbox.json

Resources/
index.html
script.js
```

---

## 🎮 Controls

| Action     | Key         |
| ---------- | ----------- |
| Start Game | Enter       |
| Move Left  | ← Arrow / A |
| Move Right | → Arrow / D |
| Save Scene | B           |
| Pause      | ESC         |

---

## ▶️ How to Run the Project

### 🔧 Requirements

* Modern browser (Chrome recommended)
* Local server (recommended)

---

### 🚀 Steps

#### Option 1: Local Server (Recommended)

```bash
python -m http.server
```

OR

```bash
npx serve
```

Then open:

```
http://localhost:8000
```

---

⚠️ Important:
Do NOT open HTML directly — textures may not load correctly.

---

## 🧠 How the Engine Works

Flow:

```
Input → Event → StateManager → Systems → Render
```

* Input generates events
* StateManager processes events
* Systems update (physics, UI, etc.)
* Renderer draws final frame

---

## 🧠 Technical Highlights

* Custom **projection-based rendering**
* WebGL2 shader pipeline
* Texture atlas system
* Physics-render synchronization
* UI bounding box detection
* Event queue architecture

---

## 🎥 Demo Video

👉 (Add your video link here)

Showcase:

* Gameplay
* UI interaction
* Scene switching
* Physics simulation

---

## ⚠️ Note on Checkpoint Submission

One intermediate checkpoint was not submitted on the platform.

However, development progress is clearly demonstrated via:

* Structured implementation phases
* Git commit history
* Fully functional final build

---

## 🎯 Final Deliverable

A **modular game engine** featuring:

* Core engine systems
* Event-driven architecture
* JSON-based scene system
* Playable gameplay prototype

---

## 🚀 Future Improvements

* Visual editor for scene creation
* Advanced rendering (lighting, particles)
* Performance optimization
* AI-based gameplay logic
* Multiplayer support

---

## 🏁 Conclusion

TaPTaP is not just a game — it is a **mini game engine** demonstrating:

* Clean architecture
* Real-time systems integration
* Scalable design

---

🔥 **Built with a focus on engine design, not just gameplay**

---

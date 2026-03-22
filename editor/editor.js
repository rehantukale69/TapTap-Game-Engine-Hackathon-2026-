// ==========================
// Get Buttons
// ==========================
import {Entity} from '../engine/entity/Entity.js';

export const EventSchema = {
  MOVE_ENTITY: ['entityID', 'dx', 'dy'],

  SET_ENTITY_POS: ['entityID', 'x', 'y'],
  ROT_ENTITY: ['entityID', 'theta'],
  DESTROY_ENTITY: ['entityID'],

  APPLY_FORCE: ['entityID', 'fx', 'fy'],
  APPLY_IMP: ['entityID', 'xImp', 'yImp'],
  SET_VELOCITY: ['entityID', 'vx', 'vy'],

  // Camera (no entityID)
  MOVE_CAMERA: ['x', 'y', 'z'],
  SET_CAMERA_POSITION: ['x', 'y', 'z'],

  // State / Scene
  CHANGE_STATE: ['state'],
  LOAD_SCENE: ['scene'],
  SAVE_SCENE: ['scene'],

  // Audio
  PLAY_AUDIO: ['audio', 'loop', 'volume']
};

function waitForEngine(callback) {
  const check = () => {
    if (window.engineSystem?.StateManager) {
      callback();
    } else {
      requestAnimationFrame(check);
    }
  };
  check();
}

class Inspector {
  constructor() {
    this.inspector = document.getElementById('inspector');
    this.currentMode = null;
  }

  createInput(labelText, defaultValue = '') {
    const wrapper = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = labelText;

    const input = document.createElement('input');
    input.value = defaultValue;

    wrapper.append(label, input);
    this.inspector.appendChild(wrapper);

    return input;
  }

  createEventListUI() {
    const section = document.createElement('div');

    const title = document.createElement('h5');
    title.textContent = 'Events';

    const eventList = document.createElement('div');
    const addEventBtn = document.createElement('button');
    addEventBtn.textContent = '+ Event';

    section.append(title, eventList, addEventBtn);
    this.inspector.appendChild(section);

    let events = [];

    const render = () => {
      eventList.innerHTML = '';

      events.forEach((ev, i) => {
        const evDiv = document.createElement('div');
        evDiv.className = 'event';

        const row = document.createElement('div');
        row.className = 'row';

        // ==========================
        // TYPE SELECT
        // ==========================
        const type = document.createElement('select');

        Object.keys(EventSchema).forEach(t => {
          const opt = document.createElement('option');
          opt.value = t;
          opt.textContent = t;
          type.appendChild(opt);
        });

        type.value = ev.type;

        type.onchange = () => {
          ev.type = type.value;

          Object.keys(ev).forEach(k => {
            if (k !== 'type') delete ev[k];
          });

          render();
        };

        // ==========================
        // PARAM INPUTS
        // ==========================
        const paramInputs = document.createElement('div');
        paramInputs.className = 'paramInputs';

        const paramsList = EventSchema[ev.type] || [];

        paramsList.forEach(param => {
          const input = document.createElement('input');
          input.placeholder = param;
          input.value = ev[param] ?? '';

          input.oninput = () => {
            ev[param] = isNaN(input.value) ? input.value : +input.value;
          };

          paramInputs.appendChild(input);
        });

        // ==========================
        // REMOVE BUTTON
        // ==========================
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';

        removeBtn.onclick = () => {
          events.splice(i, 1);
          render();
        };

        row.append(type, paramInputs, removeBtn);
        evDiv.appendChild(row);

        eventList.appendChild(evDiv);
      });
    };

    addEventBtn.onclick = () => {
      events.push({type: Object.keys(EventSchema)[0]});
      render();
    };

    return events;
  }

  createMaskUI() {
    const section = document.createElement('div');

    const title = document.createElement('h5');
    title.textContent = 'Mask Map';

    const maskList = document.createElement('div');
    const addMaskBtn = document.createElement('button');
    addMaskBtn.textContent = 'Add Mask';

    section.append(title, maskList, addMaskBtn);
    this.inspector.appendChild(section);

    let maskData = [];
    const render = () => {
      maskList.innerHTML = '';

      maskData.forEach((maskObj, i) => {
        const container = document.createElement('div');
        container.className = 'mask';

        // ==========================
        // HEADER ROW
        // ==========================
        const row = document.createElement('div');
        row.className = 'row';

        const maskInput = document.createElement('input');
        maskInput.type = 'number';
        maskInput.value = maskObj.mask;

        maskInput.oninput = () => {
          maskObj.mask = +maskInput.value;
        };

        const removeMaskBtn = document.createElement('button');
        removeMaskBtn.textContent = 'X';

        removeMaskBtn.onclick = () => {
          maskData.splice(i, 1);
          render();
        };

        row.append('Mask:', maskInput, removeMaskBtn);

        // ==========================
        // EVENT LIST
        // ==========================
        const eventList = document.createElement('div');

        // ==========================
        // ADD EVENT BUTTON
        // ==========================
        const addEventBtn = document.createElement('button');
        addEventBtn.textContent = '+ Event';



        addEventBtn.onclick = () => {
          maskObj.events.push({
            type: Object.keys(EventSchema)[0]  // default event
          });
          render();
        };

        // ==========================
        // EVENTS
        // ==========================
        maskObj.events.forEach((ev, j) => {
          const evDiv = document.createElement('div');
          evDiv.className = 'event';

          const eventRow = document.createElement('div');
          eventRow.className = 'row';

          // ==========================
          // TYPE SELECT
          // ==========================
          const type = document.createElement('select');

          Object.keys(EventSchema).forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            type.appendChild(opt);
          });

          type.value = ev.type;

          type.onchange = () => {
            ev.type = type.value;

            Object.keys(ev).forEach(k => {
              if (k !== 'type') delete ev[k];
            });

            render();
          };

          // ==========================
          // PARAM INPUTS
          // ==========================
          const paramInputs = document.createElement('div');

          const paramsList = EventSchema[ev.type] || [];

          paramsList.forEach(param => {
            const input = document.createElement('input');
            input.placeholder = param;
            input.value = ev[param] ?? '';

            input.oninput = () => {
              ev[param] = input.value;
            };

            paramInputs.appendChild(input);
          });

          // ==========================
          // REMOVE BUTTON
          // ==========================
          const removeEventBtn = document.createElement('button');
          removeEventBtn.textContent = 'X';

          removeEventBtn.onclick = () => {
            maskObj.events.splice(j, 1);
            render();
          };

          eventRow.append(type, paramInputs, removeEventBtn);
          evDiv.appendChild(eventRow);

          eventList.appendChild(evDiv);
        });

        // ==========================
        // FINAL ORDER
        // ==========================
        container.append(row, eventList, addEventBtn);
        maskList.appendChild(container);
      });
    };

    addMaskBtn.onclick = () => {
      maskData.push({mask: 1, events: []});
      render();
    };

    return maskData;
  }

  renderEntityForm() {
    const e = window.engineSystem?.StateManager;
    this.inspector.innerHTML = '';

    const title = document.createElement('h4');
    title.textContent = 'Create Entity';

    // Helper to create input


    // ==========================
    // Inputs
    // ==========================
    const x = this.createInput('x', 0);
    const y = this.createInput('y', 0);
    const z = this.createInput('z', 0);

    const scale = this.createInput('scale', 1);

    const r = this.createInput('r', 1);
    const g = this.createInput('g', 1);
    const b = this.createInput('b', 1);
    const alpha = this.createInput('alpha', 1);

    const slot = this.createInput('texture slot', 0);

    const px = this.createInput('pivot x', 0);
    const py = this.createInput('pivot y', 0);

    const theta = this.createInput('rotation', 0);

    const bodytype = this.createInput('body type (dynamic/static)', 'dynamic');

    const ID = this.createInput('ID', '');

    const categoryBits = this.createInput('categoryBits', 1);
    const maskData = this.createMaskUI();

    const texturesize = this.createInput('texture size', 1);

    // ==========================
    // Buttons
    // ==========================
    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';

    // ==========================
    // Actions
    // ==========================
    createBtn.onclick = () => {
      const entityData = {
        x: parseFloat(x.value),
        y: parseFloat(y.value),
        z: parseFloat(z.value),

        scale: parseFloat(scale.value),

        r: parseFloat(r.value),
        g: parseFloat(g.value),
        b: parseFloat(b.value),
        alpha: parseFloat(alpha.value),

        slot: parseInt(slot.value),

        px: parseFloat(px.value),
        py: parseFloat(py.value),

        theta: parseFloat(theta.value),

        bodytype: bodytype.value,
        ID: ID.value,

        categoryBits: parseInt(categoryBits.value),
        maskmap: maskData,

        texturesize: parseFloat(texturesize.value)
      };

      // console.log('Creating Entity:', entityData);

      // 🔥 HERE connect to your engine
      const ent = new Entity(
          entityData.x, entityData.y, entityData.z, entityData.scale,
          entityData.r, entityData.g, entityData.b, entityData.alpha,
          entityData.slot, entityData.px, entityData.py, entityData.theta,
          e.simulationWorld,  // 🔥 IMPORTANT
          entityData.bodytype,
          entityData.ID || Date.now(),  // fallback ID
          entityData.categoryBits, entityData.maskmap,
          e.Engine.TextureSizes[e.slot]);

      e.AddEntity ? e.AddEntity(ent) : e.Entities.push(ent);

      this.inspector.innerHTML = '';  // clear after create
    };

    cancelBtn.onclick = () => {
      this.inspector.innerHTML = '';
    };

    this.inspector.append(createBtn, cancelBtn);
  }

  renderTextForm() {
    this.inspector.innerHTML = '';

    const title = document.createElement('h4');
    title.textContent = 'Create Text Button';
    this.inspector.appendChild(title);

    // ==========================
    // Inputs
    // ==========================
    const textcontent = this.createInput('text', 'Hello');

    const x = this.createInput('x', 0);
    const y = this.createInput('y', 0);
    const z = this.createInput('z', 0);

    const scale = this.createInput('scale', 1);

    const r = this.createInput('r', 1);
    const g = this.createInput('g', 1);
    const b = this.createInput('b', 1);
    const a = this.createInput('alpha', 1);

    const slot = this.createInput('texture slot', 0);



    // 🔥 reuse your event system here
    const action = this.createEventListUI();
    // ==========================
    // Buttons
    // ==========================
    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';

    // ==========================
    // Actions
    // ==========================
    createBtn.onclick = () => {
      const textData = {
        textcontent: textcontent.value,

        x: +x.value,
        y: +y.value,
        z: +z.value,

        scale: +scale.value,

        r: +r.value,
        g: +g.value,
        b: +b.value,
        a: +a.value,

        slot: +slot.value,


        action: action  // 🔥 your mask/event system
      };

      // console.log('Creating TextButton:', textData);

      // 🔥 connect to engine
      // engine.createTextButton(textData);

      this.inspector.innerHTML = '';
    };

    cancelBtn.onclick = () => {
      this.inspector.innerHTML = '';
    };

    this.inspector.append(createBtn, cancelBtn);
  }

  renderTextureForm() {
    this.inspector.innerHTML = '';

    const title = document.createElement('h4');
    title.textContent = 'Create Texture Button';
    this.inspector.appendChild(title);

    // ==========================
    // Inputs
    // ==========================
    const x = this.createInput('x', 0);
    const y = this.createInput('y', 0);
    const z = this.createInput('z', 0);

    const w = this.createInput('width', 1);
    const h = this.createInput('height', 1);

    const r = this.createInput('r', 1);
    const g = this.createInput('g', 1);
    const b = this.createInput('b', 1);
    const alpha = this.createInput('alpha', 1);

    const slot = this.createInput('texture slot', 0);

    const px = this.createInput('pivot x', 0);
    const py = this.createInput('pivot y', 0);

    const theta = this.createInput('rotation', 0);

    // 🔥 SAME EVENT SYSTEM AS TEXT BUTTON
    const action = this.createEventListUI();

    // ==========================
    // Buttons
    // ==========================
    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';

    // ==========================
    // Actions
    // ==========================
    createBtn.onclick = () => {
      const textureData = {
        x: +x.value,
        y: +y.value,
        z: +z.value,

        w: +w.value,
        h: +h.value,

        r: +r.value,
        g: +g.value,
        b: +b.value,
        alpha: +alpha.value,

        slot: +slot.value,

        px: +px.value,
        py: +py.value,

        theta: +theta.value,

        action: action  // 🔥 direct event list
      };

      // console.log('Creating TextureButton:', textureData);

      // 🔥 connect to engine
      // engine.createTextureButton(textureData);

      this.inspector.innerHTML = '';
    };

    cancelBtn.onclick = () => {
      this.inspector.innerHTML = '';
    };

    this.inspector.append(createBtn, cancelBtn);
  }

  renderInputForm() {
    this.inspector.innerHTML = '';

    const title = document.createElement('h4');
    title.textContent = 'Create Input Event';
    this.inspector.appendChild(title);

    // ==========================
    // Inputs
    // ==========================
    const key = this.createInput('key', 'KeyA');

    // Condition dropdown
    const conditionWrapper = document.createElement('div');

    const conditionLabel = document.createElement('label');
    conditionLabel.textContent = 'condition';

    const condition = document.createElement('select');

    ['pressed', 'held', 'released'].forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      condition.appendChild(opt);
    });

    conditionWrapper.append(conditionLabel, condition);
    this.inspector.appendChild(conditionWrapper);

    // 🔥 Reuse event system
    const eventList = this.createEventListUI();

    // ==========================
    // Buttons
    // ==========================
    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';

    // ==========================
    // Actions
    // ==========================
    createBtn.onclick = () => {
      const inputData = {
        key: key.value,
        condition: condition.value,
        event: eventList
      };

      // console.log('Creating Input Event:', inputData);

      // 🔥 connect to engine
      // engine.addInputBinding(inputData);

      this.inspector.innerHTML = '';
    };

    cancelBtn.onclick = () => {
      this.inspector.innerHTML = '';
    };

    this.inspector.append(createBtn, cancelBtn);
  }

  renderInspector() {
    this.inspector.innerHTML = '';

    if (this.currentMode === 'entity') {
      this.renderEntityForm();
    }

    if (this.currentMode === 'text') {
      this.renderTextForm();
    }

    if (this.currentMode === 'texture') {
      this.renderTextureForm();
    }

    if (this.currentMode === 'input') {
      this.renderInputForm();
    }
  }
}


class TopMenu {
  constructor(inspector) {
    this.addEntityBtn = document.getElementById('addEntity');
    this.addTextBtn = document.getElementById('addTextBtn');
    this.addTextureBtn = document.getElementById('addTextureBtn');
    this.addInputEventBtn = document.getElementById('addInputEvent');

    // this.TopMenu = new TopMenu(this.Inspector);



    this.inspector = inspector;


    this.addEntityBtn.onclick = () => {
      this.inspector.currentMode = 'entity';
      this.inspector.renderInspector();
    };

    this.addTextBtn.onclick = () => {
      this.inspector.currentMode = 'text';
      this.inspector.renderInspector();
    };

    this.addTextureBtn.onclick = () => {
      this.inspector.currentMode = 'texture';
      this.inspector.renderInspector();
    };

    this.addInputEventBtn.onclick = () => {
      this.inspector.currentMode = 'input';
      this.inspector.renderInspector();
    };
  }
}

class BottomPanel {
  constructor() {
    this.entitiesList = document.getElementById('entities-bottom-list');
    this.uiList = document.getElementById('ui-bottom-list');
  }

  showTab(name) {
    // remove active
    document.querySelectorAll('#bottom-tabs .tab-btn')
        .forEach(btn => btn.classList.remove('active'));

    document.querySelectorAll('.tab-pane')
        .forEach(p => p.classList.remove('active'));

    // activate correct tab button
    document.querySelector(`#bottom-tabs .tab-btn[data-tab="${name}"]`)
        ?.classList.add('active');

    // activate correct panel
    document.getElementById(`tab-${name}`)?.classList.add('active');
  }

  /* 🔹 ENTITIES LIST */
  renderEntities() {
    this.entitiesList.innerHTML = '';

    const e = window.engineSystem?.StateManager;


    if (!e) return;



    (e.Entities || []).forEach(ent => {
      const li = document.createElement('li');
      li.textContent = ent.name || ('Entity ' + ent.ID);


      li.onclick = () => {
        EditorState.selected = ent;

        Edit.Inspector.currentMode = 'entity';
        Edit.Inspector.renderInspector();
      };


      this.entitiesList.appendChild(li);
    });
  }

  /* 🔹 UI LIST */
  renderUI() {
    this.uiList.innerHTML = '';

    const e = window.engineSystem?.StateManager;
    if (!e) return;

    (e.UI || []).forEach(ui => {
      const li = document.createElement('li');
      li.textContent = ui.name || ('UI ' + ui.id);

      this.uiList.appendChild(li);
    });
  }

  /* 🔹 RENDER ALL */
  renderAll() {
    this.renderEntities();
    this.renderUI();
  }
}


class Manager {
  constructor() {
    this.Inspector = new Inspector();
    this.TopMenu = new TopMenu(this.Inspector);
    this.BottomPanel = new BottomPanel();
  }

  init() {
    this.BottomPanel.renderAll();
  }
}


document.addEventListener('DOMContentLoaded', () => {
  waitForEngine(() => {
    // console.log('Engine ready ✅');

    const Edit = new Manager();
    window.Edit = Edit;

    Edit.BottomPanel.renderAll();

    console.log(window.engineSystem.StateManager.Entities, 'hemloo');
  });
});

// ==========================
// Attach Functions
// ==========================

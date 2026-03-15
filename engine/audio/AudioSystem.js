/*
=========================================================
AUDIO SYSTEM
---------------------------------------------------------
Responsible for:
- Loading audio files
- Storing decoded audio buffers
- Playing sounds with optional looping and volume control

Uses the Web Audio API for efficient sound playback.
=========================================================
*/

export class AudioSystem {
  /*
  -------------------------------------------------------
  Constructor
  Initializes the Web Audio API context and storage
  structures for sounds and their file paths.
  -------------------------------------------------------
  */
  constructor() {
    // Create an audio context (browser audio engine)
    this.audioContext =
        new (window.AudioContext || window.webkitAudioContext)();

    // Stores decoded audio buffers
    // Example: { "jump": AudioBuffer }
    this.sounds = {};

    // Stores file paths for each sound
    // Example: { "jump": "audio/jump.wav" }
    this.soundspath = {};
  }

  /*
  -------------------------------------------------------
  loadSound(name, url)
  -------------------------------------------------------
  Loads an audio file from disk and decodes it into an
  AudioBuffer so it can be played efficiently later.

  Parameters:
  name → unique identifier for the sound
  url  → file path of the audio file
  -------------------------------------------------------
  */
  async loadSound(name, url) {
    // Fetch audio file
    const response = await fetch(url);

    // Convert file into binary buffer
    const arrayBuffer = await response.arrayBuffer();

    // Decode the binary audio data into an AudioBuffer
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    // Store decoded sound for playback
    this.sounds[name] = audioBuffer;

    // Store path for serialization / scene saving
    this.soundspath[name] = url;
  }

  /*
  -------------------------------------------------------
  playSound(name, loop = false, volume = 1)
  -------------------------------------------------------
  Plays a loaded sound.

  Parameters:
  name   → sound identifier
  loop   → whether the sound should repeat
  volume → playback volume (0 to 1)
  -------------------------------------------------------
  */
  playSound(name, loop = false, volume = 1) {
    // Retrieve the audio buffer
    const buffer = this.sounds[name];

    // If sound is not loaded, do nothing
    if (!buffer) return;

    // Create a source node (sound player)
    const source = this.audioContext.createBufferSource();

    // Create a gain node to control volume
    const gainNode = this.audioContext.createGain();

    // Assign audio data to source
    source.buffer = buffer;

    // Enable or disable looping
    source.loop = loop;

    // Set playback volume
    gainNode.gain.value = volume;

    // Connect nodes:
    // Source → Gain → Speakers
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Start playback immediately
    source.start(0);
  }
}
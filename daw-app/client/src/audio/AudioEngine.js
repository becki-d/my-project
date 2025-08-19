import { Transport } from 'tone';

export class AudioEngine {
  constructor() {
    // Audio Context
    this.audioContext = null;
    this.workletNode = null;
    this.mediaStreamSource = null;
    this.isRecording = false;
    this.audioChunks = [];

    // MIDI
    this.midiAccess = null;
    this.midiInputs = new Map();

    // Initialize
    this.initAudioContext();
    this.setupMidi();
  }

  // ======================
  // Core Audio Setup
  // ======================
  async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'interactive',  // Ultra-low latency mode
        sampleRate: 48000            // Professional audio standard
      });

      // Worklet for thread-safe processing
      await this.setupAudioWorklet();
      
      // Resume on first user interaction (browser security)
      document.addEventListener('click', () => this.audioContext.resume(), { once: true });
    } catch (error) {
      console.error('AudioContext initialization failed:', error);
      throw new Error('This browser lacks Web Audio API support');
    }
  }

  async setupAudioWorklet() {
    try {
      // Load the processor (path must match your build system)
      await this.audioContext.audioWorklet.addModule('/audio-processor.worklet.js');
      
      this.workletNode = new AudioWorkletNode(
        this.audioContext,
        'audio-processor',
        { outputChannelCount: [2] }  // Stereo output
      );

      // Connect to master output
      this.workletNode.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Worklet setup failed:', error);
      throw new Error('Audio processing unavailable');
    }
  }

  // ======================
  // Recording & Playback
  // ======================
  async startRecording() {
    if (this.isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 2,
          sampleRate: 48000
        }
      });

      this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
      this.mediaStreamSource.connect(this.workletNode);

      // Capture raw data for WAV export
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => this.audioChunks.push(e.data);
      recorder.start(100);  // Collect chunks every 100ms

      this.isRecording = true;
    } catch (error) {
      console.error('Recording failed:', error);
      throw new Error('Microphone access denied');
    }
  }

  stopRecording() {
    if (!this.isRecording) return;

    this.mediaStreamSource?.disconnect();
    this.mediaStreamSource = null;
    this.isRecording = false;

    // Return blob for download/upload
    return new Blob(this.audioChunks, { type: 'audio/wav' });
  }

  // ======================
  // MIDI Integration
  // ======================
  async setupMidi() {
    if (!navigator.requestMIDIAccess) return;

    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      this.midiAccess.inputs.forEach(input => {
        input.onmidimessage = this.handleMidiMessage.bind(this);
        this.midiInputs.set(input.id, input);
      });

      this.midiAccess.onstatechange = (event) => {
        console.log('MIDI device change:', event.port);
      };
    } catch (error) {
      console.warn('MIDI unavailable:', error);
    }
  }

  handleMidiMessage(message) {
    const [command, note, velocity] = message.data;
    
    // Send to Tone.js or direct Web Audio synthesis
    Transport.scheduleOnce((time) => {
      this.workletNode.port.postMessage({
        type: 'midi',
        note,
        velocity,
        duration: 0.2,
        time
      });
    }, Transport.now());
  }

  // ======================
  // Cleanup
  // ======================
  destroy() {
    this.workletNode?.disconnect();
    this.mediaStreamSource?.disconnect();
    this.audioContext?.close();
    this.midiInputs.forEach(input => input.onmidimessage = null);
  }
}
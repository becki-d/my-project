export class MIDIController {
  constructor() {
    this.devices = new Map();
    navigator.requestMIDIAccess().then(access => {
      access.inputs.forEach(device => {
        device.onmidimessage = this.handleMessage.bind(this);
        this.devices.set(device.id, device);
      });
    });
  }

  handleMessage(message) {
    const [command, note, velocity] = message.data;
    // Send to Tone.js or Web Audio
  }
}
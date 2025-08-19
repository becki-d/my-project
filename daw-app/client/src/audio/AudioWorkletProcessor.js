// This runs in a separate audio thread (not the main UI thread)
class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    // Zero-copy processing for low latency
    const output = outputs[0];
    for (let channel = 0; channel < output.length; channel++) {
      output[channel].set(input[channel]); // Direct memory transfer
    }

    return true;
  }
}

// Register the processor
registerProcessor('audio-processor', AudioProcessor);
// client/src/components/AudioRecorder.js
import { useState, useEffect } from 'react';
import { AudioEngine } from '../audio/AudioEngine';

export default function AudioRecorder() {
  const [engine] = useState(() => new AudioEngine());
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = async () => {
    if (isRecording) {
      const blob = engine.stopRecording();
      console.log('Audio blob:', blob);
    } else {
      await engine.startRecording();
    }
    setIsRecording(!isRecording);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => engine.destroy();
  }, [engine]);

  return (
    <button onClick={handleRecord}>
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  );
}
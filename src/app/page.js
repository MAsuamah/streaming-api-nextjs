'use client';

import { useRef, useState } from 'react';

export default function Home() {
  const socket = useRef(null);
  const audioContext = useRef(null);
  const mediaStream = useRef(null);
  const scriptProcessor = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(''); 
  const [partialTranscript, setPartialTranscript] = useState(''); 

  const getToken = async () => {
    const response = await fetch('/api/token'); // Fetch temporary token 
    const data = await response.json();

    if (data.error) {
      console.error('Error fetching token:', data.error);
      alert(data.error);
      return null;
    }

    return data.token;
  };

  const startRecording = async () => {
    const token = await getToken();
    if (!token) return;

    socket.current = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

    socket.current.onopen = async () => {
      console.log('WebSocket connection established');
      setIsRecording(true);

      mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new AudioContext({ sampleRate: 16000 });

      const source = audioContext.current.createMediaStreamSource(mediaStream.current);
      scriptProcessor.current = audioContext.current.createScriptProcessor(4096, 1, 1);

      source.connect(scriptProcessor.current);
      scriptProcessor.current.connect(audioContext.current.destination);

      scriptProcessor.current.onaudioprocess = (event) => {
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) return;

        let inputData = event.inputBuffer.getChannelData(0);
        let output = new Int16Array(inputData.length);

        for (let i = 0; i < inputData.length; i++) {
          output[i] = Math.min(1, inputData[i]) * 0x7FFF; // Convert float32 PCM -> PCM16
        }

        socket.current.send(output.buffer);
      };
    };

    socket.current.onmessage = (event) => {
      const res = JSON.parse(event.data);

      if (res.message_type === 'PartialTranscript') {
        console.log('Partial:', res.text);
        setPartialTranscript(res.text); 
      }

      if (res.message_type === 'FinalTranscript') {
        console.log('Final:', res.text);
        setTranscript((prev) => prev + ' ' + res.text); 
        setPartialTranscript(''); 
      }
    };

    socket.current.onerror = (event) => {
      console.error('WebSocket error:', event);
      stopRecording();
    };

    socket.current.onclose = (event) => {
      console.log('WebSocket closed:', event);
      socket.current = null;
    };
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
      scriptProcessor.current = null;
    }

    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }

    if (socket.current) {
      console.log('Ending session...');
      socket.current.send(JSON.stringify({ terminate_session: true }));
      socket.current.close();
      socket.current = null;
    }
  };

  return (
    <div className="App">
      <header>
        <h1 className="header__title">Real-Time Transcription</h1>
        <p className="header__sub-title">
          Try AssemblyAI's real-time transcription API!
        </p>
      </header>
      <div className="real-time-interface">
        <p className="real-time-interface__title">Click start to begin recording!</p>
        {isRecording ? (
          <button className="real-time-interface__button" onClick={stopRecording}>
            Stop recording
          </button>
        ) : (
          <button className="real-time-interface__button" onClick={startRecording}>
            Record
          </button>
        )}
      </div>
      <div className="real-time-interface__message">
        <p><strong>Transcript:</strong> {transcript} <span style={{ opacity: 0.6 }}>{partialTranscript}</span></p>
      </div>
    </div>
  );
}

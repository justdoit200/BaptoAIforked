import { useState, useCallback, useRef, useEffect } from 'react';
import { createRealtimeGPTService, RealtimeGPTService } from '../services/realtimeGPT';

export const useRealtimeVoice = (apiKey: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const realtimeService = useRef<RealtimeGPTService | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioWorklet = useRef<AudioWorkletNode | null>(null);

  useEffect(() => {
    if (apiKey) {
      realtimeService.current = createRealtimeGPTService(apiKey);

      realtimeService.current.on('transcript.delta', ({ delta }) => {
        setTranscript(prev => prev + delta);
      });

      realtimeService.current.on('text.delta', ({ delta }) => {
        setAiResponse(prev => prev + delta);
      });

      realtimeService.current.on('response.done', () => {
        setIsProcessing(false);
      });

      realtimeService.current.on('speech.started', () => {
        console.log('Speech started');
      });

      realtimeService.current.on('speech.stopped', () => {
        console.log('Speech stopped');
      });

      realtimeService.current.on('transcription.completed', ({ transcript: userTranscript }) => {
        setTranscript(userTranscript);
      });

      realtimeService.current.on('error', ({ error: apiError }) => {
        console.error('Realtime API error:', apiError);
        setError(apiError.message || 'An error occurred');
        setIsProcessing(false);
      });

      realtimeService.current.on('disconnected', () => {
        setIsConnected(false);
      });
    }

    return () => {
      if (realtimeService.current) {
        realtimeService.current.disconnect();
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [apiKey]);

  const connect = useCallback(async () => {
    if (!realtimeService.current) return;

    try {
      setError(null);
      await realtimeService.current.connect();
      setIsConnected(true);
    } catch (err) {
      setError('Failed to connect to Realtime API');
      console.error(err);
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!isConnected) {
      await connect();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000
        }
      });

      audioContext.current = new AudioContext({ sampleRate: 24000 });
      const source = audioContext.current.createMediaStreamSource(stream);

      await audioContext.current.audioWorklet.addModule(
        URL.createObjectURL(
          new Blob(
            [
              `
              class AudioProcessor extends AudioWorkletProcessor {
                process(inputs, outputs, parameters) {
                  const input = inputs[0];
                  if (input.length > 0) {
                    const samples = input[0];
                    const int16Array = new Int16Array(samples.length);
                    for (let i = 0; i < samples.length; i++) {
                      int16Array[i] = Math.max(-32768, Math.min(32767, samples[i] * 32768));
                    }
                    this.port.postMessage(int16Array);
                  }
                  return true;
                }
              }
              registerProcessor('audio-processor', AudioProcessor);
              `
            ],
            { type: 'application/javascript' }
          )
        )
      );

      audioWorklet.current = new AudioWorkletNode(audioContext.current, 'audio-processor');

      audioWorklet.current.port.onmessage = (event) => {
        if (realtimeService.current && isRecording) {
          realtimeService.current.sendAudio(event.data);
        }
      };

      source.connect(audioWorklet.current);
      audioWorklet.current.connect(audioContext.current.destination);

      setIsRecording(true);
      setTranscript('');
      setAiResponse('');
      setError(null);

      if (realtimeService.current) {
        realtimeService.current.clearAudio();
      }
    } catch (err) {
      setError('Failed to access microphone');
      console.error(err);
    }
  }, [isConnected, connect, isRecording]);

  const stopRecording = useCallback(() => {
    if (audioWorklet.current) {
      audioWorklet.current.disconnect();
      audioWorklet.current = null;
    }

    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }

    if (realtimeService.current) {
      realtimeService.current.commitAudio();
    }

    setIsRecording(false);
    setIsProcessing(true);
  }, []);

  const sendTextWithContext = useCallback((text: string, screenContext?: string) => {
    if (!realtimeService.current || !isConnected) {
      setError('Not connected to Realtime API');
      return;
    }

    setTranscript(text);
    setAiResponse('');
    setIsProcessing(true);
    setError(null);

    realtimeService.current.sendText(text, screenContext);
  }, [isConnected]);

  const clearResponses = useCallback(() => {
    setTranscript('');
    setAiResponse('');
    setError(null);
  }, []);

  return {
    isConnected,
    isRecording,
    isProcessing,
    transcript,
    aiResponse,
    error,
    connect,
    startRecording,
    stopRecording,
    sendTextWithContext,
    clearResponses
  };
};

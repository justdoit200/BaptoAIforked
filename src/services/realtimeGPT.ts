interface RealtimeConfig {
  apiKey: string;
  model?: string;
}

interface AudioData {
  data: ArrayBuffer;
  sampleRate: number;
}

type RealtimeEventHandler = (event: any) => void;

class RealtimeGPTService {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private model: string;
  private eventHandlers: Map<string, RealtimeEventHandler[]> = new Map();
  private isConnected = false;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;

  constructor(config: RealtimeConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-4o-realtime-preview-2024-12-17';
  }

  async connect(): Promise<void> {
    if (this.ws && this.isConnected) {
      console.log('Already connected to Realtime API');
      return;
    }

    const url = `wss://api.openai.com/v1/realtime?model=${this.model}`;

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url, [
        'realtime',
        `openai-insecure-api-key.${this.apiKey}`,
        'openai-beta.realtime-v1'
      ]);

      this.ws.onopen = () => {
        console.log('Connected to OpenAI Realtime API');
        this.isConnected = true;
        this.sendSessionUpdate();
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleEvent(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('Disconnected from Realtime API');
        this.isConnected = false;
        this.emit('disconnected', {});
      };
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  private sendSessionUpdate(): void {
    this.send({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: 'You are a helpful AI assistant analyzing screen content. Provide clear, concise guidance based on what the user shares.',
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        }
      }
    });
  }

  private send(data: any): void {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('Cannot send: not connected');
    }
  }

  sendAudio(audioData: Int16Array): void {
    const base64Audio = this.arrayBufferToBase64(audioData.buffer);
    this.send({
      type: 'input_audio_buffer.append',
      audio: base64Audio
    });
  }

  commitAudio(): void {
    this.send({
      type: 'input_audio_buffer.commit'
    });
  }

  clearAudio(): void {
    this.send({
      type: 'input_audio_buffer.clear'
    });
  }

  sendText(text: string, screenContext?: string): void {
    const content = screenContext
      ? `Screen Context: ${screenContext}\n\nUser: ${text}`
      : text;

    this.send({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: content
          }
        ]
      }
    });

    this.send({
      type: 'response.create'
    });
  }

  private handleEvent(event: any): void {
    console.log('Realtime event:', event.type);

    switch (event.type) {
      case 'response.audio.delta':
        this.handleAudioDelta(event);
        break;
      case 'response.audio_transcript.delta':
        this.emit('transcript.delta', { delta: event.delta });
        break;
      case 'response.text.delta':
        this.emit('text.delta', { delta: event.delta });
        break;
      case 'response.done':
        this.emit('response.done', event);
        break;
      case 'input_audio_buffer.speech_started':
        this.emit('speech.started', event);
        break;
      case 'input_audio_buffer.speech_stopped':
        this.emit('speech.stopped', event);
        break;
      case 'conversation.item.input_audio_transcription.completed':
        this.emit('transcription.completed', {
          transcript: event.transcript
        });
        break;
      case 'error':
        this.emit('error', { error: event.error });
        break;
    }
  }

  private async handleAudioDelta(event: any): Promise<void> {
    if (!event.delta) return;

    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext({ sampleRate: 24000 });
      }

      const audioData = this.base64ToArrayBuffer(event.delta);
      const int16Array = new Int16Array(audioData);
      const float32Array = new Float32Array(int16Array.length);

      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      if (this.currentSource) {
        source.start(this.audioContext.currentTime);
      } else {
        source.start();
      }

      this.currentSource = source;
      this.emit('audio.playing', {});
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  on(eventType: string, handler: RealtimeEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  off(eventType: string, handler: RealtimeEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(eventType: string, data: any): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const createRealtimeGPTService = (apiKey: string): RealtimeGPTService => {
  return new RealtimeGPTService({ apiKey });
};

export type { RealtimeGPTService, AudioData };

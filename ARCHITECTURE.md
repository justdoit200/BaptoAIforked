# Bapto AI - Monochrome Voice Interface Architecture

## Overview

This application has been completely redesigned as a minimalist, monochrome voice-driven interface powered by OpenAI's GPT Realtime API. The chat UI has been replaced with a real-time voice interaction system.

## Design System

### Colors
- **Monochrome Only**: Black (#000000), White (#FFFFFF), Grayscale (#F9FAFB to #111827)
- **Red Accent**: Only for critical alerts and voice recording indicators (#DC2626)
- **No Purple/Violet**: Strictly avoided per design requirements

### Typography
- **Font**: JetBrains Mono (monospace)
- All text uses monospace font for consistent, clean appearance
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **8px Grid System**: All spacing follows multiples of 8px
- Standard units: 8, 16, 24, 32, 48, 64, 96, 128, 160, 192, 224, 256, 288, 320px
- Consistent padding and margins across all components

### Visual Elements
- **Borders**: 1px solid lines
- **Shadows**: Minimal, low opacity
- **Buttons**: Rectangular with clean hover states
- **Icons**: Minimal, monochrome line icons from lucide-react

## Component Architecture

### Core Components

#### 1. Header
- Sticky top position
- Shows app name, screen-sharing status, voice recording status
- Sign out button
- Monochrome design with red indicator for active voice recording

#### 2. ScreenPreview
- Large centered preview of shared screen
- Simple start/stop sharing controls
- Minimal placeholder when not sharing
- Clean rectangular layout

#### 3. VoiceRecorder
- Large circular recording button
- Press to start recording, press again to stop
- Visual waveform animation during recording
- Pulsing red indicator when active
- Status messages in monospace font

#### 4. AIResponse
- Simple transcript display area
- Shows only the latest AI response
- No chat history or message bubbles
- Clean, readable text layout
- Separate sections for user transcript and AI response

#### 5. Sidebar
- Collapsible settings panel
- Minimal conversation history
- Version information
- Clean toggle button

#### 6. LayoutContainer
- Main layout orchestrator
- Manages screen sharing state
- Coordinates voice interaction
- Clean single-column mobile-first layout

#### 7. MinimalAuthPage
- Stripped-down authentication
- Simple form with email/password
- Monochrome design
- Clear error messaging

## Technical Stack

### Voice Integration
- **GPT Realtime API**: OpenAI's WebSocket-based realtime voice API
- **Model**: gpt-4o-realtime-preview-2024-12-17
- **Audio Format**: PCM16 at 24kHz sample rate
- **Voice**: Alloy (configurable)
- **Features**:
  - Real-time audio streaming
  - Server-side Voice Activity Detection (VAD)
  - Automatic speech transcription
  - Text-to-speech synthesis
  - Screen context awareness

### Services

#### realtimeGPT.ts
Core service for GPT Realtime API integration:
- WebSocket connection management
- Audio streaming (PCM16 format)
- Event handling (speech, transcription, audio playback)
- Session configuration
- Error handling

#### useRealtimeVoice.ts
React hook for voice interaction:
- Connection state management
- Recording control
- Audio processing
- Transcript management
- Error handling

### Screen Capture
- Native browser screen sharing API
- MediaStream handling
- Frame capture for AI context
- Clean start/stop controls

## User Flow

1. **Authentication**: Simple email/password login
2. **Main Interface**:
   - Start screen sharing
   - Press large button to record voice
   - Speak query or request
   - Release button to stop recording
   - AI processes with screen context
   - Voice response plays automatically
   - Transcript shown in clean text area
3. **Interaction Loop**: Continuous voice-driven interaction with screen context

## Key Features

### Voice-First Design
- No chat bubbles or message threads
- Single latest response display
- Real-time voice synthesis
- Natural conversation flow

### Screen Context Awareness
- AI can see shared screen
- Provides guidance based on visual content
- Contextual responses
- Step-by-step instructions

### Minimalist UI
- Clean, distraction-free interface
- Focus on voice interaction
- Monochrome aesthetic
- Clear visual hierarchy

## API Configuration

Required environment variables:
```
VITE_OPENAI_API_KEY=your_openai_api_key
```

The API key is used to connect to OpenAI's Realtime API via WebSocket.

## Future Enhancements

- Conversation history persistence
- Custom voice selection
- Audio quality settings
- Advanced screen analysis
- Multi-language support
- Accessibility improvements

## Design Principles

1. **Simplicity**: Remove unnecessary elements
2. **Focus**: Emphasize voice interaction
3. **Clarity**: Clear visual hierarchy
4. **Consistency**: 8px grid, monochrome palette
5. **Accessibility**: High contrast, readable fonts
6. **Performance**: Efficient audio streaming
7. **Reliability**: Robust error handling

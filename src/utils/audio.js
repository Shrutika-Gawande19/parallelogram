import { audioMap } from './audioMap';

let currentQueueSymbol = null;
let currentAudioNode = null;
let preloadedAudio = new Map();

// Helper to normalize path 
const resolveAudioPath = (text) => {
  if (!audioMap) return null;
  return audioMap[text] || null;
};

// Preload a single audio file
export const preloadAudio = (text) => {
  if (preloadedAudio.has(text)) return;
  const path = resolveAudioPath(text);
  if (!path) return;

  const audio = new Audio(path);
  audio.preload = 'auto';
  preloadedAudio.set(text, audio);
};

// Stop all narration immediately
export const stopNarration = () => {
  currentQueueSymbol = null; // Invalidate current queue
  if (currentAudioNode) {
    currentAudioNode.pause();
    currentAudioNode.currentTime = 0;
    currentAudioNode = null;
  }
};

// Play a single audio clip and return a promise
const playAudioClip = (text) => {
  return new Promise((resolve) => {
    const path = resolveAudioPath(text);
    if (!path) {
      console.warn('Audio not found for:', text);
      resolve(); // Skip missing audio
      return;
    }

    let audio = preloadedAudio.get(text);
    if (!audio) {
      audio = new Audio(path);
    }
    
    currentAudioNode = audio;
    
    audio.onended = () => {
      currentAudioNode = null;
      resolve();
    };

    audio.onerror = () => {
      console.error('Audio playback error for:', path);
      currentAudioNode = null;
      resolve();
    };

    audio.play().catch(e => {
      console.warn('Playback prevented by browser:', e);
      resolve();
    });
  });
};

// Main narrate function - plays an array of segments sequentially
export const narrate = async (segments, forceRestart = true) => {
  if (forceRestart) {
    stopNarration();
  }
  
  const queueSymbol = Symbol('narration_queue');
  currentQueueSymbol = queueSymbol;

  // Eagerly preload all segments in this queue
  segments.forEach(seg => {
    if (seg && seg.text) preloadAudio(seg.text);
  });

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (!seg || !seg.text) continue;
    
    // If the queue has been interrupted, stop immediately
    if (currentQueueSymbol !== queueSymbol) {
      break;
    }

    await playAudioClip(seg.text);
  }
};

// Segment formatting helpers
export const say = (text) => ({ text, style: 'statement' });
export const ask = (text) => ({ text, style: 'question' });
export const cheer = (text) => ({ text, style: 'encouragement' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct = (text) => ({ text, style: 'instruction' });

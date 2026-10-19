import { SoundProfile } from '../types';

let audioCtx: AudioContext | null = null;
let currentVolume = 0.85; // Default high clarity volume

export function setSoundVolume(volume: number): void {
  currentVolume = Math.max(0, Math.min(1, volume));
}

export function getSoundVolume(): number {
  return currentVolume;
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Global unlock on first user gesture
if (typeof window !== 'undefined') {
  const unlock = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    window.removeEventListener('click', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('click', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
}

/**
 * Generates punchy, authentic mechanical switch click sounds.
 * Synthesizes both the high-frequency mechanical tactile leaf click
 * and the deep acoustic housing bottom-out thock.
 */
export function playKeySound(profile: SoundProfile, isSpace: boolean = false, isError: boolean = false): void {
  if (profile === 'mute') return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(currentVolume, now);
  masterGain.connect(ctx.destination);

  // 1. Error tone: crisp wooden buzz
  if (isError) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.09);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.09);
    return;
  }

  // 2. Vintage Typewriter: Metallic snap + carriage plate strike
  if (profile === 'typewriter') {
    // Metal strike noise
    const bufferSize = ctx.sampleRate * 0.04;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isSpace ? 1400 : 2800 + Math.random() * 400, now);
    filter.Q.setValueAtTime(4.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start(now);

    // Heavy mechanical body thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isSpace ? 90 : 160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
    return;
  }

  // 3. Cherry MX Blue (Loud, Sharp Clicky Switch)
  if (profile === 'blue') {
    // Sharp click transient (tactile jacket snap)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    const clickPitch = isSpace ? 2400 : 3400 + Math.random() * 600;
    clickOsc.frequency.setValueAtTime(clickPitch, now);
    clickOsc.frequency.exponentialRampToValueAtTime(900, now + 0.018);

    clickGain.gain.setValueAtTime(0.65, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    clickOsc.connect(clickGain);
    clickGain.connect(masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.02);

    // Deep housing bottom-out
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(isSpace ? 110 : 180, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(60, now + 0.04);

    bodyGain.gain.setValueAtTime(0.4, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(masterGain);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.045);
    return;
  }

  // 4. Brown Tactile (Punchy Mechanical Thock / Holy Panda style)
  if (profile === 'brown') {
    // High transient snap
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    const clickPitch = isSpace ? 1200 : 1800 + Math.random() * 300;
    clickOsc.frequency.setValueAtTime(clickPitch, now);
    clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.022);

    clickGain.gain.setValueAtTime(0.5, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

    clickOsc.connect(clickGain);
    clickGain.connect(masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.025);

    // Rich wooden bottom out thock
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(isSpace ? 95 : 145, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(55, now + 0.05);

    bodyGain.gain.setValueAtTime(0.55, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(masterGain);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.055);
    return;
  }

  // 5. Red Switch (Smooth Linear Thump)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(isSpace ? 85 : 130 + Math.random() * 20, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.045);

  gain.gain.setValueAtTime(0.45, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.05);
}

/**
 * Melodic triumph chime when test is completed
 */
export function playCompletionChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(currentVolume * 0.7, now);
  masterGain.connect(ctx.destination);

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.09);

    gain.gain.setValueAtTime(0, now + idx * 0.09);
    gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.09 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.6);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now + idx * 0.09);
    osc.stop(now + idx * 0.09 + 0.65);
  });
}

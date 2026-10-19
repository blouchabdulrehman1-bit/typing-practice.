import React from 'react';
import { playKeySound } from '../../utils/audio';
import { SoundProfile } from '../../types';

interface VirtualKeyboardProps {
  activeKey?: string;
  nextExpectedKey?: string;
  soundProfile: SoundProfile;
  onVirtualKeyPress?: (key: string) => void;
  showFingerGuide?: boolean;
}

interface KeyConfig {
  code: string;
  label: string;
  shiftLabel?: string;
  width?: string;
  finger?: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';
}

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Number row
  [
    { code: 'Backquote', label: '`', shiftLabel: '~', finger: 'pinky' },
    { code: 'Digit1', label: '1', shiftLabel: '!', finger: 'pinky' },
    { code: 'Digit2', label: '2', shiftLabel: '@', finger: 'ring' },
    { code: 'Digit3', label: '3', shiftLabel: '#', finger: 'middle' },
    { code: 'Digit4', label: '4', shiftLabel: '$', finger: 'index' },
    { code: 'Digit5', label: '5', shiftLabel: '%', finger: 'index' },
    { code: 'Digit6', label: '6', shiftLabel: '^', finger: 'index' },
    { code: 'Digit7', label: '7', shiftLabel: '&', finger: 'index' },
    { code: 'Digit8', label: '8', shiftLabel: '*', finger: 'middle' },
    { code: 'Digit9', label: '9', shiftLabel: '(', finger: 'ring' },
    { code: 'Digit0', label: '0', shiftLabel: ')', finger: 'pinky' },
    { code: 'Minus', label: '-', shiftLabel: '_', finger: 'pinky' },
    { code: 'Equal', label: '=', shiftLabel: '+', finger: 'pinky' },
    { code: 'Backspace', label: 'Backspace', width: 'w-20 sm:w-24', finger: 'pinky' },
  ],
  // Top row
  [
    { code: 'Tab', label: 'Tab', width: 'w-14 sm:w-16', finger: 'pinky' },
    { code: 'KeyQ', label: 'Q', finger: 'pinky' },
    { code: 'KeyW', label: 'W', finger: 'ring' },
    { code: 'KeyE', label: 'E', finger: 'middle' },
    { code: 'KeyR', label: 'R', finger: 'index' },
    { code: 'KeyT', label: 'T', finger: 'index' },
    { code: 'KeyY', label: 'Y', finger: 'index' },
    { code: 'KeyU', label: 'U', finger: 'index' },
    { code: 'KeyI', label: 'I', finger: 'middle' },
    { code: 'KeyO', label: 'O', finger: 'ring' },
    { code: 'KeyP', label: 'P', finger: 'pinky' },
    { code: 'BracketLeft', label: '[', shiftLabel: '{', finger: 'pinky' },
    { code: 'BracketRight', label: ']', shiftLabel: '}', finger: 'pinky' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', width: 'w-12 sm:w-14', finger: 'pinky' },
  ],
  // Home row (anchor F and J)
  [
    { code: 'CapsLock', label: 'Caps', width: 'w-16 sm:w-20', finger: 'pinky' },
    { code: 'KeyA', label: 'A', finger: 'pinky' },
    { code: 'KeyS', label: 'S', finger: 'ring' },
    { code: 'KeyD', label: 'D', finger: 'middle' },
    { code: 'KeyF', label: 'F', finger: 'index' }, // Home anchor
    { code: 'KeyG', label: 'G', finger: 'index' },
    { code: 'KeyH', label: 'H', finger: 'index' },
    { code: 'KeyJ', label: 'J', finger: 'index' }, // Home anchor
    { code: 'KeyK', label: 'K', finger: 'middle' },
    { code: 'KeyL', label: 'L', finger: 'ring' },
    { code: 'Semicolon', label: ';', shiftLabel: ':', finger: 'pinky' },
    { code: 'Quote', label: "'", shiftLabel: '"', finger: 'pinky' },
    { code: 'Enter', label: 'Enter', width: 'w-18 sm:w-22', finger: 'pinky' },
  ],
  // Bottom row
  [
    { code: 'ShiftLeft', label: 'Shift', width: 'w-20 sm:w-24', finger: 'pinky' },
    { code: 'KeyZ', label: 'Z', finger: 'pinky' },
    { code: 'KeyX', label: 'X', finger: 'ring' },
    { code: 'KeyC', label: 'C', finger: 'middle' },
    { code: 'KeyV', label: 'V', finger: 'index' },
    { code: 'KeyB', label: 'B', finger: 'index' },
    { code: 'KeyN', label: 'N', finger: 'index' },
    { code: 'KeyM', label: 'M', finger: 'index' },
    { code: 'Comma', label: ',', shiftLabel: '<', finger: 'middle' },
    { code: 'Period', label: '.', shiftLabel: '>', finger: 'ring' },
    { code: 'Slash', label: '/', shiftLabel: '?', finger: 'pinky' },
    { code: 'ShiftRight', label: 'Shift', width: 'w-20 sm:w-24', finger: 'pinky' },
  ],
  // Spacebar row
  [
    { code: 'ControlLeft', label: 'Ctrl', width: 'w-14 sm:w-16', finger: 'pinky' },
    { code: 'AltLeft', label: 'Alt', width: 'w-14 sm:w-16', finger: 'thumb' },
    { code: 'Space', label: 'Spacebar', width: 'flex-1 max-w-sm', finger: 'thumb' },
    { code: 'AltRight', label: 'Alt', width: 'w-14 sm:w-16', finger: 'thumb' },
    { code: 'ControlRight', label: 'Ctrl', width: 'w-14 sm:w-16', finger: 'pinky' },
  ],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey = '',
  nextExpectedKey = '',
  soundProfile,
  onVirtualKeyPress,
  showFingerGuide = false,
}) => {
  const normalizedActive = activeKey.toLowerCase();
  const normalizedNext = nextExpectedKey.toLowerCase();

  const handleKeyClick = (k: KeyConfig) => {
    playKeySound(soundProfile, k.code === 'Space', false);
    if (onVirtualKeyPress) {
      if (k.code === 'Space') onVirtualKeyPress(' ');
      else if (k.code === 'Backspace') onVirtualKeyPress('Backspace');
      else if (k.label.length === 1) onVirtualKeyPress(k.label.toLowerCase());
    }
  };

  const getFingerClass = (finger?: string) => {
    if (!showFingerGuide || !finger) return '';
    switch (finger) {
      case 'pinky':
        return 'border-rose-200 bg-rose-50/40';
      case 'ring':
        return 'border-amber-200 bg-amber-50/40';
      case 'middle':
        return 'border-emerald-200 bg-emerald-50/40';
      case 'index':
        return 'border-blue-200 bg-blue-50/40';
      case 'thumb':
        return 'border-purple-200 bg-purple-50/40';
      default:
        return '';
    }
  };

  return (
    <div className="w-full bg-slate-100/90 border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm select-none">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 px-1 font-medium">
        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span>Interactive Mechanical Keyboard</span>
          <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Click or Press Keys for Sound
          </span>
        </span>
        {showFingerGuide && (
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Pinky</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Ring</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Middle</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Index</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Thumb</span>
          </div>
        )}
      </div>

      <div className="space-y-1 sm:space-y-1.5 flex flex-col items-center">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1 sm:gap-1.5 w-full justify-center">
            {row.map((k) => {
              const keyChar = k.code === 'Space' ? ' ' : k.label.toLowerCase();
              const isPressed = normalizedActive === keyChar || (k.code === 'Space' && normalizedActive === ' ');
              const isNext = normalizedNext === keyChar || (k.code === 'Space' && normalizedNext === ' ');
              const isAnchor = k.code === 'KeyF' || k.code === 'KeyJ';

              return (
                <button
                  key={k.code}
                  type="button"
                  onClick={() => handleKeyClick(k)}
                  className={`relative flex flex-col items-center justify-center rounded-lg sm:rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 py-2 sm:py-2.5 ${
                    k.width || 'flex-1 min-w-[28px] sm:min-w-[42px]'
                  } ${
                    isPressed
                      ? 'bg-blue-600 text-white shadow-inner scale-95 ring-2 ring-blue-500 ring-offset-1 -translate-y-0.5'
                      : isNext
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-500 shadow-sm animate-pulse'
                      : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
                  } ${getFingerClass(k.finger)}`}
                >
                  {k.shiftLabel && (
                    <span className="text-[9px] text-slate-400 -mb-1 leading-none">
                      {k.shiftLabel}
                    </span>
                  )}
                  <span>{k.label}</span>
                  {/* Raised tactile bumps for F and J home row anchors */}
                  {isAnchor && (
                    <span className="absolute bottom-1 w-2.5 h-0.5 bg-slate-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

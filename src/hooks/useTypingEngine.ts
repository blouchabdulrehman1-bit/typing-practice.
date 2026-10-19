import { useState, useEffect, useRef, useCallback } from 'react';
import { SoundProfile, WpmPoint, TypingResult, TypingMode } from '../types';
import { playKeySound, playCompletionChime } from '../utils/audio';

export type CharStatus = 'correct' | 'incorrect' | 'current' | 'pending';

export interface UseTypingEngineProps {
  targetText: string;
  mode: TypingMode;
  timeLimit?: number; // in seconds, if timed mode
  isTimed: boolean;
  soundProfile: SoundProfile;
  suddenDeath?: boolean;
  noBackspace?: boolean; // When true: mistakes are permanent, cannot change errors
  onComplete?: (result: TypingResult) => void;
}

export function useTypingEngine({
  targetText,
  mode,
  timeLimit = 60,
  isTimed,
  soundProfile,
  suddenDeath = false,
  noBackspace = true,
  onComplete,
}: UseTypingEngineProps) {
  const [userInput, setUserInput] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [missedKeys, setMissedKeys] = useState<Record<string, number>>({});
  const [wpmHistory, setWpmHistory] = useState<WpmPoint[]>([]);
  const [lastPressedKey, setLastPressedKey] = useState<string>('');
  const [backspaceLockedWarning, setBackspaceLockedWarning] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isCompletedRef = useRef<boolean>(false);

  // Reset engine when target text or time limit changes
  const resetEngine = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setUserInput('');
    setStatus('idle');
    setTimeLeft(timeLimit);
    setElapsedTime(0);
    setTotalErrors(0);
    setMissedKeys({});
    setWpmHistory([]);
    setLastPressedKey('');
    startTimeRef.current = null;
    isCompletedRef.current = false;
  }, [timeLimit]);

  // Finish test and calculate final metrics
  const finishTest = useCallback(
    (forcedElapsed?: number) => {
      if (isCompletedRef.current) return;
      isCompletedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);

      setStatus('completed');
      playCompletionChime();

      const durationSec = forcedElapsed !== undefined ? forcedElapsed : (isTimed ? timeLimit - timeLeft : elapsedTime);
      const effectiveSec = Math.max(durationSec, 1);
      const minutes = effectiveSec / 60;

      // Count correct characters
      let correct = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === targetText[i]) {
          correct++;
        }
      }

      const totalTyped = userInput.length;
      const calculatedWpm = Math.round((correct / 5) / minutes) || 0;
      const rawWpm = Math.round((totalTyped / 5) / minutes) || 0;
      const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;
      const cpm = Math.round(correct / minutes) || 0;

      // Consistency: standard deviation metric
      let consistency = 95;
      if (wpmHistory.length > 2) {
        const wpms = wpmHistory.map((p) => p.wpm);
        const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
        const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
        const sd = Math.sqrt(variance);
        consistency = Math.max(40, Math.min(100, Math.round(100 - (sd / (mean || 1)) * 50)));
      }

      const result: TypingResult = {
        id: `result-${Date.now()}`,
        date: new Date().toISOString(),
        mode,
        categoryOrDuration: isTimed ? `${timeLimit}s` : `${targetText.split(' ').length} words`,
        wpm: calculatedWpm,
        rawWpm,
        accuracy,
        cpm,
        timeElapsed: Math.round(effectiveSec),
        totalChars: totalTyped,
        correctChars: correct,
        errorChars: totalErrors,
        consistency,
        missedKeys,
        wpmHistory,
      };

      if (onComplete) {
        onComplete(result);
      }
    },
    [elapsedTime, isTimed, missedKeys, mode, onComplete, targetText, timeLeft, timeLimit, totalErrors, userInput, wpmHistory]
  );

  // Interval timer for tracking progress
  useEffect(() => {
    if (status !== 'running') return;

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - (startTimeRef.current || now)) / 1000);

      setElapsedTime(elapsed);

      // Record snapshot for graph
      if (elapsed > 0) {
        let correctNow = 0;
        for (let i = 0; i < userInput.length; i++) {
          if (userInput[i] === targetText[i]) correctNow++;
        }
        const min = elapsed / 60;
        const curWpm = Math.round((correctNow / 5) / (min || 0.01));
        const curRawWpm = Math.round((userInput.length / 5) / (min || 0.01));

        setWpmHistory((prev) => [
          ...prev,
          {
            second: elapsed,
            wpm: curWpm,
            rawWpm: curRawWpm,
            errors: totalErrors,
          },
        ]);
      }

      if (isTimed) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest(timeLimit);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, isTimed, finishTest, timeLimit, userInput, targetText, totalErrors]);

  // Handle keystroke input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
      if (status === 'completed') return;

      // Quick restart via Tab + Enter
      if (e.key === 'Tab') {
        e.preventDefault();
        resetEngine();
        return;
      }

      // Ignore modifier keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (['Shift', 'CapsLock', 'Control', 'Alt', 'Meta', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        return;
      }

      // Handle Backspace (strictly blocked if noBackspace is active)
      if (e.key === 'Backspace') {
        e.preventDefault();
        setLastPressedKey('Backspace');
        setTimeout(() => setLastPressedKey(''), 120);

        if (noBackspace) {
          // GHALTI HO GAYE TO CHANGE NAHI HO SAKTI
          playKeySound(soundProfile, false, true);
          setBackspaceLockedWarning(true);
          setTimeout(() => setBackspaceLockedWarning(false), 1200);
          return;
        }

        if (userInput.length > 0) {
          playKeySound(soundProfile, false, false);
          setUserInput((prev) => prev.slice(0, -1));
        }
        return;
      }

      // Only allow 1 character keys
      if (e.key.length !== 1) return;

      e.preventDefault();
      setLastPressedKey(e.key);
      setTimeout(() => setLastPressedKey(''), 120);

      // Start timer on first keystroke
      if (status === 'idle') {
        setStatus('running');
        startTimeRef.current = Date.now();
      }

      const nextCharIndex = userInput.length;
      if (nextCharIndex >= targetText.length) {
        return;
      }

      const expectedChar = targetText[nextCharIndex];
      const typedChar = e.key;
      const isCorrect = typedChar === expectedChar;

      if (!isCorrect) {
        setTotalErrors((prev) => prev + 1);
        setMissedKeys((prev) => ({
          ...prev,
          [expectedChar]: (prev[expectedChar] || 0) + 1,
        }));
        playKeySound(soundProfile, false, true);

        if (suddenDeath) {
          finishTest();
          return;
        }
      } else {
        playKeySound(soundProfile, typedChar === ' ', false);
      }

      const nextInput = userInput + typedChar;
      setUserInput(nextInput);

      if (nextInput.length >= targetText.length) {
        finishTest();
      }
    },
    [finishTest, noBackspace, resetEngine, soundProfile, status, suddenDeath, targetText, userInput]
  );

  // Virtual key press handler
  const handleVirtualKey = useCallback(
    (key: string) => {
      if (status === 'completed') return;

      setLastPressedKey(key);
      setTimeout(() => setLastPressedKey(''), 120);

      if (key === 'Backspace') {
        if (noBackspace) {
          playKeySound(soundProfile, false, true);
          setBackspaceLockedWarning(true);
          setTimeout(() => setBackspaceLockedWarning(false), 1200);
          return;
        }
        if (userInput.length > 0) {
          playKeySound(soundProfile, false, false);
          setUserInput((prev) => prev.slice(0, -1));
        }
        return;
      }

      if (status === 'idle') {
        setStatus('running');
        startTimeRef.current = Date.now();
      }

      const nextCharIndex = userInput.length;
      if (nextCharIndex >= targetText.length) return;

      const expectedChar = targetText[nextCharIndex];
      const typedChar = key;
      const isCorrect = typedChar === expectedChar;

      if (!isCorrect) {
        setTotalErrors((prev) => prev + 1);
        setMissedKeys((prev) => ({
          ...prev,
          [expectedChar]: (prev[expectedChar] || 0) + 1,
        }));
        playKeySound(soundProfile, false, true);
        if (suddenDeath) {
          finishTest();
          return;
        }
      } else {
        playKeySound(soundProfile, typedChar === ' ', false);
      }

      const nextInput = userInput + typedChar;
      setUserInput(nextInput);

      if (nextInput.length >= targetText.length) {
        finishTest();
      }
    },
    [finishTest, noBackspace, soundProfile, status, suddenDeath, targetText, userInput]
  );

  // Compute live metrics
  const activeElapsed = Math.max(elapsedTime, 1);
  const minutes = activeElapsed / 60;
  let correctChars = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === targetText[i]) correctChars++;
  }

  const liveWpm = status === 'idle' ? 0 : Math.round((correctChars / 5) / minutes) || 0;
  const liveRawWpm = status === 'idle' ? 0 : Math.round((userInput.length / 5) / minutes) || 0;
  const liveAccuracy = userInput.length > 0 ? Math.max(0, Math.round((correctChars / userInput.length) * 100)) : 100;
  const progressPercent = Math.min(100, Math.round((userInput.length / targetText.length) * 100));

  return {
    userInput,
    status,
    timeLeft,
    elapsedTime,
    liveWpm,
    liveRawWpm,
    liveAccuracy,
    totalErrors,
    progressPercent,
    currentIndex: userInput.length,
    lastPressedKey,
    backspaceLockedWarning,
    handleKeyDown,
    handleVirtualKey,
    resetEngine,
    finishTest,
  };
}

import { useState, useEffect, useRef } from 'react';
import { useAppState } from './useAppState';
import { audioService } from '@/services/audioService';

export interface LessonPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

export function useLessonPlayer() {
  const [state, setState] = useState<LessonPlayerState>({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
  });

  const appState = useAppState();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Auto-pause when app goes to background
  useEffect(() => {
    if (appState !== 'active' && state.isPlaying) {
      pause();
    }
  }, [appState, state.isPlaying]);

  const play = async (text?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      if (text) {
        await audioService.speakText(text);
      }
      
      startTimeRef.current = Date.now() - state.currentTime * 1000;
      
      setState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isLoading: false,
      }));

      // Start progress tracking
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setState(prev => ({
          ...prev,
          currentTime: elapsed,
        }));
      }, 100);

    } catch (error) {
      console.error('Play error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const pause = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await audioService.stopSpeaking();
    
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }));
  };

  const stop = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await audioService.stopSpeaking();
    
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
    }));
  };

  const resume = () => {
    if (state.isPaused) {
      play();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      audioService.stopSpeaking();
    };
  }, []);

  return {
    state,
    play,
    pause,
    stop,
    resume,
  };
}
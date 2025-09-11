import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Square, Volume2 } from 'lucide-react-native';
import { useLessonPlayer } from '@/hooks/useLessonPlayer';

interface LessonPlayerProps {
  text: string;
  title?: string;
}

export default function LessonPlayer({ text, title }: LessonPlayerProps) {
  const { state, play, pause, stop, resume } = useLessonPlayer();

  const handlePlayPause = () => {
    if (state.isPlaying) {
      pause();
    } else if (state.isPaused) {
      resume();
    } else {
      play(text);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Volume2 size={20} color="#4F46E5" />
        <Text style={styles.title}>{title || 'Lesson Audio'}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.playButton]}
          onPress={handlePlayPause}
          disabled={state.isLoading}
        >
          {state.isLoading ? (
            <Text style={styles.loadingText}>...</Text>
          ) : state.isPlaying ? (
            <Pause size={24} color="#FFFFFF" />
          ) : (
            <Play size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.stopButton]}
          onPress={stop}
          disabled={!state.isPlaying && !state.isPaused}
        >
          <Square size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(state.currentTime)}
          </Text>
        </View>
      </View>

      {(state.isPlaying || state.isPaused) && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: state.duration > 0 ? `${(state.currentTime / state.duration) * 100}%` : '0%' }
              ]} 
            />
          </View>
        </View>
      )}

      {state.isPaused && (
        <Text style={styles.statusText}>Paused - Tap play to continue</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: '#4F46E5',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  timeContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'monospace',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#475569',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
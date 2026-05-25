import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getMoodBasedTracks, searchTracks, SpotifyTrack } from '../services/spotifyService';
import { useTheme } from '../theme/ThemeContext';
import { Logger } from '@/src/utils/logger';

export const useSpotifyMusicSelectorLogic = (
  visible: boolean,
  onClose: () => void,
  onSelectTrack: (track: SpotifyTrack) => void,
  selectedMood?: string | null
) => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    if (visible && selectedMood && !isSearchMode) {
      loadMoodBasedTracks();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [visible, selectedMood]);

  useEffect(() => {
    configureAudio();
  }, []);

  const configureAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      Logger.error('Failed to configure audio settings', 'useSpotifyMusicSelectorLogic.configureAudio', error);
    }
  };

  const loadMoodBasedTracks = async () => {
    if (!selectedMood) return;

    setIsLoading(true);
    try {
      const moodTracks = await getMoodBasedTracks(selectedMood);
      setTracks(moodTracks);
    } catch (error) {
      Logger.error('Failed to load mood-based tracks', 'useSpotifyMusicSelectorLogic.loadMoodBasedTracks', error);
      Alert.alert('Error', 'Failed to load music suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Search Required', 'Please enter a song name or artist.');
      return;
    }

    setIsLoading(true);
    setIsSearchMode(true);
    try {
      const searchResults = await searchTracks(searchQuery);
      setTracks(searchResults);
    } catch (error) {
      Logger.error('Failed to search Spotify tracks', 'useSpotifyMusicSelectorLogic.handleSearch', error);
      Alert.alert('Error', 'Failed to search for music. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const playPreview = async (track: SpotifyTrack) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setPlayingTrackId(null);
      }

      if (playingTrackId === track.id) {
        return;
      }

      if (!track.preview_url) {
        Alert.alert('No Preview', 'This song doesn\'t have a preview available.');
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.preview_url },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingTrackId(track.id);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingTrackId(null);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      Logger.error('Failed to play track preview', 'useSpotifyMusicSelectorLogic.playPreview', error);
      Alert.alert('Playback Error', 'Failed to play song preview.');
    }
  };

  const handleSelectTrack = async (track: SpotifyTrack) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setPlayingTrackId(null);
    }

    onSelectTrack(track);
    onClose();
  };

  const handleClose = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setPlayingTrackId(null);
    }
    
    setSearchQuery('');
    setIsSearchMode(false);
    onClose();
  };

  return {
    theme,
    isDark,
    searchQuery,
    setSearchQuery,
    tracks,
    isLoading,
    playingTrackId,
    isSearchMode,
    setIsSearchMode,
    handleSearch,
    playPreview,
    handleSelectTrack,
    handleClose,
    loadMoodBasedTracks,
  };
};

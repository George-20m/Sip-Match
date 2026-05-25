import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SpotifyTrack } from '../services/spotifyService';
import { useSpotifyMusicSelectorLogic } from '../hooks/useSpotifyMusicSelectorLogic';
import { getStyles } from './styles/SpotifyMusicSelector.styles';

interface SpotifyMusicSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectTrack: (track: SpotifyTrack) => void;
  selectedMood?: string | null;
}

export default function SpotifyMusicSelector({
  visible,
  onClose,
  onSelectTrack,
  selectedMood,
}: SpotifyMusicSelectorProps) {
  const {
    theme,
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
  } = useSpotifyMusicSelectorLogic(visible, onClose, onSelectTrack, selectedMood);

  const styles = useMemo(() => getStyles(theme), [theme]);

  const renderTrackItem = ({ item }: { item: SpotifyTrack }) => {
    const isPlaying = playingTrackId === item.id;
    const albumImage = item.album.images[0]?.url;
    const artistNames = item.artists.map((a) => a.name).join(', ');

    return (
      <TouchableOpacity
        style={styles.trackItem}
        onPress={() => handleSelectTrack(item)}
        activeOpacity={0.7}
      >
        <View style={styles.trackContent}>
          <View style={styles.albumArtContainer}>
            {albumImage ? (
              <Image source={{ uri: albumImage }} style={styles.albumArt} />
            ) : (
              <View style={[styles.albumArt, styles.albumArtPlaceholder]}>
                <MaterialCommunityIcons name="music" size={24} color={theme.secondary} />
              </View>
            )}
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.trackName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {artistNames}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            onPress={() => playPreview(item)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color={isPlaying ? '#1DB954' : theme.secondary}
            />
          </TouchableOpacity>

          {!item.preview_url && (
            <View style={styles.noPreviewBadge}>
              <Text style={styles.noPreviewText}>No preview</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={28} color={theme.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Select Your Mood Song</Text>
            <Text style={styles.headerSubtitle}>
              {isSearchMode ? 'Search results' : `${selectedMood || 'mood'} vibes`}
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search songs or artists..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={20} color={theme.secondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {isSearchMode && selectedMood && (
          <TouchableOpacity
            style={styles.backToMoodButton}
            onPress={() => {
              setIsSearchMode(false);
              setSearchQuery('');
              loadMoodBasedTracks();
            }}
          >
            <MaterialCommunityIcons name="arrow-left" size={16} color={theme.secondary} />
            <Text style={styles.backToMoodText}>Back to {selectedMood} mood</Text>
          </TouchableOpacity>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1DB954" />
            <Text style={styles.loadingText}>Loading music...</Text>
          </View>
        ) : tracks.length > 0 ? (
          <FlatList
            data={tracks}
            renderItem={renderTrackItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="music-off" size={64} color={theme.muted} />
            <Text style={styles.emptyText}>No songs found</Text>
            <Text style={styles.emptySubtext}>Try searching for something else</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

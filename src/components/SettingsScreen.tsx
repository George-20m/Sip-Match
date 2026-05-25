import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSettingsScreenLogic } from '../hooks/useSettingsScreenLogic';
import { getStyles } from './styles/SettingsScreen.styles';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const {
    theme,
    themeType,
    setThemeType,
    isDark,
    userName,
    userEmail,
    userImage,
    avatarLetter,
    hasNameChanged,
    notifications,
    setNotifications,
    spotifyConnected,
    isEditingName,
    editedName,
    setEditedName,
    isSaving,
    isUploadingImage,
    isInitializing,
    showThemeDropdown,
    setShowThemeDropdown,
    userLocation,
    isLoadingLocation,
    fadeAnim,
    slideAnim,
    handleSignOut,
    handleEditName,
    handleCancelEdit,
    handleSaveName,
    handleImagePick,
    handleRemoveImage,
    handleSpotifyConnect,
    handlePrivacyPolicy,
  } = useSettingsScreenLogic(onBack);

  const styles = useMemo(() => getStyles(theme), [theme]);

  const ToggleSwitch = ({ value, onValueChange }: { value: boolean; onValueChange: (value: boolean) => void }) => (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={[styles.switch, value && styles.switchActive]}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.switchThumb, value && styles.switchThumbActive]} />
    </TouchableOpacity>
  );

  if (isInitializing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={{ marginTop: 16, color: theme.secondary, fontSize: 16 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.surface} translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              onPress={handleImagePick}
              activeOpacity={0.8}
              disabled={isUploadingImage}
            >
              {userImage ? (
                <Image source={{ uri: userImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>
              )}
              {isUploadingImage && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              )}
              <View style={styles.editImageBadge}>
                <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{isEditingName ? editedName : userName}</Text>
              {userImage && (
                <TouchableOpacity onPress={handleRemoveImage} style={{ marginTop: 4 }}>
                  <Text style={styles.removeImageText}>Remove picture</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* User Information */}
          <View style={styles.infoSection}>
            <View style={[
              styles.infoItem,
              isEditingName && styles.editingItem,
              isEditingName && styles.noBorder
            ]}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons name="account-outline" size={20} color={theme.secondary} />
              </View>
              <View style={styles.infoTextContainer}>
                <View style={styles.infoHeader}>
                  <Text style={styles.infoLabel}>Name</Text>
                  {!isEditingName && (
                    <TouchableOpacity onPress={handleEditName}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {isEditingName ? (
                  <TextInput
                    style={styles.editInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.textSecondary}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.infoValue}>{userName}</Text>
                )}
              </View>
            </View>

            {isEditingName && (
              <View style={styles.editActionsWrapper}>
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelEdit}
                    disabled={isSaving}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      (!hasNameChanged || isSaving) && styles.saveButtonDisabled
                    ]}
                    onPress={handleSaveName}
                    disabled={!hasNameChanged || isSaving}
                    activeOpacity={0.7}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons name="email-outline" size={20} color={theme.secondary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userEmail}</Text>
              </View>
            </View>

            <View style={[styles.infoItem, styles.noBorder]}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color={theme.secondary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location</Text>
                {isLoadingLocation ? (
                  <ActivityIndicator size="small" color={theme.secondary} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
                ) : (
                  <Text style={styles.infoValue}>{userLocation}</Text>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Preferences Card */}
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Preferences</Text>

          <View>
            <TouchableOpacity 
              style={styles.preferenceItem}
              onPress={() => setShowThemeDropdown(!showThemeDropdown)}
              activeOpacity={0.7}
            >
              <View style={styles.preferenceContent}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.accent : '#EDE9FE' }]}>
                  <MaterialCommunityIcons 
                    name={isDark ? "weather-night" : "weather-sunny"} 
                    size={24} 
                    color={isDark ? theme.primary : "#7C3AED"} 
                  />
                </View>
                <View style={styles.preferenceText}>
                  <Text style={styles.preferenceTitle}>Theme</Text>
                  <Text style={styles.preferenceSubtext}>Customize look and feel</Text>
                </View>
              </View>
              
              <View style={styles.themeTrigger}>
                <Text style={styles.themeTriggerText}>{themeType}</Text>
                <MaterialCommunityIcons
                  name={showThemeDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.primary}
                />
              </View>
            </TouchableOpacity>

            {showThemeDropdown && (
              <View style={styles.dropdown}>
                {(['system', 'light', 'dark'] as const).map((type, index) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.dropdownItem,
                      themeType === type && styles.dropdownItemActive,
                      index !== 2 && styles.dropdownItemBorder
                    ]}
                    onPress={() => {
                      setThemeType(type);
                      setShowThemeDropdown(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.dropdownText,
                      themeType === type && styles.dropdownTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                    {themeType === type && (
                      <MaterialCommunityIcons name="check" size={20} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.preferenceItem, styles.noBorder, { marginTop: 16 }]}>
            <View style={styles.preferenceContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.muted : '#DBEAFE' }]}>
                <MaterialCommunityIcons name="bell-outline" size={24} color={isDark ? theme.secondary : "#2563EB"} />
              </View>
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceTitle}>Notifications</Text>
                <Text style={styles.preferenceSubtext}>Daily drink suggestions</Text>
              </View>
            </View>
            <ToggleSwitch value={notifications} onValueChange={setNotifications} />
          </View>
        </Animated.View>

        {/* Connected Services Card */}
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Connected Services</Text>

          <TouchableOpacity
            style={[styles.preferenceItem, styles.noBorder]}
            onPress={handleSpotifyConnect}
            activeOpacity={0.7}
          >
            <View style={styles.preferenceContent}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? '#0F172A' : '#DCFCE7' }]}>
                <MaterialCommunityIcons name="spotify" size={24} color="#1DB954" />
              </View>
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceTitle}>Spotify</Text>
                <Text style={styles.preferenceSubtext}>
                  {spotifyConnected ? 'Connected' : 'Not connected'}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.secondary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Account Actions */}
        <Animated.View style={[styles.actionsContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePrivacyPolicy}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="shield-check-outline" size={22} color={theme.text} />
            <Text style={styles.actionButtonText}>Privacy Policy</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={theme.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="logout" size={22} color={theme.error} />
            <Text style={[styles.actionButtonText, styles.logoutText]}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Version */}
        <Text style={styles.versionText}>Sip&Match v1.0.0</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

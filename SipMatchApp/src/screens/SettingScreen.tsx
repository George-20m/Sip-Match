// SipMatchApp/src/screens/SettingsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateUsername } from "../api/api";

// Color palette from globals.css
const COLORS = {
  background: '#FFF8E7',
  foreground: '#3E2723',
  card: '#ffffff',
  cardForeground: '#3E2723',
  primary: '#8B4513',
  primaryForeground: '#ffffff',
  secondary: '#F5E6D3',
  secondaryForeground: '#3E2723',
  muted: '#F5E6D3',
  mutedForeground: '#8D6E63',
  accent: '#D4A574',
  accentForeground: '#3E2723',
  destructive: '#d4183d',
  destructiveForeground: '#ffffff',
  border: 'rgba(139, 69, 19, 0.15)',
  inputBackground: '#ffffff',
  switchBackground: '#D4A574',
};

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  userData: {
    userId: string;
    username: string;
    email: string;
  } | null;
  onUpdateUserData?: (user: any) => void;
}

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingsScreen({ onBack, onLogout, userData, onUpdateUserData }: SettingsScreenProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  
  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userData?.username || "User");
  const [isSaving, setIsSaving] = useState(false);

  // Get user data from props or use defaults
  const userName = userData?.username || "User";
  const userEmail = userData?.email || "user@example.com";
  const userId = userData?.userId;
  const userLocation = "Cairo, Egypt"; // Default location
  
  // Get first letter of username for avatar
  const avatarLetter = (isEditingName ? editedName : userName).charAt(0).toUpperCase();

  // Check if name has changed
  const hasNameChanged = editedName.trim() !== userName && editedName.trim().length > 0;

  const ToggleSwitch = ({ value, onValueChange }: ToggleSwitchProps) => (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={[styles.switch, value && styles.switchActive]}
      activeOpacity={0.8}
    >
      <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
    </TouchableOpacity>
  );

  const handleEditName = () => {
    setIsEditingName(true);
    setEditedName(userName);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName(userName);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    if (editedName.trim().length < 3) {
      Alert.alert("Error", "Name must be at least 3 characters long");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID not found. Please try logging in again.");
      console.error("userId is missing:", userData);
      return;
    }

    setIsSaving(true);

    try {
      // Call API using the imported function
      const response = await updateUsername(userId, editedName.trim());

      if (response && response.user) {
        Alert.alert("Success", "Your name has been updated successfully!");
        setIsEditingName(false);
        
        // Update the parent component's userData if callback exists
        if (onUpdateUserData) {
          onUpdateUserData(response.user);
        } else if (userData) {
          // Fallback: update the local userData object
          userData.username = response.user.username;
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error('Error updating name:', error);
      Alert.alert("Error", error.message || "Failed to update name. Please try again.");
      setEditedName(userName); // Reset to original name
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: onLogout,
          style: "destructive"
        }
      ]
    );
  };

  const handleSpotifyConnect = () => {
    Alert.alert(
      "Spotify Integration",
      "Connect your Spotify account to automatically detect your mood from your music! This feature is coming soon.",
      [{ text: "OK" }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "Your privacy is important to us. We collect and use your data to provide personalized drink recommendations based on your mood and preferences.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{isEditingName ? editedName : userName}</Text>
            </View>
          </View>

          {/* User information display */}
          <View style={styles.infoSection}>
            {/* Name Section - Editable */}
            <View style={[
              styles.infoItem, 
              isEditingName && styles.editingItem,
              isEditingName && styles.noBorder
            ]}>
              <View style={styles.infoIconContainer}>
                <Ionicons 
                  name="person-outline" 
                  size={18} 
                  color={COLORS.mutedForeground} 
                />
              </View>
              <View style={styles.infoTextContainer}>
                <View style={styles.infoHeader}>
                  <Text style={styles.infoLabel}>Name</Text>
                  {!isEditingName && (
                    <TouchableOpacity onPress={handleEditName}>
                      <Text style={styles.editText}>Edit name</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {isEditingName ? (
                  <TextInput
                    style={styles.editInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.mutedForeground}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.infoValue}>{userName}</Text>
                )}
              </View>
            </View>

            {/* Action buttons when editing */}
            {isEditingName && (
              <View style={styles.editActionsWrapper}>
                <View style={styles.editActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={handleCancelEdit}
                    disabled={isSaving}
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
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color={COLORS.primaryForeground} />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Email - Read only */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons 
                  name="mail-outline" 
                  size={18} 
                  color={COLORS.mutedForeground} 
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userEmail}</Text>
              </View>
            </View>

            {/* Location - Read only */}
            <View style={[styles.infoItem, styles.noBorder]}>
              <View style={styles.infoIconContainer}>
                <Ionicons 
                  name="location-outline" 
                  size={18} 
                  color={COLORS.mutedForeground} 
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{userLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceContent}>
              <View style={[styles.iconContainer, styles.purpleIcon]}>
                <Ionicons name="moon" size={20} color="#7C3AED" />
              </View>
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceTitle}>Dark Mode</Text>
                <Text style={styles.preferenceSubtext}>Switch to dark theme</Text>
              </View>
            </View>
            <ToggleSwitch value={darkMode} onValueChange={setDarkMode} />
          </View>

          <View style={[styles.preferenceItem, styles.noBorder]}>
            <View style={styles.preferenceContent}>
              <View style={[styles.iconContainer, styles.blueIcon]}>
                <Ionicons name="notifications" size={20} color="#2563EB" />
              </View>
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceTitle}>Notifications</Text>
                <Text style={styles.preferenceSubtext}>Daily drink suggestions</Text>
              </View>
            </View>
            <ToggleSwitch value={notifications} onValueChange={setNotifications} />
          </View>
        </View>

        {/* Connected Services */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connected Services</Text>
          
          <TouchableOpacity
            style={[styles.preferenceItem, styles.noBorder]}
            onPress={handleSpotifyConnect}
            activeOpacity={0.7}
          >
            <View style={styles.preferenceContent}>
              <View style={[styles.iconContainer, styles.greenIcon]}>
                <Ionicons name="musical-notes" size={20} color="#16A34A" />
              </View>
              <View style={styles.preferenceText}>
                <Text style={styles.preferenceTitle}>Spotify</Text>
                <Text style={styles.preferenceSubtext}>
                  {spotifyConnected ? "Connected" : "Not connected"}
                </Text>
              </View>
            </View>
            {spotifyConnected ? (
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={(e) => {
                  e.stopPropagation();
                  setSpotifyConnected(false);
                }}
              >
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            ) : (
              <Ionicons name="chevron-forward" size={20} color={COLORS.mutedForeground} />
            )}
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handlePrivacyPolicy}
            activeOpacity={0.7}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.foreground} />
            <Text style={styles.actionButtonText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.destructive} />
            <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Sip&Match v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.foreground,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: COLORS.primaryForeground,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.foreground,
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  editingItem: {
    paddingBottom: 16,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.mutedForeground,
  },
  editText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.foreground,
    fontWeight: "500",
  },
  editInput: {
    fontSize: 16,
    color: COLORS.foreground,
    fontWeight: "500",
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  editActionsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    paddingLeft: 52,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.foreground,
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.mutedForeground,
    opacity: 0.5,
  },
  saveButtonText: {
    color: COLORS.primaryForeground,
    fontSize: 14,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.foreground,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  preferenceContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  purpleIcon: {
    backgroundColor: "#EDE9FE",
  },
  blueIcon: {
    backgroundColor: "#DBEAFE",
  },
  greenIcon: {
    backgroundColor: "#DCFCE7",
  },
  preferenceText: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.foreground,
    marginBottom: 2,
  },
  preferenceSubtext: {
    fontSize: 14,
    color: COLORS.mutedForeground,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.muted,
    padding: 2,
    justifyContent: "center",
  },
  switchActive: {
    backgroundColor: COLORS.switchBackground,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    alignSelf: "flex-end",
  },
  disconnectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.foreground,
  },
  actionsContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.foreground,
    marginLeft: 12,
  },
  logoutButton: {
    borderColor: 'rgba(212, 24, 61, 0.3)',
    backgroundColor: 'rgba(212, 24, 61, 0.05)',
  },
  logoutText: {
    color: COLORS.destructive,
  },
  versionText: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.mutedForeground,
    marginTop: 24,
    marginBottom: 32,
  },
});
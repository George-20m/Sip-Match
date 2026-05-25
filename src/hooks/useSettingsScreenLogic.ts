import { useAuth, useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';
import { api } from '../../convex/_generated/api';
import { Logger } from '@/src/utils/logger';
import { useTheme } from '../theme/ThemeContext';
import { useUserLocation } from './userLocation';

export const useSettingsScreenLogic = (onBack: () => void) => {
  const { signOut, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const { theme, themeType, setThemeType, isDark } = useTheme();

  // Convex queries and mutations
  const convexUser = useQuery(
    api.users.getCurrentUser,
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  const [notifications, setNotifications] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const {
    location: userLocation,
    isLoading: isLoadingLocation,
  } = useUserLocation();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Initialize user in Convex if not found
  useEffect(() => {
    const initializeUser = async () => {
      if (!clerkUser) return;

      if (convexUser === undefined) {
        return;
      }

      if (convexUser === null) {
        Logger.info('User record not found in Convex, initiating creation', 'useSettingsScreenLogic');
        try {
          const firstName = clerkUser.firstName || clerkUser.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User';
          const email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
          
          await getOrCreateUser({
            clerkId: clerkUser.id,
            email: email,
            userName: firstName,
            authMethod: clerkUser.externalAccounts?.[0]?.provider === 'google' ? 'google' : 'email',
            hasPassword: clerkUser.passwordEnabled || false,
            image: null,
          });

          Logger.success('Successfully created user record in Convex', 'useSettingsScreenLogic');
        } catch (error) {
          Logger.error('Failed to create user record in Convex', 'useSettingsScreenLogic', error);
        }
      }

      setIsInitializing(false);
    };

    initializeUser();
  }, [clerkUser, convexUser]);

  useEffect(() => {
    if (convexUser) {
      setEditedName(convexUser.userName);
    } else if (clerkUser) {
      setEditedName(clerkUser.firstName || clerkUser.username || 'User');
    }
  }, [convexUser, clerkUser]);

  useEffect(() => {
    if (isSignedIn === false) {
      router.replace('/auth');
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isInitializing) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isInitializing]);

  const userName = convexUser?.userName || clerkUser?.firstName || clerkUser?.username || 'User';
  const userEmail = convexUser?.email || clerkUser?.emailAddresses[0]?.emailAddress || 'user@example.com';
  const userImage = convexUser?.image || null;
  const avatarLetter = (isEditingName ? editedName : userName).charAt(0).toUpperCase();
  const hasNameChanged = editedName.trim() !== userName && editedName.trim().length > 0;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Logger.error('Failed to sign out user', 'useSettingsScreenLogic', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

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
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (editedName.trim().length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters long');
      return;
    }

    if (!clerkUser?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setIsSaving(true);

    try {
      await updateUserProfile({
        clerkId: clerkUser.id,
        userName: editedName.trim(),
      });

      await clerkUser.update({
        firstName: editedName.trim(),
      });

      Alert.alert('Success', 'Your name has been updated successfully!');
      setIsEditingName(false);
    } catch (error) {
      Logger.error('Failed to update user name', 'useSettingsScreenLogic', error);
      Alert.alert('Error', 'Failed to update name. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploadingImage(true);
        const asset = result.assets[0];

        try {
          if (!asset.base64) {
            throw new Error('Failed to get base64 image data');
          }

          await clerkUser?.setProfileImage({ 
            file: `data:image/jpeg;base64,${asset.base64}` 
          });

          await new Promise(resolve => setTimeout(resolve, 1500));
          const newImageUrl = clerkUser?.imageUrl;

          if (clerkUser?.id && newImageUrl) {
            await updateUserProfile({
              clerkId: clerkUser.id,
              image: newImageUrl,
            });
          }

          Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
          Logger.error('Failed to upload profile image', 'useSettingsScreenLogic', error);
          Alert.alert('Error', 'Failed to update profile picture. Please try again.');
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (error) {
      Logger.error('Failed to select image from media library', 'useSettingsScreenLogic', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    Alert.alert(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsUploadingImage(true);
              if (clerkUser?.id) {
                await updateUserProfile({
                  clerkId: clerkUser.id,
                  image: null,
                });
              }
              Alert.alert('Success', 'Profile picture removed!');
            } catch (error) {
              Logger.error('Failed to remove profile image', 'useSettingsScreenLogic', error);
              Alert.alert('Error', 'Failed to remove profile picture. Please try again.');
            } finally {
              setIsUploadingImage(false);
            }
          },
        },
      ]
    );
  };

  const handleSpotifyConnect = () => {
    Alert.alert(
      'Spotify Integration 🎵',
      'Connect your Spotify account to automatically detect your mood from your music!\n\nThis feature is coming soon.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your privacy is important to us. We collect and use your data to provide personalized drink recommendations based on your mood and preferences.',
      [{ text: 'OK' }]
    );
  };

  return {
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
    onBack,
  };
};

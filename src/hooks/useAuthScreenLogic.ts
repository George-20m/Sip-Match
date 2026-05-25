import { useOAuth, useSignIn, useSignUp, useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../../convex/_generated/api';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';
import { Logger } from '@/src/utils/logger';

export const useAuthScreenLogic = () => {
  const { isLoaded: signUpLoaded, signUp, setActive: setActiveSignUp } = useSignUp();
  const { isLoaded: signInLoaded, signIn, setActive: setActiveSignIn } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { user } = useUser();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  // State variables
  const [step, setStep] = useState<'email' | 'password' | 'verification'>('email');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const isMountedRef = useRef(true);

  // Helper function to sync user with Convex
  const syncUserWithConvex = async (clerkUserId: string, authMethod: 'google' | 'email', hasPassword: boolean) => {
    try {
      const firstName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User';
      const email = user?.emailAddresses?.[0]?.emailAddress || emailAddress;
      const imageUrl = user?.imageUrl || null;

      Logger.info(`Syncing user with Convex: ${clerkUserId}`, 'useAuthScreenLogic');

      await getOrCreateUser({
        clerkId: clerkUserId,
        email: email,
        userName: firstName,
        authMethod: authMethod,
        hasPassword: hasPassword,
        image: imageUrl,
      });

      Logger.success('User synced with Convex successfully', 'useAuthScreenLogic');
      return true;
    } catch (error) {
      Logger.error('Failed to sync user with Convex', 'useAuthScreenLogic', error);
      // Don't block the flow if Convex sync fails
      return false;
    }
  };

  // Effect to handle reactive user sync
  useEffect(() => {
    if (user?.id) {
      // Sync logic
      const authMethod = user.externalAccounts.length > 0 ? 'google' : 'email';
      const hasPassword = !user.externalAccounts.length;
      
      Logger.info('User detected, initiating sync', 'useAuthScreenLogic');
      syncUserWithConvex(user.id, authMethod, hasPassword);
    }
  }, [user?.id]);

  // Effects
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation();
    };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;

    try {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      Logger.error('Animation error', 'useAuthScreenLogic', error);
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }
  }, [step]);

  // Handlers
  const onEmailSubmit = async () => {
    try {
      if (!signUpLoaded || !signInLoaded || !signIn) {
        Alert.alert('Loading', 'Please wait, authentication is initializing...');
        return;
      }

      if (!emailAddress.trim()) {
        Alert.alert('Oops!', 'Please enter your email address');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }

      setLoading(true);

      try {
        await signIn.create({
          identifier: emailAddress,
        });

        setIsSignUp(false);
        setStep('password');
      } catch (err: any) {
        if (
          err.errors?.[0]?.code === 'form_identifier_not_found' ||
          err.errors?.[0]?.message?.toLowerCase().includes('not found') ||
          err.errors?.[0]?.message?.toLowerCase().includes("couldn't find")
        ) {
          setIsSignUp(true);
          setStep('password');
        } else {
          Alert.alert('Error', err.errors?.[0]?.message || 'Failed to verify email');
        }
      }
    } catch (error: any) {
      Logger.error('Email submission error', 'onEmailSubmit', error);
      Alert.alert(
        'Unexpected Error',
        'Something went wrong while processing your email. Please try again.'
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const onPasswordSubmit = async () => {
    try {
      if (!signUpLoaded || !signInLoaded || !signUp || !signIn) {
        Alert.alert('Loading', 'Please wait, authentication is initializing...');
        return;
      }

      if (!password.trim()) {
        Alert.alert('Oops!', 'Please enter your password');
        return;
      }

      setLoading(true);

      try {
        if (isSignUp) {
          if (password.length < 8) {
            Alert.alert('Weak Password', 'Password must be at least 8 characters');
            setLoading(false);
            return;
          }

          await signUp.create({
            emailAddress,
            password,
          });

          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setStep('verification');
        } else {
          // SIGN IN
          const signInAttempt = await signIn.create({
            identifier: emailAddress,
            password,
          });

          if (signInAttempt.status === 'complete') {
            await setActiveSignIn({ session: signInAttempt.createdSessionId });

            Logger.success('Sign in complete, navigating to home', 'onPasswordSubmit');

            // Navigate immediately
            router.replace('/home');
          } else {
            Alert.alert('Error', 'Sign in failed. Please try again.');
          }
        }
      } catch (err: any) {
        Alert.alert(
          'Authentication Failed',
          err.errors?.[0]?.message || `${isSignUp ? 'Sign up' : 'Sign in'} failed`
        );
      }
    } catch (error: any) {
      Logger.error('Password submission error', 'onPasswordSubmit', error);
      Alert.alert(
        'Unexpected Error',
        'Something went wrong during authentication. Please try again.'
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const onVerificationSubmit = async () => {
    try {
      if (!signUpLoaded || !signUp) {
        Alert.alert('Loading', 'Please wait, verification is initializing...');
        return;
      }

      if (!verificationCode.trim()) {
        Alert.alert('Oops!', 'Please enter the verification code');
        return;
      }

      if (verificationCode.length !== 6) {
        Alert.alert('Invalid Code', 'Please enter a 6-digit code');
        return;
      }

      setLoading(true);

      try {
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code: verificationCode,
        });

        if (signUpAttempt.status === 'complete') {
          await setActiveSignUp({ session: signUpAttempt.createdSessionId });

          Logger.success('Sign up complete, navigating to home', 'onVerificationSubmit');

          // Navigate immediately
          router.replace('/home');
        } else {
          Alert.alert('Verification Failed', 'Please try again.');
        }
      } catch (err: any) {
        Alert.alert('Verification Failed', err.errors?.[0]?.message || 'Invalid code');
      }
    } catch (error: any) {
      Logger.error('Verification error', 'onVerificationSubmit', error);
      Alert.alert(
        'Unexpected Error',
        'Something went wrong during verification. Please try again.'
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const onGoogleAuth = async () => {
    try {
      setLoading(true);
      Logger.info('Starting Google OAuth flow', 'onGoogleAuth');

      const { createdSessionId, setActive } = await startOAuthFlow();

      Logger.info(`OAuth flow returned session: ${!!createdSessionId}`, 'onGoogleAuth');

      if (createdSessionId && setActive) {
        Logger.info('Setting active session', 'onGoogleAuth');
        await setActive({ session: createdSessionId });

        Logger.success('Session activated, redirecting to home', 'onGoogleAuth');

        // Navigate immediately
        router.replace('/home');
      } else {
        Logger.error('OAuth flow failed - no session created', 'onGoogleAuth');
        Alert.alert('Authentication Failed', 'Google sign in did not complete successfully');
      }
    } catch (error: any) {
      Logger.error('Google auth error', 'onGoogleAuth', error);

      // Don't show alert if user cancelled
      if (!error.message?.toLowerCase().includes('cancel')) {
        Alert.alert(
          'Authentication Failed',
          error.message || 'Google sign in failed'
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    try {
      if (step === 'password') {
        setStep('email');
        setPassword('');
        setShowPassword(false);
      } else if (step === 'verification') {
        setStep('password');
        setVerificationCode('');
      }
    } catch (error) {
      Logger.error('Navigation error', 'handleBack', error);
      Alert.alert('Error', 'Failed to go back. Please try again.');
    }
  };

  const handleResendCode = async () => {
    try {
      if (!signUpLoaded || !signUp) {
        Alert.alert('Loading', 'Please wait...');
        return;
      }

      setLoading(true);

      try {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        Alert.alert('Success!', 'Verification code sent to your email');
      } catch (err: any) {
        Alert.alert('Error', err.errors?.[0]?.message || 'Failed to resend code. Please try again.');
      }
    } catch (error: any) {
      Logger.error('Resend code error', 'handleResendCode', error);
      Alert.alert('Unexpected Error', 'Failed to resend verification code. Please try again.');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNavigateToSettings = () => {
    try {
      router.push('/settings');
    } catch (error) {
      Logger.error('Navigation error', 'handleNavigateToSettings', error);
      Alert.alert('Error', 'Failed to open settings. Please try again.');
    }
  };

  // Return everything the component needs
  return {
    // State
    step,
    emailAddress,
    password,
    verificationCode,
    loading,
    isSignUp,
    showPassword,
    // Setters
    setEmailAddress,
    setPassword,
    setVerificationCode,
    // Animation
    fadeAnim,
    slideAnim,
    // Handlers
    onEmailSubmit,
    onPasswordSubmit,
    onVerificationSubmit,
    onGoogleAuth,
    handleBack,
    handleResendCode,
    togglePasswordVisibility,
    // Theme
    theme,
    // Router
    router,
  };
};
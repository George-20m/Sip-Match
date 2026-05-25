import { useSignIn } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';
import { Logger } from '@/src/utils/logger';

export const useForgotPasswordScreenLogic = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [step, setStep] = useState<'email' | 'verification' | 'newPassword'>('email');
  const [emailAddress, setEmailAddress] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const isMountedRef = useRef(true);

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
      Logger.error('Animation error', 'useForgotPasswordScreenLogic', error);
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }
  }, [step]);

  const onEmailSubmit = async () => {
    try {
      if (!isLoaded || !signIn) {
        Alert.alert('Loading', 'Please wait, initialization in progress...');
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
        // Create password reset request
        await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: emailAddress,
        });

        Logger.success('Password reset email sent', 'onEmailSubmit');
        setStep('verification');
      } catch (err: any) {
        Logger.error('Email submission error', 'onEmailSubmit', err);

        if (
          err.errors?.[0]?.code === 'form_identifier_not_found' ||
          err.errors?.[0]?.message?.toLowerCase().includes('not found')
        ) {
          Alert.alert(
            'Email Not Found',
            'No account exists with this email address. Please check your email or sign up for a new account.'
          );
        } else {
          Alert.alert(
            'Error',
            err.errors?.[0]?.message || 'Failed to send reset code. Please try again.'
          );
        }
      }
    } catch (error: any) {
      Logger.error('Unexpected email submission error', 'onEmailSubmit', error);
      Alert.alert(
        'Unexpected Error',
        'Something went wrong. Please try again.'
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const onVerificationSubmit = async () => {
    try {
      if (!isLoaded || !signIn) {
        Alert.alert('Loading', 'Please wait...');
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
        // Verify the code - just checking if it's valid
        await signIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code: verificationCode,
        });

        Logger.success('Reset code verified successfully', 'onVerificationSubmit');
        setStep('newPassword');
      } catch (err: any) {
        Logger.error('Verification error', 'onVerificationSubmit', err);
        Alert.alert(
          'Verification Failed',
          err.errors?.[0]?.message || 'Invalid code. Please try again.'
        );
      }
    } catch (error: any) {
      Logger.error('Unexpected verification error', 'onVerificationSubmit', error);
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

  const onPasswordResetSubmit = async () => {
    try {
      if (!isLoaded || !signIn) {
        Alert.alert('Loading', 'Please wait...');
        return;
      }

      if (!newPassword.trim()) {
        Alert.alert('Oops!', 'Please enter your new password');
        return;
      }

      if (newPassword.length < 8) {
        Alert.alert('Weak Password', 'Password must be at least 8 characters');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Passwords Don\'t Match', 'Please make sure both passwords match');
        return;
      }

      setLoading(true);

      try {
        // Reset the password
        const result = await signIn.resetPassword({
          password: newPassword,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          Logger.success('Password reset successfully completed', 'onPasswordResetSubmit');

          Alert.alert(
            'Success!',
            'Your password has been reset successfully.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/home'),
              },
            ]
          );
        } else {
          Logger.error('Password reset status incomplete', 'onPasswordResetSubmit', result);
          Alert.alert('Error', 'Failed to reset password. Please try again.');
        }
      } catch (err: any) {
        Logger.error('Password reset error', 'onPasswordResetSubmit', err);
        Alert.alert(
          'Reset Failed',
          err.errors?.[0]?.message || 'Failed to reset password. Please try again.'
        );
      }
    } catch (error: any) {
      Logger.error('Unexpected password reset error', 'onPasswordResetSubmit', error);
      Alert.alert(
        'Unexpected Error',
        'Something went wrong. Please try again.'
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    try {
      if (step === 'verification') {
        setStep('email');
        setVerificationCode('');
      } else if (step === 'newPassword') {
        setStep('verification');
        setNewPassword('');
        setConfirmPassword('');
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } else {
        // Go back to auth screen
        router.back();
      }
    } catch (error) {
      Logger.error('Navigation error', 'handleBack', error);
      Alert.alert('Error', 'Failed to go back. Please try again.');
    }
  };

  const handleResendCode = async () => {
    try {
      if (!isLoaded || !signIn) {
        Alert.alert('Loading', 'Please wait...');
        return;
      }

      setLoading(true);

      try {
        await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: emailAddress,
        });

        Logger.success('Verification code resent', 'handleResendCode');
        Alert.alert('Success!', 'Verification code sent to your email');
      } catch (err: any) {
        Logger.error('Resend code error', 'handleResendCode', err);
        Alert.alert(
          'Error',
          err.errors?.[0]?.message || 'Failed to resend code. Please try again.'
        );
      }
    } catch (error: any) {
      Logger.error('Unexpected resend code error', 'handleResendCode', error);
      Alert.alert('Unexpected Error', 'Failed to resend code. Please try again.');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const toggleNewPasswordVisibility = () => setShowNewPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  return {
    theme,
    isDark,
    // State
    step,
    emailAddress,
    verificationCode,
    newPassword,
    confirmPassword,
    loading,
    showNewPassword,
    showConfirmPassword,
    // Setters
    setEmailAddress,
    setVerificationCode,
    setNewPassword,
    setConfirmPassword,
    // Animation
    fadeAnim,
    slideAnim,
    // Handlers
    onEmailSubmit,
    onVerificationSubmit,
    onPasswordResetSubmit,
    handleBack,
    handleResendCode,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
  };
};

// Authentication UI for sign-in, sign-up, and OAuth-based account creation.
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthScreenLogic } from '../hooks/useAuthScreenLogic';
import { Logger } from '@/src/utils/logger';
import React, { useMemo } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { getStyles } from './styles/AuthScreen.styles';

export default function AuthScreen() {
  const {
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
  } = useAuthScreenLogic();

  // We need to get the styles for the component
  const styles = useMemo(() => getStyles(theme), [theme]);

  const ArrowLeft = () => (
    <Text style={{ fontSize: 20, color: theme.secondary, fontWeight: '600' }}>&larr;</Text>
  );

  const GoogleIcon = () => (
    <View style={styles.googleIcon}>
      <Text style={{ fontSize: 18 }}>G</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image with Gradient Overlay */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../../assets/images/Authbackground.jpeg')}
            style={styles.heroImage}
            resizeMode="cover"
            onError={() => Logger.warn('Failed to load hero image', 'AuthScreen')}
          />
          <View style={styles.imageOverlay} />

          {/* Logo or Brand */}
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>☕</Text>
            </View>
            <Text style={styles.brandTitle}>Welcome</Text>
            <Text style={styles.brandSubtitle}>Your journey starts here</Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.contentContainer}>
          <View style={styles.curvedTop} />

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Back Button */}
            {step !== 'email' && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowLeft />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            {/* Email Step */}
            {step === 'email' && (
              <View style={styles.stepContainer}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>Let&apos;s get started</Text>
                  <Text style={styles.stepSubtitle}>Sign in or create a new account</Text>
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={onGoogleAuth}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <GoogleIcon />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#A1887F"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={onEmailSubmit}
                    editable={!loading}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={onEmailSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Processing...' : 'Continue'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            )}

            {/* Password Step */}
            {step === 'password' && (
              <View style={styles.stepContainer}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>
                    {isSignUp ? 'Create your password' : 'Welcome back!'}
                  </Text>
                  <Text style={styles.stepSubtitle}>{emailAddress}</Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder={isSignUp ? 'At least 8 characters' : 'Enter your password'}
                      placeholderTextColor="#A1887F"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      returnKeyType="done"
                      onSubmitEditing={onPasswordSubmit}
                      autoFocus
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIconContainer}
                      onPress={togglePasswordVisibility}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#8D6E63"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {isSignUp && (
                  <View style={styles.passwordHint}>
                    <Text style={styles.passwordHintText}>
                      💡 Use a strong password with letters, numbers, and symbols
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={onPasswordSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading
                      ? isSignUp
                        ? 'Creating your account...'
                        : 'Signing you in...'
                      : isSignUp
                        ? 'Create Account'
                        : 'Sign In'}
                  </Text>
                </TouchableOpacity>

                {!isSignUp && (
                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => router.push('/forgot-password')}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Verification Step */}
            {step === 'verification' && (
              <View style={styles.stepContainer}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>Check your email</Text>
                  <Text style={styles.stepSubtitle}>
                    We&apos;ve sent a 6-digit code to{'\n'}
                    <Text style={styles.emailHighlight}>{emailAddress}</Text>
                  </Text>
                </View>

                <View style={styles.otpContainer}>
                  <Text style={styles.inputLabel}>Verification Code</Text>
                  <TextInput
                    style={[styles.input, styles.otpInput]}
                    placeholder="••••••"
                    placeholderTextColor="#A1887F"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={onVerificationSubmit}
                    autoFocus
                    editable={!loading}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={onVerificationSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
                  <TouchableOpacity onPress={handleResendCode} disabled={loading}>
                    <Text style={styles.resendLink}>Resend</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

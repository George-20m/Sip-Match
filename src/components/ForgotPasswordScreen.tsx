import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForgotPasswordScreenLogic } from '../hooks/useForgotPasswordScreenLogic';
import { getStyles } from './styles/ForgotPasswordScreen.styles';
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

export default function ForgotPasswordScreen() {
  const {
    theme,
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
  } = useForgotPasswordScreenLogic();

  const styles = useMemo(() => getStyles(theme), [theme]);

  const ArrowLeft = () => (
    <Text style={{ fontSize: 20, color: theme.secondary, fontWeight: '600' }}>&larr;</Text>
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
            onError={() => Logger.warn('Failed to load hero image', 'ForgotPasswordScreen')}
          />
          <View style={styles.imageOverlay} />

          {/* Logo or Brand */}
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🔐</Text>
            </View>
            <Text style={styles.brandTitle}>Reset Password</Text>
            <Text style={styles.brandSubtitle}>We&apos;ll help you get back in</Text>
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
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            {/* Email Step */}
            {step === 'email' && (
              <View style={styles.stepContainer}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>Forgot your password?</Text>
                  <Text style={styles.stepSubtitle}>
                    Enter your email and we&apos;ll send you a code to reset your password
                  </Text>
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
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={onEmailSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Sending code...' : 'Send Reset Code'}
                  </Text>
                </TouchableOpacity>
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
                    {loading ? 'Verifying...' : 'Verify Code'}
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

            {/* New Password Step */}
            {step === 'newPassword' && (
              <View style={styles.stepContainer}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>Create new password</Text>
                  <Text style={styles.stepSubtitle}>
                    Choose a strong password for your account
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="At least 8 characters"
                      placeholderTextColor="#A1887F"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                      returnKeyType="next"
                      autoFocus
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIconContainer}
                      onPress={toggleNewPasswordVisibility}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={showNewPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#8D6E63"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#A1887F"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      returnKeyType="done"
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIconContainer}
                      onPress={toggleConfirmPasswordVisibility}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#8D6E63"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.passwordHint}>
                  <Text style={styles.passwordHintText}>
                    💡 Use a strong password with letters, numbers, and symbols
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={onPasswordResetSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Resetting password...' : 'Reset Password'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

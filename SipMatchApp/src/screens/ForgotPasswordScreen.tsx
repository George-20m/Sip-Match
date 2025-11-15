// SipMatchApp\src\screens\ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forgotPassword, resetPassword } from '../api/api';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export default function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const [step, setStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      return Alert.alert('Error', 'Please enter your email');
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const data = await forgotPassword(normalizedEmail);

      console.log('Forgot password response:', data);

      if (data && data.message) {
        Alert.alert(
          'Check Your Email! 📧',
          'If an account exists with this email, you will receive a 6-digit reset code shortly.',
          [{ text: 'OK', onPress: () => setStep('code') }]
        );
      } else {
        Alert.alert('Error', 'Failed to send reset code. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert(
        'Error',
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (!code.trim()) {
      return Alert.alert('Error', 'Please enter the code');
    }
    if (code.length !== 6) {
      return Alert.alert('Error', 'Code must be 6 digits');
    }
    setStep('newPassword');
  };

  const handleResetPassword = async () => {
    if (!code.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return Alert.alert('Error', 'Please fill all fields');
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    if (newPassword.length < 6) {
      return Alert.alert('Error', 'Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const data = await resetPassword(normalizedEmail, code.trim(), newPassword);

      console.log('Reset password response:', data);

      if (data && data.message && data.message.toLowerCase().includes('success')) {
        Alert.alert(
          'Success! ✅',
          'Password reset successful! You can now login with your new password.',
          [{ text: 'Login Now', onPress: onBack }]
        );
      } else {
        Alert.alert(
          'Error',
          data?.message || 'Invalid or expired code. Please try again.'
        );
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#FFF8E7', '#F5E6D3']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color="#8B4513" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="lock-reset" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'code' && 'Check your email for the 6-digit code'}
              {step === 'newPassword' && 'Create your new password'}
            </Text>
          </View>

          <View style={styles.form}>
            {step === 'email' && (
              <>
                <View style={styles.inputContainer}>
                  <Icon name="mail" size={20} color="#8D6E63" style={styles.icon} />
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                    autoCorrect={false}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.mainButton, loading && styles.disabledButton]}
                  onPress={handleSendCode}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.mainButtonText}>
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.infoBox}>
                  <Icon name="info" size={16} color="#8D6E63" />
                  <Text style={styles.infoText}>
                    You'll receive an email with a 6-digit code that expires in 10 minutes.
                  </Text>
                </View>
              </>
            )}

            {step === 'code' && (
              <>
                <View style={styles.codeInfo}>
                  <Icon name="mail" size={16} color="#8D6E63" />
                  <Text style={styles.codeInfoText}>Code sent to: {email}</Text>
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="key" size={20} color="#8D6E63" style={styles.icon} />
                  <TextInput
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChangeText={setCode}
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!loading}
                    autoCorrect={false}
                  />
                </View>

                <TouchableOpacity
                  style={styles.mainButton}
                  onPress={handleVerifyCode}
                  activeOpacity={0.7}
                >
                  <Text style={styles.mainButtonText}>Verify Code</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSendCode}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.resendText, loading && styles.disabledText]}>
                    {loading ? 'Sending...' : 'Resend Code'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.infoBox}>
                  <Icon name="clock" size={16} color="#8D6E63" />
                  <Text style={styles.infoText}>
                    Code expires in 10 minutes. Check your spam folder if you don't see it.
                  </Text>
                </View>
              </>
            )}

            {step === 'newPassword' && (
              <>
                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color="#8D6E63" style={styles.icon} />
                  <TextInput
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    editable={!loading}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="#8D6E63"
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color="#8D6E63" style={styles.icon} />
                  <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                    editable={!loading}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="#8D6E63"
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.mainButton, loading && styles.disabledButton]}
                  onPress={handleResetPassword}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.mainButtonText}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#8B4513',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8D6E63',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  codeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  codeInfoText: {
    color: '#8D6E63',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 16,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#3E2723',
    fontSize: 15,
  },
  eyeIcon: {
    marginLeft: 5,
    padding: 8,
  },
  mainButton: {
    backgroundColor: '#8B4513',
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resendText: {
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  disabledText: {
    opacity: 0.5,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E7',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: '#8D6E63',
    fontSize: 13,
    lineHeight: 18,
  },
});
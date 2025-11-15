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
import { verifyEmail, sendVerificationCode } from '../api/api';
import OTPInput from '../components/OTPInput';

interface EmailVerificationScreenProps {
  email: string;
  username: string;
  password: string;
  onVerificationSuccess: (user: any) => void;
  onBack: () => void;
}

export default function EmailVerificationScreen({ 
  email, 
  username,
  password,
  onVerificationSuccess, 
  onBack 
}: EmailVerificationScreenProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      return Alert.alert('Error', 'Please enter the verification code');
    }

    if (code.length !== 6) {
      return Alert.alert('Error', 'Code must be 6 digits');
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const data = await verifyEmail(normalizedEmail, code.trim());

      if (data && data.token) {
        Alert.alert(
          'Success! 🎉',
          `Welcome to Sip&Match, ${data.user.username}!`,
          [{ text: 'Get Started', onPress: () => onVerificationSuccess(data.user) }]
        );
      } else {
        Alert.alert('Error', data?.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedName = username.trim().charAt(0).toUpperCase() + username.trim().slice(1).toLowerCase();
      
      const data = await sendVerificationCode(normalizedName, normalizedEmail, password);

      if (data && data.message) {
        Alert.alert('Code Resent!', 'A new verification code has been sent to your email.');
      } else {
        Alert.alert('Error', 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('Resend code error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
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
              <MaterialCommunityIcons name="email-check" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.otpContainer}>
              <OTPInput 
                code={code}
                onChangeCode={setCode}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.mainButton, loading && styles.disabledButton]}
              onPress={handleVerifyCode}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.mainButtonText}>
                {loading ? 'Verifying...' : 'Verify Email'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResendCode}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={[styles.resendText, loading && styles.disabledText]}>
                {loading ? 'Sending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Icon name="info" size={16} color="#8D6E63" />
              <Text style={styles.infoText}>
                Check your spam folder if you don't see the email. The code expires in 10 minutes.
              </Text>
            </View>
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
  emailText: {
    fontWeight: '600',
    color: '#8B4513',
  },
  form: {
    width: '100%',
    paddingHorizontal: 10,
  },
  otpContainer: {
    marginBottom: 10,
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
    marginTop: 30,
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
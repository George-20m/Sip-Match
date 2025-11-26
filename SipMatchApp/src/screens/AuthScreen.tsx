// SipMatchApp\src\screens\AuthScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loginUser, sendVerificationCode } from '../api/api';
import styles from '../theme/AuthScreenTheme';

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
  onForgotPassword?: () => void;
  onShowVerification?: (data: {email: string, username: string, password: string}) => void;
}

export default function AuthScreen({ onAuthSuccess, onForgotPassword, onShowVerification }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (activeTab === 'login') {
      // Login
      if (!email || !password) {
        return Alert.alert('Error', 'Please fill all fields');
      }

      setLoading(true);
      try {
        // Convert email to lowercase
        const normalizedEmail = email.trim().toLowerCase();

        const res = await loginUser(normalizedEmail, password);
        if (res.token) {
          Alert.alert('Success', `Welcome back, ${res.user.username || 'User'}!`, [
            {
              text: 'OK',
              onPress: () => {
                console.log('JWT Token:', res.token);
                console.log('User Data:', res.user);
                onAuthSuccess(res.user);
              }
            }
          ]);
        } else {
          Alert.alert('Login Failed', res.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error', 'Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Sign Up - Send verification code
      if (!name || !email || !password || !confirmPassword) {
        return Alert.alert('Error', 'Please fill all fields');
      }

      if (password !== confirmPassword) {
        return Alert.alert('Error', 'Passwords do not match');
      }

      setLoading(true);
      try {
        // Normalize username: trim, capitalize first letter, lowercase rest
        const trimmedName = name.trim();
        const normalizedName = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1).toLowerCase();
        
        // Convert email to lowercase
        const normalizedEmail = email.trim().toLowerCase();

        const res = await sendVerificationCode(normalizedName, normalizedEmail, password);
        
        if (res && res.message) {
          Alert.alert(
            'Check Your Email! 📧',
            'We\'ve sent a verification code to your email. Please enter it to complete registration.',
            [{
              text: 'OK',
              onPress: () => {
                if (onShowVerification) {
                  onShowVerification({
                    email: normalizedEmail,
                    username: normalizedName,
                    password: password
                  });
                }
              }
            }]
          );
        } else {
          Alert.alert('Signup Failed', res.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('Signup error:', error);
        Alert.alert('Error', 'Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      Alert.alert('Coming Soon', 'Password reset feature will be available soon!');
    }
  };

  return (
    <LinearGradient colors={['#FFF8E7', '#F5E6D3']} style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="coffee" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Sip&Match</Text>
        <Text style={styles.subtitle}>Your personalized drink companion</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'login' && styles.activeTab]}
          onPress={() => setActiveTab('login')}
          disabled={loading}
        >
          <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
          onPress={() => setActiveTab('signup')}
          disabled={loading}
        >
          <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Name (Sign Up only) */}
        {activeTab === 'signup' && (
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#8D6E63" style={styles.icon} />
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              editable={!loading}
            />
          </View>
        )}

        {/* Email */}
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
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#8D6E63" style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="#8D6E63"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password (Sign Up only) */}
        {activeTab === 'signup' && (
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#8D6E63" style={styles.icon} />
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#8D6E63"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Forgot Password (Login only) */}
        {activeTab === 'login' && (
          <TouchableOpacity 
            onPress={handleForgotPassword}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        {/* Main Button */}
        <TouchableOpacity 
          style={[styles.mainButton, loading && styles.disabledButton]} 
          onPress={handleAuth}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.mainButtonText}>
            {loading 
              ? (activeTab === 'login' ? 'Logging in...' : 'Sending Code...') 
              : (activeTab === 'login' ? 'Login' : 'Create Account')
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Buttons */}
      <TouchableOpacity style={styles.socialButton} disabled={loading}>
        <MaterialCommunityIcons name="google" size={20} color="#3E2723" style={{ marginRight: 10 }} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} disabled={loading}>
        <MaterialCommunityIcons name="spotify" size={20} color="#3E2723" style={{ marginRight: 10 }} />
        <Text style={styles.socialText}>Connect with Spotify</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
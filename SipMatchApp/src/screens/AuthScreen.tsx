// AuthScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { registerUser, loginUser } from '../api/api';

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void; // Pass user data to parent
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = async () => {
    if (activeTab === 'login') {
      // Login
      if (!email || !password) {
        return Alert.alert('Error', 'Please fill all fields');
      }

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
              // Pass the user data to App.js
              onAuthSuccess(res.user);
            }
          }
        ]);
      } else {
        Alert.alert('Login Failed', res.message || 'Something went wrong');
      }
    } else {
      // Sign Up
      if (!name || !email || !password || !confirmPassword) {
        return Alert.alert('Error', 'Please fill all fields');
      }

      if (password !== confirmPassword) {
        return Alert.alert('Error', 'Passwords do not match');
      }

      // Normalize username: trim, capitalize first letter, lowercase rest
      const trimmedName = name.trim();
      const normalizedName = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1).toLowerCase();
      
      // Convert email to lowercase
      const normalizedEmail = email.trim().toLowerCase();

      const res = await registerUser(normalizedName, normalizedEmail, password);
      if (res.token) {
        Alert.alert('Success', `Welcome ${res.user.username || 'User'}!`, [
          {
            text: 'OK',
            onPress: () => {
              console.log('JWT Token:', res.token);
              console.log('User Data:', res.user);
              // Pass the user data to App.js
              onAuthSuccess(res.user);
            }
          }
        ]);
      } else {
        Alert.alert('Signup Failed', res.message || 'Something went wrong');
      }
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
        >
          <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
          onPress={() => setActiveTab('signup')}
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
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        {/* Main Button */}
        <TouchableOpacity style={styles.mainButton} onPress={handleAuth}>
          <Text style={styles.mainButtonText}>
            {activeTab === 'login' ? 'Login' : 'Create Account'}
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
      <TouchableOpacity style={styles.socialButton}>
        <MaterialCommunityIcons name="google" size={20} color="#3E2723" style={{ marginRight: 10 }} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <MaterialCommunityIcons name="spotify" size={20} color="#3E2723" style={{ marginRight: 10 }} />
        <Text style={styles.socialText}>Connect with Spotify</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#8B4513',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B4513',
  },
  subtitle: {
    color: '#8D6E63',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5E6D3',
    borderRadius: 25,
    padding: 3,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#8D6E63',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3E2723',
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
    paddingHorizontal: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 45,
    color: '#3E2723',
  },
  eyeIcon: {
    marginLeft: 5,
  },
  forgot: {
    alignSelf: 'flex-end',
    color: '#8B4513',
    marginBottom: 10,
  },
  mainButton: {
    backgroundColor: '#8B4513',
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D4A574',
  },
  dividerText: {
    color: '#8D6E63',
    marginHorizontal: 10,
    fontSize: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#D4A574',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#FFF8E7',
  },
  socialText: {
    color: '#3E2723',
  },
});
const API_URL = 'http://192.168.1.2:3000/api/auth'; 

// Send verification code (Step 1 of signup)
export const sendVerificationCode = async (username, email, password) => {
  try {
    console.log('🔵 Sending verification code...');
    const response = await fetch(`${API_URL}/send-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    console.log('📧 Verification response:', data);
    return data;
  } catch (error) {
    console.error('Send verification error:', error);
    throw new Error('Network error');
  }
};

// Verify email with code (Step 2 of signup)
export const verifyEmail = async (email, code) => {
  try {
    console.log('🔵 Verifying email code...');
    const response = await fetch(`${API_URL}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    console.log('✅ Verification result:', data);
    return data;
  } catch (error) {
    console.error('Verify email error:', error);
    throw new Error('Network error');
  }
};

// Original register (keeping for backward compatibility)
export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    return await response.json();
  } catch (error) {
    console.error('Register error:', error);
    throw new Error('Network error');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Network error');
  }
};

export const forgotPassword = async (email) => {
  try {
    console.log('🔵 Sending forgot password request...');
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Response error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Success response:', data);
    return data;
  } catch (error) {
    console.error('❌ Forgot password API error:', error);
    throw error;
  }
};

export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Reset password API error:', error);
    throw error;
  }
};
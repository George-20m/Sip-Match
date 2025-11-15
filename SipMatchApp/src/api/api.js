const API_URL = 'http://192.168.1.2:3000/api/auth'; // your backend IP + port

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

// FIXED: Removed duplicate /auth from URL
export const forgotPassword = async (email) => {
  try {
    console.log('🔵 Sending forgot password request to:', `${API_URL}/forgot-password`);
    console.log('📧 Email:', email);
    
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    console.log('📡 Response status:', response.status);
    
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
    console.error('Error details:', error.message);
    throw error;
  }
};

// FIXED: Removed duplicate /auth from URL
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
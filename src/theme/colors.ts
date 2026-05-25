// app/theme/colors.ts

export const lightColors = {
  isDark: false,
  background: '#FFFAF0', // Floral White
  surface: '#FFFFFF', // White
  primary: '#3E2723', // Dark Brown
  secondary: '#8D6E63', // Coffee/Light Brown
  accent: '#F5E6D3', // Beige/Cream
  text: '#3E2723', // Dark Brown
  textSecondary: '#8D6E63', // Light Brown
  border: '#F5E6D3', // Beige
  error: '#DC2626',
  success: '#1DB954',
  card: '#FFFFFF',
  muted: '#E0E0E0',
  tabBar: '#FFFFFF',
  tabBarActive: '#3E2723',
  tabBarInactive: '#8D6E63',
};

export const darkColors = {
  isDark: true,
  background: '#000000', // True Black (Onyx)
  surface: '#121212', // Deep Slate
  primary: '#D1D5DB', // Light Grey (replacing white for better visibility)
  secondary: '#9CA3AF', // Medium Silver
  accent: '#1E1E1E', // Dark Grey
  text: '#F9FAFB', // High Contrast Off-White
  textSecondary: '#9CA3AF', // Medium Grey
  border: '#2C2C2C', // Slate Border
  error: '#FF453A', // iOS-style System Red
  success: '#32D74B', // iOS-style System Green
  card: '#121212',
  muted: '#1E1E1E',
  tabBar: '#000000',
  tabBarActive: '#D1D5DB',
  tabBarInactive: '#9CA3AF',
};

export type ThemeColors = typeof lightColors;

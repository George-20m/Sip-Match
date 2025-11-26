import { StyleSheet, StatusBar } from 'react-native';

const COLORS = {
  background: '#FFF8E7',
  foreground: '#3E2723',
  card: '#ffffff',
  primary: '#8B4513',
  primaryForeground: '#ffffff',
  secondary: '#F5E6D3',
  mutedForeground: '#8D6E63',
  border: 'rgba(139, 69, 19, 0.15)',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 12,
    paddingBottom: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 40,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 400,
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.foreground,
    opacity: 0.6,
    marginBottom: 24,
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.mutedForeground,
    marginTop: 24,
    marginBottom: 32,
  },
});
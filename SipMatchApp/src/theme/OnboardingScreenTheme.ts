import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
    skipButton: {
    position: 'absolute',
    top: 60,
    right: 25,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#6B4E2E',
    fontWeight: '500',
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4B2E05',
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    color: '#6B4E2E',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B4513',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 30,
    paddingHorizontal: 120,
    paddingVertical: 12,
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 5,
  },
  iconCircle: {
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBackground: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});
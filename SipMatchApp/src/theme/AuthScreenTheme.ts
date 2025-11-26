import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
    fontSize: 14,
    fontWeight: '500',
  },
  mainButton: {
    backgroundColor: '#8B4513',
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
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
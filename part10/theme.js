import { Platform } from 'react-native';

const colors = {
  primary: '#0366d6',
  appBar: '#24292e',
  mainBackground: '#e1e4e8',
  repositoryItem: '#ffffff',
  textPrimary: '#24292e',
  textSecondary: '#586069',
};

const fontFamily = Platform.select({
  android: 'Roboto',
  ios: 'Arial',
  default: 'System',
});

export default { colors, fontFamily };

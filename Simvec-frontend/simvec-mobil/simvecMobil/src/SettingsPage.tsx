import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

function SettingsPage({ navigation }) {
  const { t, i18n } = useTranslation();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Toggle notification settings
  const toggleNotifications = () => setIsNotificationsEnabled(previousState => !previousState);

  // Toggle theme settings
  const toggleTheme = () => setIsDarkTheme(previousState => !previousState);

  // Function to handle navigation back to the main page or user profile
  const handleBackToProfile = () => {
    navigation.navigate('UserProfile');
  };

  // Function to toggle between English and French
  const toggleLanguage = () => {
    let newLang;
    switch (i18n.language) {
      case 'en':
        newLang = 'fr';
        break;
      case 'fr':
        newLang = 'tr';
        break;
      case 'tr':
        newLang = 'en';
        break;
      default:
        newLang = 'en';  // Default to English if current language is unrecognized
    }
    i18n.changeLanguage(newLang);
  };


  return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('Settings')}</Text>

        <View style={styles.setting}>
          <Text style={styles.settingText}>{t('Enable Notifications')}</Text>
          <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotifications}
              value={isNotificationsEnabled}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingText}>{t('Dark Theme')}</Text>
          <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isDarkTheme ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkTheme}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title={t('Back to Profile')} onPress={handleBackToProfile} color="#ff6347" />
          <Button
              title={t('Change Language')}
              onPress={toggleLanguage}
              color="#007BFF"
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  settingText: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});

export default SettingsPage;

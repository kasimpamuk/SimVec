import React, {useState} from 'react';
import {View, Text, Switch, Button, StyleSheet} from 'react-native';

function SettingsPage({navigation}) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Toggle notification settings
  const toggleNotifications = () =>
    setIsNotificationsEnabled(previousState => !previousState);

  // Toggle theme settings
  const toggleTheme = () => setIsDarkTheme(previousState => !previousState);

  // Function to handle navigation back to the main page or user profile
  const handleBackToProfile = () => {
    navigation.navigate('User');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Enable Notifications</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isNotificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleNotifications}
          value={isNotificationsEnabled}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Dark Theme</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isDarkTheme ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleTheme}
          value={isDarkTheme}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Back to Profile"
          onPress={handleBackToProfile}
          color="#ff6347"
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
    width: '60%',
  },
});

export default SettingsPage;

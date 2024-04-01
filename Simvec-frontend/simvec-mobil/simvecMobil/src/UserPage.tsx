import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';

function UserPage({ navigation }) {

  const userInfo = {
    name: 'admin',
    email: 'admin@example.com',
    profilePic: 'https://www.pngwing.com/en/free-png-xsukd',
  };

  // Function to handle logout logic, for now, it just navigates back to the main page.
  const handleLogout = () => {
    navigation.navigate('Main');
  };

  // Function to navigate to edit profile page (which you will have to create)
  const handleEditProfile = () => {
    //navigation.navigate('Main');
    // navigation.navigate('EditProfile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{userInfo.name}</Text>
      <Text style={styles.email}>{userInfo.email}</Text>
      <Button title="Edit Profile" onPress={handleEditProfile} color="#ff6347" />
      <Button title="Log Out" onPress={handleLogout} color="#ff6347" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default UserPage;

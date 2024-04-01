import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, StyleSheet } from 'react-native';
import logo from './assets/user-profile-icon.jpg';
function UserPage({ navigation }) {
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Function to toggle password visibility
   const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
   };

  const userInfo = {
    name: 'admin',
    email: 'admin@example.com',
    password: 'password',
    profilePic: 'https://tr.pngtree.com/freepng/vector-user-young-boy-avatar-icon_4827810.html',
    photoCount: 98,
  };

  // Function to handle logout logic
  const handleLogout = () => {
    // TODO
    navigation.navigate('Login');
  };

  // Function to navigate to edit profile page
  const handleEditProfile = () => {
    // TODO
    // navigation.navigate('EditProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={logo} style={styles.profilePic} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userInfo.name}</Text>
          <Text style={styles.email}>{userInfo.email}</Text>
          <Text style={styles.password}>Password: {isPasswordVisible ? 'password123' : '••••••••'}</Text>
          <TouchableOpacity style={styles.showPassword} onPress={togglePasswordVisibility}>
             <Text style={styles.showPasswordText}>Show Password</Text>
          </TouchableOpacity>
          <Text style={styles.photoCount}>Photo Count: {userInfo.photoCount}</Text>
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <View style={styles.buttonContainer}>
            <Button title="Edit Profile" onPress={handleEditProfile} color="#ff6347" />
        </View>
        <View style={styles.buttonContainer}>
            <Button title="Log Out" onPress={handleLogout} color="#ff6347" />
        </View>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '90%',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  password: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  photoCount: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  buttonGroup: {
    marginTop: 150,
    width: '85%',
  },
  buttonContainer: {
      marginBottom: 15,
  },
  showPassword: {
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderRadius: 4,
    backgroundColor: 'orange',
    alignSelf: 'flex-start',
    marginTop: -3,
    marginBottom: 8,
  },
  showPasswordText: {
      color: 'white',
      fontSize: 12
  },
  profilePic: {
      width: 120,
      height: 120,
      borderRadius: 50,
      marginBottom: 10,
  },
  logo: {
    width:22,
    height:22,
    resizeMode: 'contain'
  }
});

export default UserPage;

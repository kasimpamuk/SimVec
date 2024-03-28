import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
// Assuming simvec.png is correctly placed in your assets folder
import logo from './assets/simvec.png';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  // Get the navigation prop
  const navigation = useNavigation();

  const handleSubmit = async () => {
    navigation.navigate('Main'); // Use the correct name of your main page route
  };

  return (
    <>
      <View style={styles.imageHeader}>
        <Image source={logo} style={styles.websiteLogo} resizeMode="contain" />
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.header}></View>
          <View style={styles.registerContainer}>
            <Text style={styles.registerHeading}>Register</Text>

            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Name"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              secureTextEntry={true}
              autoCapitalize="none"
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <Button
              onPress={handleSubmit}
              title="Register"
              color="#841584" // Example color
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  header: {},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4', // A light grey background
  },
  imageHeader: {
    width: '100%', // The header takes the full width of the screen
    paddingBottom: 20, // Adds some space below the logo
    backgroundColor: '#ffffff', // A white background for the header
    borderBottomWidth: 1, // A line to separate the header from the content
    borderColor: '#e0e0e0', // Light grey border color
  },
  websiteLogo: {
    width: '90%', // Less than 100% to give some padding on the sides
    height: 120, // A bit larger height for a prominent logo
    marginTop: 50, // Move the logo down a bit from the top of the screen
    alignSelf: 'center',
  },
  registerContainer: {
    width: '90%', // Make the container a bit narrower for tablet and large screen support
    borderRadius: 10, // Rounded corners
    backgroundColor: '#ffffff', // A white background for the form
    padding: 20, // Inside padding
    elevation: 3, // Shadow for Android
    shadowColor: '#000000', // Shadow color for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow blur for iOS
    marginTop: -60, // Pull the register container up to overlap the logo
  },
  registerHeading: {
    fontSize: 28,
    fontWeight: '700', // A bolder weight for the heading
    color: '#333333', // A darker color for the text
    marginBottom: 30, // More space below the heading
    textAlign: 'center', // Center align the text
  },
  input: {
    height: 50, // A taller input for easier touch
    marginBottom: 15, // Increase space between inputs
    borderWidth: 1,
    borderColor: '#cccccc', // A lighter border color
    borderRadius: 5, // Rounded corners for the input fields
    padding: 10,
    backgroundColor: '#ffffff', // A white background for the input
    fontSize: 16, // Slightly larger font size
  },
});

export default RegisterPage;

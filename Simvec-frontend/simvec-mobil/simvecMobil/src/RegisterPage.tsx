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
import { launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import logo from './assets/simvec.png';

function RegisterPage() {
  // Existing state declarations
  const [media, setMedia] = useState(null);


  const requestMediaPermission = async () => {
    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return result === 'granted';
  };

  const pickMedia = async () => {
    const permissionGranted = await requestMediaPermission();
    if (permissionGranted) {
      launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          setMedia(response.assets[0]);
        }
      });
    }
  };

  const handleSubmit = async () => {
    // Modified to include media upload logic
    const userData = new FormData();
    userData.append('userName', name);
    userData.append('email', email);
    userData.append('password', password);

    if (media) {
      userData.append('media', {
        name: media.fileName,
        type: media.type,
        uri: media.uri,
      });
    }

    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          // Set formdata accordinglyy
        },
        body: userData,
      });

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('Error:', error);

    }
  };


  return (
      <>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.imageHeader}>
              <Image source={logo} style={styles.websiteLogo} />
            </View>
            <View style={styles.registerContainer}>
              <Text style={styles.registerHeading}>Register</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Name"
                  onChangeText={(text) => setName(text)}
              />
              <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={(text) => setEmail(text)}
              />
              <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(text) => setPassword(text)}
              />
              <Button title="Pick Media" onPress={pickMedia} />
              <Button title="Register" onPress={handleSubmit} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </>
  );
}
export default RegisterPage;


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

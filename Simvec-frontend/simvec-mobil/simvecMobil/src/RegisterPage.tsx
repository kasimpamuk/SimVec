import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Assuming simvec.png is correctly placed in your assets folder
import logo from './assets/simvec.png';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const selectImages = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0,  // Allows multiple selections
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImages(images.concat(response.assets));
      }
    });
  };

  const handleSubmit = async () => {
    const userData = {
      userName: name,
      email: email,
      password: password,
    };

    try {
      const formData = new FormData();
      images.forEach((img, index) => {
        formData.append('images', {
          name: 'image' + index + '.jpg',
          type: img.type,
          uri: img.uri,
        });
      });

      formData.append('userData', JSON.stringify(userData));

      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseBody = await response.json();
      if (!response.ok) {
        setErrors(responseBody);
        console.error('Registration failed:', responseBody);
        
      } else {
        console.log('Registration successful!');
        setErrors({});
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
      <>
        <View style={styles.imageHeader}>
          <Image source={logo} style={styles.websiteLogo} resizeMode="contain" />
        </View>
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
              <View style={styles.registerContainer}>
                <Text style={styles.registerHeading}>{t('Register')}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder={t('Name')}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholder={t('Email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder={t('Password')}
                    secureTextEntry={true}
                    autoCapitalize="none"
                />
                {errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                )}
                <Button
                    onPress={selectImages}
                    title={t('Select Images')}
                    color="#841584"
                />
                {images.map((img, index) => (
                    <Image key={index} source={{ uri: img.uri }} style={styles.imagePreview} />
                ))}
                <Button
                    onPress={handleSubmit}
                    title={t('Register')}
                    color="#841584" // Example color
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </>
  );
}

const styles = StyleSheet.create({
  header: {},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  imageHeader: {
    width: '100%',
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  websiteLogo: {
    width: '90%',
    height: 120,
    marginTop: 50,
    alignSelf: 'center',
  },
  registerContainer: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: -60,
  },
  registerHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default RegisterPage;

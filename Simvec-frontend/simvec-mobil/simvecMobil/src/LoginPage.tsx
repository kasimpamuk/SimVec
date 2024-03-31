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

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  // Get the navigation prop
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData);
        console.error('Login failed:', errorData);
      } else {
        console.log('Login successful!');
        setErrors('');
        navigation.navigate('Main'); // Adjust with your main page route name
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
      <>
        <View style={styles.imageHeader}>
          <Image source={logo} style={styles.websiteLogo} resizeMode="contain" />
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <View style={styles.header}></View>
            <View style={styles.loginContainer}>
              <Text style={styles.loginHeading}>Login</Text>

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
                  title="Login"
                  color="#841584" // Example color
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </>
  );
}

const styles = StyleSheet.create({
  // Styles are similar to RegisterPage, adjust if needed
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
  loginContainer: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: -60,
  },
  loginHeading: {
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
  // Include styles for error messages if you have them in your design
});

export default LoginPage;

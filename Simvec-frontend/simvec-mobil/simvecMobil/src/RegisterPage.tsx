import React, {useState} from 'react';
import {View, Text, TextInput, Button, Image, StyleSheet} from 'react-native';
// Assuming simvec.png is correctly placed in your assets folder
import logo from './assets/simvec.png';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // In React Native, form submission would typically involve calling an API directly here
    console.log('Registering with:', name, email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.websiteLogo} />
      </View>
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

        <Button
          onPress={handleSubmit}
          title="Register"
          color="#841584" // Example color
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
  },
  header: {
    marginBottom: 20,
  },
  websiteLogo: {
    width: 100, // Set your desired size
    height: 100, // Set your desired size
  },
  registerContainer: {
    width: '80%',
  },
  registerHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default RegisterPage;

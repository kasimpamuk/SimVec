import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './src/LoginPage'; // Make sure LoginPage is adapted for React Native
import MainPage from './src/MainPage'; // Make sure MainPage is adapted for React Native
import RegisterPage from './src/RegisterPage'; // Make sure RegisterPage is adapted for React Native

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterPage}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Main"
          component={MainPage}
          options={{headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

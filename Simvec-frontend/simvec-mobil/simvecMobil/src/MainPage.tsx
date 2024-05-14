import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { toByteArray as btoa } from 'base64-js';
import logo from './assets/simvec.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MainPage() {
  const [text, setText] = useState('');
  const [searchNumber, setSearchNumber] = useState(5);
  const [imageList, setImageList] = useState([]);
  const [image, setImage] = useState<{ uri: string; base64?: string } | null>(null);
  const navigation = useNavigation();

  const data = {
    input: text,
    topk: searchNumber
  };

  const handleTextSubmit = async (e) => {
  e.preventDefault();
    if (!text) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch(
          'http://10.0.2.2:8080/api/text-based-search',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
          },
      );

      const base64Images = await response.json();

       const urls = base64Images.map(base64 => `data:image/jpeg;base64,${base64}`);
      setImageList(urls);
      console.log(imageList);
      console.error(urls);
    } catch (error) {
      console.error('Error processing text:', error);
      Alert.alert('Error', 'Error processing text');
    }
  };

  const handleImageChange = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets![0].uri, base64: response.assets![0].base64 };
        setImage(source);
      }
    });
  };

  const handleImageSubmit = async () => {
    if (!image || !image.base64) {
      Alert.alert("Error", "Please select an image to upload");
      return;
    }
    const imageData = {
      image: image.base64,
      searchNumber: searchNumber
    };

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`http://10.0.2.2:8080/api/image-based-search/${searchNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(imageData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const base64Images: string[] = await response.json();
      const urls = base64Images.map(base64 => `data:image/jpeg;base64,${base64}`);
      setImageList(urls);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Error uploading image");
    }
  };

  return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.header}>
            <Button title="User Page"
                onPress={() => navigation.navigate('User')}
                color="#ff0000"
            />
        </View>
        <View style={styles.header}>
                    <Button title="Settings"
                        onPress={() => navigation.navigate('Settings')}
                        color="#ff0000"
                    />
         </View>
        <View style={styles.textAreaContainer}>
          <Text style={styles.label}>Enter text for search:</Text>
          <TextInput
              style={styles.textArea}
              value={text}
              onChangeText={setText}
              placeholder="Type here..."
              multiline
          />
        </View>
        <Button title="Submit Text" onPress={handleTextSubmit} color="#32cd32" />
        <TouchableOpacity style={styles.imagePicker} onPress={handleImageChange}>
          {image ? (
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          ) : (
              <Text style={styles.imagePickerText}>Tap to select an image</Text>
          )}
        </TouchableOpacity>
        <Button title="Upload Image" onPress={handleImageSubmit} color="#32cd32" />

        {imageList.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.subheading}>Returned Images:</Text>
              {imageList.map((imgSrc, index) => (
                  <Image
                      key={index}
                      source={{ uri: imgSrc }}
                      style={styles.resultImage}
                  />
              ))}
            </View>
        )}

        <View style ={styles.header}>
            <Button
                title="Synchronize"
                onPress={() => Alert.alert('Synchronization', 'Synchronization in progress...')}
                color="#32cd32"
            />
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  logo: {
    width: '60%',
    height: 120,
  },
  textAreaContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    color: '#555',
    marginBottom: 5,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    height: 100,
    fontSize: 16,
    textAlignVertical: 'top',
    color: '#333',
  },
  imagePicker: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d7d7d7',
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    height: 200,
    marginHorizontal: 20,
  },
  imagePickerText: {
    color: '#808080',
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  resultsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  resultImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },

});

export default MainPage;

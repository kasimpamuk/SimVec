import React, {useState} from 'react';
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
// Assuming simvec.png is correctly placed in your assets folder
import logo from './assets/simvec.png';

function MainPage() {
  const [text, setText] = useState('');
  const [searchNumber, setSearchNumber] = useState(5);
  const [imageList, setImageList] = useState([]);
  const data = {
    input: text,
    topk: searchNumber,
  };
  const handleTextSubmit = async e => {
    e.preventDefault();
    if (!text) {
      alert('Please enter some text');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/text-based-search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      const base64Images = await response.json();
      const urls = base64Images.map(
        base64 => `data:image/jpeg;base64,${base64}`,
      );
      setImageList(urls);
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Error processing text');
    }
  };

  // Simulated synchronization function
  const handleSynchronization = () => {
    Alert.alert('Synchronization', 'Synchronization in progress...');
    // Place your synchronization logic here
  };

  const handleNumberChange = e => {
    setSearchNumber(e.target.value);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Button
          title="Synchronize"
          onPress={handleSynchronization}
          color="#32cd32"
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

      {imageList.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.subheading}>Returned Images:</Text>
          {imageList.map((imgSrc, index) => (
            <Image
              key={index}
              source={{uri: imgSrc}}
              style={styles.resultImage}
            />
          ))}
        </View>
      )}
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
  content: {
    padding: 20,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  textAreaContainer: {
    marginBottom: 20,
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
  resultsContainer: {
    marginTop: 20,
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

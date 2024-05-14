import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Slider from '@react-native-community/slider';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faGear, faRotate, faCamera } from '@fortawesome/free-solid-svg-icons';
import RNFS from 'react-native-fs';
import ImageCropPicker from 'react-native-image-crop-picker';
import logo from './assets/simvec.png';

function MainPage() {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState('');
  const [searchNumber, setSearchNumber] = useState(5);
  const [imageList, setImageList] = useState([]);
  const [imageFilesName, setImageFilesName] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const handlePressIn = () => setIsButtonPressed(true);
  const handlePressOut = () => setIsButtonPressed(false);
  const slideAnim = new Animated.Value(0);
  const [image, setImage] = useState<{ uri: string; base64?: string } | null>(null);
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const buttonWidth = screenWidth / 3;
  const data = {
    input: text,
    topk: searchNumber,
  };

  const user_info = {
    username: 'alper',
  };

  const handleTextSubmit = async e => {
    e.preventDefault();
    if (!text) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8080/api/text-based-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (isModalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleImageChange = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      setImage({
        uri: image.path,
        base64: image.data,
      });
    }).catch(error => {
      console.error('ImagePicker Error: ', error);
    });
  };

  const handleCaptureImage = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      setImage({
        uri: image.path,
        base64: image.data,
      });
    }).catch(error => {
      console.error('ImagePicker Error: ', error);
    });
  };

  const handleImageSubmit = async () => {
    if (!image || !image.base64) {
      Alert.alert('Error', 'Please select an image to upload');
      return;
    }
    const formData = new FormData();
    formData.append('file', {
      name: 'uploaded_image.jpg',
      type: 'image/jpeg',
      uri: image.uri,
    });
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/image-based-search/${searchNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const base64Images: string[] = await response.json();
      const urls = base64Images.map(base64 => `data:image/jpeg;base64,${base64}`);
      setImageList(urls);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Error uploading image');
    }
  };

  const getGalleryImageNames = async () => {
    const directories = [
      RNFS.DownloadDirectoryPath,
      RNFS.DocumentDirectoryPath,
      RNFS.PicturesDirectoryPath,
    ];
    const picturesPath = RNFS.PicturesDirectoryPath;
    console.log('picturesPath', picturesPath);

    let imageNames: any[] = [];

    for (const dir of directories) {
      console.log(dir);
      try {
        const files = await RNFS.readDir(dir);
        console.log('files: ', files);
        const imageFiles = files.filter(file =>
            ['jpg', 'jpeg', 'png', 'gif'].some(ext => file.name.endsWith(ext)),
        );
        console.log(imageFiles);
        imageNames = imageNames.concat(imageFiles.map(file => file.name));
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
      }
    }
    console.log(imageNames);
    return imageNames;
  };

  const synchronizationHandler = async () => {
    console.log('Sending request to synchronize images');

    try {
      const formData1 = new FormData();
      formData1.append('username', user_info.username);

      const response1 = await fetch('http://10.0.2.2:8080/api/synchronize-images', {
        method: 'POST',
        body: formData1,
      });

      if (!response1.ok) {
        console.error('Failed to synchronize:', await response1.json());
        return;
      }

      const backendImageFiles = await response1.json();
      const galleryImageFiles = await getGalleryImageNames();

      const imagesToDelete = backendImageFiles.filter(
          img => !galleryImageFiles.includes(img),
      );

      console.log('Images that need to be deleted from backend: ', imagesToDelete);

      const imagesToAdd = galleryImageFiles.filter(
          img => !backendImageFiles.includes(img),
      );

      console.log('Images that need to be added to backend: ', imagesToAdd);

      const formData2 = new FormData();
      formData2.append('username', user_info.username);
      formData2.append('images_to_delete', JSON.stringify(imagesToDelete));

      const imageFilesToUpload = [];
      for (const imageName of imagesToAdd) {
        const imageFile = await RNFS.readFile(
            RNFS.PicturesDirectoryPath + '/' + imageName,
            'base64',
        );
        imageFilesToUpload.push({
          uri: 'data:image/jpeg;base64,' + imageFile,
          name: imageName,
          type: 'image/jpeg',
        });
      }

      console.log('imageFilesToUpload: ', imageFilesToUpload);
      console.log('imageFilesTodelete: ', imagesToDelete);

      imageFilesToUpload.forEach(image => {
        formData2.append('images_to_add', {
          uri: image.uri,
          name: image.name,
          type: 'image/jpeg',
        });
      });

      const response2 = await fetch('http://10.0.2.2:8080/api/add-delete-images', {
        method: 'POST',
        body: formData2,
      });

      if (!response2.ok) {
        console.error('Synchronization request failed:', await response2.json());
        throw new Error('Network response was not ok');
      }

      const formData3 = new FormData();
      formData3.append('user_id', user_info.username);
      formData3.append('operation', 'delete');
      formData3.append('updated_images', JSON.stringify(imagesToDelete));

      const response3 = await fetch('http://10.0.2.2:8000/api/synchronization', {
        method: 'POST',
        body: formData3,
      });
      if (!response3.ok) {
        throw new Error('Network response was not ok');
      }

      const formData4 = new FormData();
      formData4.append('user_id', user_info.username);
      formData4.append('operation', 'insert');

      imageFilesToUpload.forEach(image => {
        formData4.append('updated_images', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
      });

      const response4 = await fetch('http://10.0.2.2:8000/api/synchronization', {
        method: 'POST',
        body: formData4,
      });
      if (!response4.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response4.json();
      console.log('Synchronization completed successfully', result);
    } catch (error) {
      console.error('Error during synchronization:', error);
      Alert.alert('Error', 'Failed to synchronize images');
    }
  };

  const handleSliderChange = value => {
    setSearchNumber(Math.floor(value));
  };

  return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.row}>
          <TouchableOpacity
              style={[styles.buttonContainer, isButtonPressed ? styles.buttonHover : {}]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate('User')}
          >
            <FontAwesomeIcon icon={faUser} />
            <Text style={styles.buttonText}>User Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.buttonContainer, isButtonPressed ? styles.buttonHover : {}]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate('Settings')}
          >
            <FontAwesomeIcon icon={faGear} />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.buttonContainer, isButtonPressed ? styles.buttonHover : {}]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={synchronizationHandler}
          >
            <FontAwesomeIcon icon={faRotate} />
            <Text style={styles.buttonText}>Synchronize</Text>
          </TouchableOpacity>
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
        <View style={styles.centerContainer}>
          <View style={[{ width: buttonWidth * 2 }, styles.sliderContainer]}>
            <Text style={[{ width: buttonWidth * 2 }, styles.label]}>
              Select Number of Results: {searchNumber}
            </Text>
            <Slider
                style={[{ width: buttonWidth * 2, height: 30 }, styles.slider]}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={searchNumber}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#75A47F"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#75A47F"
            />
          </View>
          <TouchableOpacity
              style={[{ width: buttonWidth }, styles.submitButtonContainer, isButtonPressed ? styles.submitButtonHover : {}]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleTextSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Text</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={handleImageChange}>
          {image ? (
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          ) : (
              <Text style={styles.imagePickerText}>Tap to select an image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.cameraButton, isButtonPressed ? styles.buttonHover : {}]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleCaptureImage}
        >
          <FontAwesomeIcon icon={faCamera} />
          <Text style={styles.buttonText}>Capture Image</Text>
        </TouchableOpacity>

        <View style={styles.centerContainer}>
          <View style={[{ width: buttonWidth * 2 }, styles.sliderContainer]}>
            <Text style={[{ width: buttonWidth * 2 }, styles.label]}>
              Select Number of Results: {searchNumber}
            </Text>
            <Slider
                style={[{ width: buttonWidth * 2, height: 30 }, styles.slider]}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={searchNumber}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#75A47F"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#75A47F"
            />
          </View>
          <TouchableOpacity
              style={[
                { width: buttonWidth },
                styles.submitButtonContainer,
                isButtonPressed ? styles.submitButtonHover : {},
              ]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleImageSubmit}
          >
            <Text style={styles.submitButtonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

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
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  buttonText: {
    marginLeft: 10,
    color: '#555',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sliderContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  submitButtonContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#75A47F',
    borderRadius: 5,
  },
  buttonHover: {
    backgroundColor: '#dcdcdc',
  },
  submitButtonHover: {
    backgroundColor: '#BACD92',
  },
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
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  label: {
    justifyContent: 'center',
    color: '#555',
    marginBottom: 5,
  },
  slider: {
    justifyContent: 'center',
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    height: 50,
    fontSize: 16,
    textAlignVertical: 'top',
    color: '#333',
  },
  imagePicker: {
    marginBottom: 10,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d7d7d7',
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    height: 100,
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
  cameraButton: {
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    flexDirection: 'row',
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
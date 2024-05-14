import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {launchImageLibrary} from 'react-native-image-picker';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';
import {faGear} from '@fortawesome/free-solid-svg-icons/faGear';
import RNFS from 'react-native-fs';
import {toByteArray as btoa} from 'base64-js';
import logo from './assets/simvec.png';
import {faRotate} from '@fortawesome/free-solid-svg-icons';

function MainPage() {
  const {t, i18n} = useTranslation();
  const [text, setText] = useState('');
  const [searchNumber, setSearchNumber] = useState(5);
  const [imageList, setImageList] = useState([]);
  const [imageFilesName, setImageFilesName] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to track modal visibility
  const [isButtonPressed, setIsButtonPressed] = useState(false); // State to track button press
  const handlePressIn = () => setIsButtonPressed(true); // Handle button press
  const handlePressOut = () => setIsButtonPressed(false); // Handle button release
  const slideAnim = new Animated.Value(0); // Animation for slide-in effect
  const [image, setImage] = useState<{uri: string; base64?: string} | null>(
    null,
  );
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width; // Get the screen width
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
      const response = await fetch(
        'http://10.0.2.2:8080/api/text-based-search',
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
      console.log(imageList);
      console.error(urls);
    } catch (error) {
      console.error('Error processing text:', error);
      Alert.alert('Error', 'Error processing text');
    }
  };
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Toggle modal visibility
    if (isModalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(); // Slide-out animation
    } else {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(); // Slide-in animation
    }
  };
  const handleImageChange = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {
          uri: response.assets![0].uri,
          base64: response.assets![0].base64,
        };
        setImage(source);
      }
    });
  };

  const handleImageSubmit = async () => {
    if (!image || !image.base64) {
      Alert.alert('Error', 'Please select an image to upload');
      return;
    }
    const formData = new FormData(); // Create a FormData object
    console.log('image.uri in handleImageSubmit: ', image.uri);
    formData.append('file', {
      // Append the image data
      name: 'uploaded_image.jpg', // Filename
      type: 'image/jpeg', // MIME type
      uri: image.uri, // Image URI
    });
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/image-based-search/${searchNumber}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const base64Images: string[] = await response.json();
      const urls = base64Images.map(
        base64 => `data:image/jpeg;base64,${base64}`,
      );
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
    let imagePaths: any[] = [];
    let imageDict = {};
    for (const dir of directories) {
      console.log(dir);
      try {
        const files = await RNFS.readDir(dir);
        console.log('files: ', files);
        const imageFiles = files.filter(file =>
          ['jpg', 'jpeg', 'png', 'gif'].some(ext => file.name.endsWith(ext)),
        );
        console.log('imageFiles: ', imageFiles);
        //imageNames = imageNames.concat(imageFiles.map(file => file.name));
        imageNames = imageNames.concat(imageFiles.map(file => file.name));
        imagePaths = imagePaths.concat(imageFiles.map(file => file.path));
        // Store each image name and path in the dictionary
        imageFiles.forEach(file => {
          imageDict[file.name] = file.path;
        });
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
      }
    }
    console.log('Image dictionary:', imageDict);
    return imageDict;
  };

  const synchronizationHandler = async () => {
    console.log('Sending request to synchronize images');

    try {
      // Step 1: Get backend image files
      const formData1 = new FormData();
      formData1.append('username', user_info.username);

      const response1 = await fetch(
        'http://10.0.2.2:8080/api/synchronize-images',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData1,
        },
      );

      if (!response1.ok) {
        console.error('Failed to synchronize:', await response1.json());
        return;
      }

      const backendImageFiles = await response1.json(); // Image names from backend
      const galleryImageFilesPaths = await getGalleryImageNames(); // Image names from gallery

      // Convert the dictionary keys to an array of image names
      const galleryImageNames = Object.keys(galleryImageFilesPaths);

      // Step 2: Find images to delete from backend
      const imagesToDelete = backendImageFiles.filter(
        img => !galleryImageNames.includes(img),
      );

      console.log(
        'Images that need to be deleted from backend: ',
        imagesToDelete,
      );
      // Step 3: Find images to add to backend
      const imagesToAdd = galleryImageNames.filter(
        img => !backendImageFiles.includes(img),
      );

      console.log('Images that need to be added to backend: ', imagesToAdd);
      // Create form-data for the second request
      const formData2 = new FormData();

      formData2.append('username', user_info.username);

      // Step 4: Add images to delete as serialized JSON
      formData2.append('images_to_delete', JSON.stringify(imagesToDelete));

      // Step 5: Add actual image files for images to be added
      /*const imageFile = await RNFS.readFile(
          RNFS.PicturesDirectoryPath + '/' + imageName,
          'base64',
        ); // Read image as base64*/

      const imageFilesToUpload = []; // This array will hold image files to be uploaded
      for (const imageName of imagesToAdd) {
        // Assuming you have a way to retrieve the actual image file by name
        const imageFile = await RNFS.readFile(
          galleryImageFilesPaths[imageName],
          'base64',
        );
        console.log(
          'galleryImageFilesPaths[imageName]',
          galleryImageFilesPaths[imageName],
        );
        imageFilesToUpload.push({
          uri: 'file://' + galleryImageFilesPaths[imageName], // Data URI format
          name: imageName, // Filename
          type: 'image/jpeg', // MIME type
        });
      }

      //console.log('imageFilesToUpload: ', imageFilesToUpload);
      console.log('imageFilesTodelete: ', imagesToDelete);

      imageFilesToUpload.forEach(image => {
        formData2.append('images_to_add', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
        console.log(image);
      });

      // Send the second request with form-data
      const response2 = await fetch(
        'http://10.0.2.2:8080/api/add-delete-images',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData2,
        },
      );

      if (!response2.ok) {
        console.error(
          'Synchronization request failed:',
          await response2.json(),
        );
        throw new Error('Network response was not ok: ${response2.status}');
      }

      // Create FormData for the request
      const formData3 = new FormData();
      formData3.append('user_id', user_info.username);
      formData3.append('operation', 'delete'); // A single operation type if you're processing both in the same request

      // Append delete and insert operations data
      formData3.append('updated_images', JSON.stringify(imagesToDelete));

      const response3 = await fetch(
        'http://10.0.2.2:8000/api/synchronization',
        {
          method: 'POST',
          body: formData3,
        },
      );
      if (!response3.ok) {
        throw new Error('Network response was not ok');
      }

      const formData4 = new FormData();
      formData4.append('user_id', user_info.username);
      formData4.append('operation', 'insert'); // A single operation type if you're processing both in the same request

      imageFilesToUpload.forEach(image => {
        formData4.append('updated_images', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        });
      });
      // Send the imag
      const response4 = await fetch(
        'http://10.0.2.2:8000/api/synchronization',
        {
          method: 'POST',
          body: formData4,
        },
      );
      if (!response4.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response4.json();

      console.log('Synchronization completed successfully', result);

      console.log('Synchronization completed successfully');
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
      {/* New view for settings and user profile buttons */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            isButtonPressed ? styles.buttonHover : {}, // Apply hover style
          ]}
          onPressIn={handlePressIn} // Simulate hover
          onPressOut={handlePressOut} // Revert hover
          onPress={() => navigation.navigate('User')} // Navigate to User profile
        >
          <FontAwesomeIcon icon={faUser} />
          <Text style={styles.buttonText}>User Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonContainer,
            isButtonPressed ? styles.buttonHover : {}, // Apply hover style
          ]}
          onPressIn={handlePressIn} // Simulate hover
          onPressOut={handlePressOut} // Revert hover
          onPress={() => navigation.navigate('Settings')} // Navigate to Settings
        >
          <FontAwesomeIcon icon={faGear} />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonContainer,
            isButtonPressed ? styles.buttonHover : {}, // Apply hover style
          ]}
          onPressIn={handlePressIn} // Simulate hover
          onPressOut={handlePressOut} // Revert hover
          onPress={synchronizationHandler} // Placeholder action
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
        {/* Center the button */}
        <View
          style={[
            {width: buttonWidth * 2}, // Set the button width
            styles.sliderContainer,
          ]}>
          <Text
            style={[
              {width: buttonWidth * 2}, // Set the button width
              styles.label,
            ]}>
            Select Number of Results: {searchNumber}
          </Text>
          <Slider
            style={[{width: buttonWidth * 2, height: 30}, styles.slider]}
            minimumValue={1} // Minimum value for the slider
            maximumValue={10} // Maximum value for the slider
            step={1} // Step size for the slider
            value={searchNumber} // Current value for the slider
            onValueChange={handleSliderChange} // Event handler when the slider value changes
            minimumTrackTintColor="#75A47F" // Color for the active part of the slider
            maximumTrackTintColor="#d3d3d3" // Color for the inactive part of the slider
            thumbTintColor="#75A47F" // Color for the thumb (slider handle)
          />
        </View>
        <TouchableOpacity
          style={[
            {width: buttonWidth}, // Set the button width
            styles.submitButtonContainer,
            isButtonPressed ? styles.submitButtonHover : {}, // Apply hover style
          ]}
          onPressIn={handlePressIn} // Simulate hover
          onPressOut={handlePressOut} // Revert hover
          onPress={handleTextSubmit} // Placeholder action
        >
          <Text style={styles.submitButtonText}>Submit Text</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={handleImageChange}>
        {image ? (
          <Image source={{uri: image.uri}} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Tap to select an image</Text>
        )}
      </TouchableOpacity>

      <View style={styles.centerContainer}>
        {/* Center the button */}
        <View
          style={[
            {width: buttonWidth * 2}, // Set the button width
            styles.sliderContainer,
          ]}>
          <Text
            style={[
              {width: buttonWidth * 2}, // Set the button width
              styles.label,
            ]}>
            Select Number of Results: {searchNumber}
          </Text>
          <Slider
            style={[{width: buttonWidth * 2, height: 30}, styles.slider]}
            minimumValue={1} // Minimum value for the slider
            maximumValue={10} // Maximum value for the slider
            step={1} // Step size for the slider
            value={searchNumber} // Current value for the slider
            onValueChange={handleSliderChange} // Event handler when the slider value changes
            minimumTrackTintColor="#75A47F" // Color for the active part of the slider
            maximumTrackTintColor="#d3d3d3" // Color for the inactive part of the slider
            thumbTintColor="#75A47F" // Color for the thumb (slider handle)
          />
        </View>
        <TouchableOpacity
          style={[
            {width: buttonWidth}, // Set the button width
            styles.submitButtonContainer,
            isButtonPressed ? styles.submitButtonHover : {}, // Apply hover style
          ]}
          onPressIn={handlePressIn} // Simulate hover
          onPressOut={handlePressOut} // Revert hover
          onPress={handleImageSubmit} // Placeholder action
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
  centerContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center', // Center the button horizontally
    alignItems: 'center', // Align content at the center
    paddingVertical: 2, // Vertical padding for consistency
  },
  buttonText: {
    marginLeft: 10, // Space between icon and text
    color: '#555',
  },
  submitButtonText: {
    color: '#fff', // White text
    fontWeight: 'bold', // Make the text bold
    fontSize: 15, // Increase font size
  },
  sliderContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center', // Center icon and text
    paddingHorizontal: 20, // Padding on the sides
    paddingVertical: 1, // Padding on the top and bottom
    backgroundColor: '#fff', // Background color
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Make space between buttons
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row', // Horizontal alignment
    alignItems: 'center', // Center icon and text
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },

  submitButtonContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center', // Center icon and text
    padding: 5,
    backgroundColor: '#75A47F',
    borderRadius: 5,
  },

  buttonHover: {
    backgroundColor: '#dcdcdc', // Background color on press (hover effect)
  },

  submitButtonHover: {
    backgroundColor: '#BACD92', // Background color on press (hover effect)
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

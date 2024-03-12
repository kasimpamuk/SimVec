import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Image, StyleSheet, Dimensions, PermissionsAndroid, Platform } from 'react-native';
import CameraRoll from '@react-native-camera-roll/camera-roll';

const { width } = Dimensions.get('window');
const numColumns = 3;
const imageSize = width / numColumns;

const App = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const getPhotos = async () => {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Access Library',
            message: 'App needs access to your photos',
            buttonPositive: 'OK', // Add the missing property
          }
        );

        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Access to pictures was denied');
          return;
        }
      }

      const { edges } = await CameraRoll.getPhotos({
        first: 100, // Adjust this value as needed
        assetType: 'Photos',
      });

      const imageURIs = edges.map(edge => edge.node.image.uri);
      setPhotos(imageURIs);
    };

    getPhotos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        numColumns={numColumns}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: imageSize,
    height: imageSize,
    margin: 1,
  },
});

export default App;

import React, { useState } from 'react';
import './App.css';
import logo from './simvec.png';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [text, setText] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image to upload");
      return;
    }
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch('http://localhost:8080/api/image-based-search', {
        method: 'POST',
        body: formData,
      });
      const imageBlobs = await response.json(); // Assuming the response is an array of blobs
      const urls = imageBlobs.map(blob => URL.createObjectURL(blob));
      setImageList(urls);
    } catch (error) {
      alert("Error uploading image");
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      alert("Please enter some text");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/text-based-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text }),
      });
      const imageBlobs = await response.json(); // Assuming the response is an array of blobs
      const urls = imageBlobs.map(blob => URL.createObjectURL(blob));
      setImageList(urls);
    } catch (error) {
      alert("Error processing text");
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="website-logo" />
  
      {/* Image Upload Section */}
      <div className="image-upload-container">
        <form onSubmit={handleSubmit}>
          <input 
            type="file" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
            id="file-upload"
          />
          <label htmlFor="file-upload" className="image-upload-label">
            {preview ? <img src={preview} alt="Preview" className="image-preview" /> : "Click to select an image"}
          </label>
          <br />
          <button type="submit" className="upload-btn">Upload</button>
        </form>
      </div>
  
      {/* Text Submission Section */}
      <div className="text-submission-container">
        <form onSubmit={handleTextSubmit}>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Enter text here"
            className="text-input"
          />
          <br />
          <button type="submit" className="submit-btn">Submit Text</button>
        </form>
      </div>
  
      {/* Displaying Returned Images */}
      {imageList.length > 0 && (
        <div className="image-list-container">
          <h3>Returned Images:</h3>
          {imageList.map((imgSrc, index) => (
            <img key={index} src={imgSrc} alt={`Result ${index}`} className="returned-image" />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

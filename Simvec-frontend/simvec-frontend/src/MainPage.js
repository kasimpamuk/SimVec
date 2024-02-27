import React, { useState } from 'react';
import './MainPage.css';
import logo from './simvec.png';

const base64ToBlob = (base64) => {
  // This will convert URL-safe base64 to standard base64 if necessary.
  const standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  const parts = standardBase64.split(';base64,');
  
  if (parts.length === 2) {
    const mimePart = parts[0];
    const base64Part = parts[1];
    const byteString = atob(base64Part); // Decode the base64 string
    const mimeString = mimePart.split(':')[1];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  } else {
    throw new Error('The provided string does not seem to be correctly Base64 encoded.');
  }
};

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [text, setText] = useState('');
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  
  
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
      const response = await fetch('http://localhost:8080/api/image-based-search/5', {
        method: 'POST',
        body: formData,
      });
    const base64Images = await response.json();
    const urls = base64Images.map(base64 => `data:image/jpeg;base64,${base64}`);
    setImageList(urls);
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Error uploading image");
  }
};

  const data = {
    input: text,
    topk: "5"
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
        body: JSON.stringify(data)
      });
      const base64Images = await response.json();
    const urls = base64Images.map(base64 => `data:image/jpeg;base64,${base64}`);
    setImageList(urls);
  } catch (error) {
    console.error("Error processing text:", error);
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

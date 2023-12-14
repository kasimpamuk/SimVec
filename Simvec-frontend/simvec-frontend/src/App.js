import React, { useState } from 'react';
import './App.css'; // Import the CSS file
import logo from './simvec.png'; // Adjust the path based on your folder structure


function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // for creating a preview
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
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      });
      // Handle response...
      alert("Image uploaded successfully!");
    } catch (error) {
      // Handle error...
      alert("Error uploading image");
    }
  };

  return (
    <div className="image-upload-container">
      <img src={logo} alt="Logo" className="website-logo" />
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
  );
}

export default ImageUpload;

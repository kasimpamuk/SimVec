import React, { useState } from 'react';

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
    <div>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        <input 
          type="file" 
          onChange={handleImageChange} 
          style={{ display: 'none' }} 
          id="file-upload"
        />
        <label htmlFor="file-upload" style={{ border: '2px dashed grey', padding: '20px', cursor: 'pointer' }}>
          {preview ? <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} /> : "Click to select an image"}
        </label>
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>Upload</button>
      </form>
    </div>
  );
}

export default ImageUpload;

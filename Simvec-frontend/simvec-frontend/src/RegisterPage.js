import React, { useState } from 'react';
import './RegisterPage.css'; // Make sure to create a corresponding CSS file
import logo from './simvec.png';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would usually send the data to the server
    console.log('Registering with:', name, email, password);
  };

  return (
    <>
    <div className='header'>
        <img src={logo} alt="Logo" className="website-logo" />
      </div>
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-heading">Register</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="register-btn">Register</button>
      </form>
    </div>
    </>
  );
}

export default RegisterPage;

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const RegisterPage = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const navigate = useNavigate(); // Add this line to get the navigate object

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post('http://localhost:3008/api/register', { username, password });
      if (response.status === 201) {
        setRegistrationMessage('Registration successful. Please login.');
        navigate('/');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationMessage('Registration failed. Please try again.');
    }
  };

  const styles = {
    container: {
      textAlign: 'center',
      marginTop: '50px',
    },
    form: {
      display: 'inline-block',
      textAlign: 'left',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    label: {
      display: 'block',
      margin: '10px 0',
    },
    input: {
      width: '100%',
      padding: '8px',
      margin: '5px 0',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '10px',
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
    },
    message: {
      margin: '10px 0',
      color: 'green',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form style={styles.form}>
        <label style={styles.label}>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <br />
        <label style={styles.label}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <br />
        <button onClick={handleRegister} style={styles.button}>
          Register
        </button>
      </form>
      <div style={styles.message}>{registrationMessage}</div>
      <div>
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;

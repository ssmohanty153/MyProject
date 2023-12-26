import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Add this line to get the navigate object

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const response = await axios.post('http://localhost:3008/api/login', { username, password });
            if (response.status === 200) {
                setAuthenticated(true);
                navigate('/employee-form');
            }
        } catch (error) {
            console.error('Login failed:', error);
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
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <form style={styles.form} onSubmit={handleLogin}>
                <label style={styles.label}>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
                <br />
                <label style={styles.label}>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
                <br />
                <button type="submit" style={styles.button}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;

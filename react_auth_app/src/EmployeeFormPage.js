import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeFormPage = ({ isAuthenticated }) => {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [department, setDepartment] = useState('');

    const handleEmployeeSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await axios.post('http://localhost:3008/api/submit-employee', { name, id, department });
            if (response.status === 200) {
                console.log('Employee data submitted successfully');
                setName('');
                setId('');
                setDepartment('');
            }
        } catch (error) {
            console.error('Failed to submit employee data:', error);
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

    if (!isAuthenticated) {
        // Navigate to the login page if not authenticated
        return <Navigate to="/" />;
    }

    return (
        <div style={styles.container}>
            <h2>Employee Information</h2>
            <form style={styles.form}>
                <label style={styles.label}>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />
                <br />
                <label style={styles.label}>ID:</label>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    style={styles.input}
                />
                <br />
                <label style={styles.label}>Department:</label>
                <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={styles.input}
                />
                <br />
                <button onClick={handleEmployeeSubmit} style={styles.button}>
                    Submit Employee Data
                </button>
            </form>
        </div>
    );
};

export default EmployeeFormPage;

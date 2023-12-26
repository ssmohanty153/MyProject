import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './LoginPage';
import EmployeeFormPage from './EmployeeFormPage';
import RegisterPage from './RegisterPage'; // Import the RegisterPage component

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage setAuthenticated={setAuthenticated} />}
        />
        <Route
          path="/employee-form"
          element={<EmployeeFormPage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/register"
          element={<RegisterPage setAuthenticated={setAuthenticated} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

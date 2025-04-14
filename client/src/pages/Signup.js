import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Signup successful. Welcome ${username}`);
        navigate('/profile');
      } else {
        setMessage(data.error || 'Signup failed.');
      }
    } catch (error) {
      setMessage('Something went wrong.');
      console.error('Error:', error);
    }
  };
  return (
    <div className="container mt-4">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>Sign Up</h1>
          <p>{message || 'Please enter your credentials.'}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                className="form-control"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit">Sign Up</button>
          </form>
        </div>
        <div className="col-md-6">
          <img
            src="phishlogo.png"
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
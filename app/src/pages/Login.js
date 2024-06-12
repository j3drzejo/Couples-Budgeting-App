import { Link, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../utils/check'

export default function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/users/login', {
        username: credentials.username,
        password: credentials.password
      }, {
        withCredentials: true
      });

      if (response.status === 201) {
        // Registration was successful, and the cookie is set by the server
        alert('Login successful', response.data);

        // Optionally, save the token in localStorage or state for later use
        // localStorage.setItem('token', response.data.token); // if token is returned in the response body
      }
    } catch (error) {
      alert('Login failed');
      setCredentials({username: "", password: ""});
    }
  };

  useEffect(() => {
    checkAuth(navigate);
  }, [navigate]);


  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField 
            id="standard-basic" 
            label="Login" 
            variant="standard" 
            name="username" 
            value={credentials.username} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <TextField 
            id="standard-basic" 
            label="Password" 
            variant="standard" 
            type="password" 
            name="password" 
            value={credentials.password} 
            onChange={handleChange} 
          />
        </div>
        <div className='text-center bg-gray-50'>
          <button type="submit" onSubmit={handleSubmit}>Sign In!</button>
        </div>
      </form>
      <div>
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            navigate("/register");
          }}
        >
          Don`t have an account? Sign up!`
        </Link>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
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
      const response = await axios.post('http://localhost:3001/api/users/register', {
        username: credentials.username,
        password: credentials.password
      }, {
        withCredentials: true
      });

      if (response.status === 201) {
        // Registration was successful, and the cookie is set by the server
        console.log('Registration successful:', response.data);

        // Optionally, save the token in localStorage or state for later use
        // localStorage.setItem('token', response.data.token); // if token is returned in the response body
      }
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/auth', {
          withCredentials: true // This is crucial to include cookies in the request
        });

        if (response.status === 200) {
          navigate('/');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };

    checkAuth();
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
          <button type="submit">Sign Up!</button>
        </div>
      </form>
      <div>
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            navigate("/login");
          }}
        >
          Already have an account? Sign in!
        </Link>
      </div>
    </div>
  );
}
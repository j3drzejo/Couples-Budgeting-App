import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(credentials);
    try {
      const response = await axios.post('http://localhost:3001/users/register', {
        username: credentials.username,
        password: credentials.password
      });

      const token = response.data.token;
      const username = response.data.username;

      // Store token and username in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      navigate("/")
      // Optionally, redirect to another page or update state to indicate successful registration
    } catch (error) {
      // Handle error
      alert(error.response.data.error);
    }
  };

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
    </div>
  );
}
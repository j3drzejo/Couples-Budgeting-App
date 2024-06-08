import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [credentials, setCredentials] = useState({
    login: "",
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
    console.log("sub")
    try {
      const response = await axios.post('http://localhost:3001/users/login', {
        username: credentials.login,
        password: credentials.password
      });
      
      // Assuming response.data.token contains the token
      const token = response.data.token;
      
      // Store token and username in local storage
      localStorage.setItem('token', token);
      alert("logged successfuly");
      // Optionally, redirect to another page or update state to indicate successful login
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
            name="login" 
            value={credentials.login} 
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
    </div>
  );
}

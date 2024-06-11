import { useState } from 'react';
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
import { Link, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate();

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

import React, {useState} from 'react';
import axios from 'axios';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/users/register', {
        username: username,
        password: password
      });
      
      // If registration is successful, show alert
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Registration successful!');
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      // Handle error
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
  };

  
  return (
    <div>
      <h2>Register</h2>
      <form>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>

      <h1>{localStorage.getItem('token')}</h1>
    </div>
  );
}

export default App;

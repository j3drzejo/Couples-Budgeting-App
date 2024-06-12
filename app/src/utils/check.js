import axios from 'axios';

export const checkAuth = async (navigate) => {
  try {
    const response = await axios.get('http://localhost:3001/api/users/auth', {
      withCredentials: true // This is crucial to include cookies in the request
    });

    if (response.status === 200) {
      navigate('/');
    }
  } catch (error) {
    navigate('/login')
    console.error('Authentication check failed:', error);
  }
};


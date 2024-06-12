import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../utils/check'

export default function Home() {
  const navigate = useNavigate();
  const [inCouple, setInCouple] = useState(false);

  useEffect(() => {
    const checkCouple = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/couples', {
          withCredentials: true // This is crucial to include cookies in the request
        });

        if (response.status === 200) {
          setInCouple(true);
        }
    } catch(error) {
    }};
    checkCouple();
  }, [])

  useEffect(() => {
    checkAuth(navigate)
  }, [navigate]);

  return(
    <div>
      {inCouple ? <p> true </p> : <p> false </p>}
      {true}
    </div>
  )
}
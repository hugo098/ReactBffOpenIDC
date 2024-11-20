/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import api from './api';

interface Claims {
  [key: string]: string;
}

function App() {
  const [claims, setClaims] = useState<Claims | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  // Fetch session data
  const checkSession = async () => {
    try {
      setError(null);
      const response = await api.get<Claims>('auth/check_session');
      setClaims(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('You are not logged in.');
      } else {
        setError('An error occurred.');
      }
    }
  };

  // Call the protected API endpoint
  const callProtectedApi = async () => {
    try {
      setError(null);
      const response = await api.get<string>('/hello-world');
      setApiData(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('You are not authorized to access this endpoint.');
      } else {
        setError('An error occurred while calling the API.');
      }
    }
  };

  // Redirect to login
  const login = () => {
    window.location.href = 'https://localhost:5004/auth/login'; // Adjust URL as needed
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post('auth/logout');
      setClaims(null);
      setApiData(null);
      setError('You have been logged out.');
    } catch {
      setError('An error occurred during logout.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>React Authentication App</h1>
      <button onClick={checkSession} style={{ margin: '5px' }}>
        Check Session
      </button>
      <button onClick={callProtectedApi} style={{ margin: '5px' }}>
        Call Protected API
      </button>
      <button onClick={login} style={{ margin: '5px' }}>
        Login
      </button>
      <button onClick={logout} style={{ margin: '5px' }}>
        Logout
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {claims ? (
        <div>
          <h3>Claims:</h3>
          <pre>{JSON.stringify(claims, null, 2)}</pre>
        </div>
      ) : (
        <p>No claims available. Please log in.</p>
      )}

      {apiData ? (
        <div>
          <h3>Protected API Data:</h3>
          <p>{apiData}</p>
        </div>
      ) : (
        <p>No protected data loaded. Call the API to fetch it.</p>
      )}
    </div>
  );
}

export default App;

import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

function usePermissions() {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setPermissions(decodedToken.roles || []); 
      } catch (error) {
        console.error('Invalid JWT:', error);
      }
    }
  }, []);

  return permissions;
}

export default usePermissions;
import { useState, useEffect } from 'react';
import { getCurrentUser } from "@/actions/admin-dashboard";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  return { currentUser, isLoading };
}
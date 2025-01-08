import { useState, useEffect } from 'react';
import { getCurrentUser } from "@/actions/admin-dashboard";
import { ExtendedUser } from "@/next-auth";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user as ExtendedUser);
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
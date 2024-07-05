import { useEffect, useState } from 'react';
import { ExtendedUser } from '@/next-auth';
import { getSession } from 'next-auth/react';

export const useCurrentUser = (): ExtendedUser | undefined => {
  const [user, setUser] = useState<ExtendedUser | undefined>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : undefined;
    }
    return undefined;
  });

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session?.user) {
        const userData = session.user as ExtendedUser;
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } else {
        setUser(undefined);
        localStorage.removeItem('currentUser');
      }
    };

    fetchUser();
  }, []);

  return user;
};
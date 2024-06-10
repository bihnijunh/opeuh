// useCurrentUser.ts
import { useEffect, useState } from 'react';
import { ExtendedUser } from '@/next-auth'; // Assuming you have already defined ExtendedUser type
import { getSession } from 'next-auth/react';

export const useCurrentUser = (): ExtendedUser | undefined => {
  const [user, setUser] = useState<ExtendedUser | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session?.user) {
        setUser(session.user as ExtendedUser);
      } else {
        setUser(undefined);
      }
    };

    fetchUser();
  }, []);

  return user;
};

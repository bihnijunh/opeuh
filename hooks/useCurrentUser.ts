import { useSession } from "next-auth/react";
import { ExtendedUser } from "@/next-auth";

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const user = session?.user as ExtendedUser;

  return user;
}
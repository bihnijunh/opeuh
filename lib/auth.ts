import { auth } from "@/auth";
import { getUserById } from "@/data/user";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};

export const currentBTCBalance = async () => {
  const session = await auth();
  if (session?.user?.id) {
    const user = await getUserById(session.user.id);
    return user?.btc ?? 0;
  }
  return 0;
};

export const currentUSDTBalance = async () => {
  const session = await auth();
  if (session?.user?.id) {
    const user = await getUserById(session.user.id);
    return user?.usdt ?? 0;
  }
  return 0;
};

export const currentETHBalance = async () => {
  const session = await auth();
  if (session?.user?.id) {
    const user = await getUserById(session.user.id);
    return user?.eth ?? 0;
  }
  return 0;
};
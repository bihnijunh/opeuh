export type UserWithBalance = {
  id: string;
  usdt: number;
  btc: number;
  eth: number;
  accountDetails?: {
    accountLimit: number;
  };
};
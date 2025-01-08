export interface Transaction {
  id: number;
  date: string;
  btc?: number;
  usdt?: number;
  eth?: number;
  amount: number;
  walletAddress: string;
  transactionId: string;
  status: string;
  userId: string;
  recipientId: string;
  senderAddress: string;
  senderUsername: string;
  cryptoType: 'btc' | 'usdt' | 'eth';
}

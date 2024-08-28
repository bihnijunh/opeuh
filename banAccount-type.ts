export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
    iban: string | null;
    swiftCode: string | null;
}

export interface CryptoSellTransaction {
    id: string;
    userId: string;
    bankAccountId: string;
    currency: string;
    amount: number;
    status: string;
    paid: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
    iban: string | null;
    swiftCode: string | null;
}
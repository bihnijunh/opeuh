export function formatCreditCardNumber(cardNumber: string): string {
  if (!cardNumber) return '•••• •••• •••• ••••';
  const groups = cardNumber.replace(/\s/g, '').match(/.{1,4}/g);
  return groups ? groups.join(' ') : cardNumber;
}

export function formatExpiryDate(expiryDate: string): string {
  if (!expiryDate) return 'MM/YYYY';
  const [month, year] = expiryDate.split('/');
  return `${month.padStart(2, '0')}/${year.padStart(4, '2000')}`;
}
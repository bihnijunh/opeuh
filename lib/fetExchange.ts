export async function getExchangeRate(from: string, to: string): Promise<number> {
  const apiKey = 'cbcf0addcc82ba2243c9feff';
  const baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/`;

  try {
    const response = await fetch(`${baseUrl}${from}/${to}`);
    const data = await response.json();
    
    if (data.result === 'success') {
      return data.conversion_rate;
    } else {
      throw new Error(data['error-type']);
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
}
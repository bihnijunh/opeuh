async function getExchangeRate(from: string, to: string): Promise<number> {
    const apiKey = 'cbcf0addcc82ba2243c9feff';
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.result === 'success') {
        return data.conversion_rate;
      } else {
        throw new Error('Failed to fetch exchange rate');
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      throw error;
    }
  }
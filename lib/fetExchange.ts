type CurrencyRates = {
  [key: string]: { [key: string]: number }
};

async function fetchExchangeRates(): Promise<CurrencyRates> {
  try {
    const response = await fetch('https://v6.exchangerate-api.com/v6/latest/USD', {
      headers: {
        'Authorization': `Bearer ${process.env.EXCHANGE_RATE_API_KEY}`
      }
    });
    const data = await response.json();
    
    if (data.result !== "success") {
      throw new Error('Failed to fetch exchange rates');
    }

    return {
      USD: data.conversion_rates
    };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Failed to fetch exchange rates');
  }
}

export async function getExchangeRate(from: string, to: string): Promise<number> {
  const rates = await fetchExchangeRates();
  
  if (from === 'USD' && to in rates.USD) {
    return rates.USD[to];
  } else if (to === 'USD' && from in rates.USD) {
    return 1 / rates.USD[from];
  } else if (from in rates.USD && to in rates.USD) {
    return rates.USD[to] / rates.USD[from];
  } else {
    throw new Error(`Exchange rate not available for ${from} to ${to}`);
  }
}
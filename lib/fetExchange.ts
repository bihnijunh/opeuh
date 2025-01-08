type CurrencyRates = {
  [key: string]: { [key: string]: number }
};

async function fetchExchangeRates(): Promise<CurrencyRates> {
  try {
    const fiatResponse = await fetch('https://v6.exchangerate-api.com/v6/latest/USD', {
      headers: {
        'Authorization': `Bearer ${process.env.EXCHANGE_RATE_API_KEY}`
      }
    });

    const fiatData = await fiatResponse.json();

    if (fiatData.result !== "success") {
      throw new Error('Failed to fetch fiat exchange rates');
    }

    const rates: CurrencyRates = {
      USD: {
        ...fiatData.conversion_rates,
      }
    };

    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Failed to fetch exchange rates');
  }
}

export async function getExchangeRate(from: string, to: string): Promise<number> {
  const rates = await fetchExchangeRates();
  
  const getRate = (currency: string) => {
    if (currency in rates.USD) {
      return rates.USD[currency];
    }
    throw new Error(`Exchange rate not available for ${currency}`);
  };

  const fromRate = getRate(from);
  const toRate = getRate(to);

  return toRate / fromRate;
}
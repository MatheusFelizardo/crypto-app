import { DAILY, EXCHANGE_RATE, MONTLY } from "./mocks"

const API_KEY = 'RIBXT3XYLI69PC0Q'
// const API_KEY = 'WA4OMB8GE0SAMG8E'
// const API_KEY = 'I1QH66WFLNFMR3HG'

export interface CurrencyInfo {
  date: string
  open: {
    [key: string]: number
  }
  high: {
    [key: string]: number
    USD: number
  }
  low: {
    [key: string]: number
    USD: number
  }
  close: {
    [key: string]: number
    USD: number
  }
  volume: number
  marketCap: {
    USD: number
  }
}

export interface CurrencyData {
  information: string
  currencyCode: string
  currencyName: string
  data: CurrencyInfo[]
  error?: any
  message?: any
}

export const POPULAR_CURRENCIES = [
  {
      "code": "BTC",
      "name": "Bitcoin",
      "icon": "/icons/btc.png"
  },
  {
      "code": "ETH",
      "name": "Ethereum",
      "icon": "/icons/eth.png"
  },
  {
      "code": "BNB",
      "name": "Binance Coin",
      "icon": "/icons/bnb.png"
  },
  {
      "code": "ADA",
      "name": "Cardano",
      "icon": "/icons/ada.png"
  },
  {
    "code": "XRP",
    "name": "Ripple",
    "icon": "/icons/xrp.png"
  }
]

export const formatApiData = (data: any) => {
  try {
    const valuesArray = Object.values(data) as [any, any];

    const formatedData = []
    const currencyMarketCode = valuesArray[0]['4. Market Code']
    
    for (let key in valuesArray[1]) {
      const value = valuesArray[1][key] 
      formatedData.push({
        date: key,
        open: {
          [currencyMarketCode]: value[`1a. open (${currencyMarketCode})`],
          USD: value['1b. open (USD)'],
        },
        high: {
          [currencyMarketCode]: value[`2a. high (${currencyMarketCode})`],
          USD: value['2b. high (USD)'],
        },
        low: {
          [currencyMarketCode]: value[`3a. low (${currencyMarketCode})`],
          USD: value['3b. low (USD)'],
        },
        close: {
          [currencyMarketCode]: value[`4a. close (${currencyMarketCode})`],
          USD: value['4b. close (USD)'],
        },
        volume: value['5. volume'],
        marketCap: {
          USD: value['6. market cap (USD)'],
        },
      })
    }

    return {
      information: valuesArray[0]['1. Information'],
      currencyCode: valuesArray[0]['2. Digital Currency Code'],
      currencyName: valuesArray[0]['3. Digital Currency Name'],
      data: formatedData
    }
  } catch (e) {
    console.error(e)
    return {
      error: e,
      message: 'An error occurred while formatting the data'
    }
  }
}


export const getCurrencyMonthly = async (symbol: string) => {
  try {
    const request = await fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=${symbol}&market=EUR&apikey=${API_KEY}`)
    const response = await request.json()

    if (response['Information']) {
      return {
        error: response['Information'],
        message: 'API request limit reached. Please try again tomorrow or replace the API key. 25 requests per day.'
      }
    }

    if (response['Error Message']) {
      const request = await fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=${symbol}&market=USD&apikey=${API_KEY}`)
      const response = await request.json()
      
      if (response['Error Message']) {
        return {
          error: response['Error Message'],
          message: 'An error occurred while fetching the data.'
        }
      }
      return formatApiData(response) as CurrencyData
    }
  
    return formatApiData(response) as CurrencyData
  } catch(e) {
    return {
      error: e,
      message: 'An error occurred while fetching the data'
    }
  }
}

export const getCurrencyDaily = async (symbol: string) => {
  try {
    const request = await fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=EUR&apikey=${API_KEY}`)
    const response = await request.json()

    if (response['Information']) {
      return {
        error: response['Information'],
        message: 'API request limit reached. Please try again tomorrow or replace the API key. 25 requests per day.'
      }
    }

    if (response['Error Message']) {
      const request = await fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${API_KEY}`)
      const response = await request.json()

      if (response['Error Message']) {
        return {
          error: response['Error Message'],
          message: 'An error occurred while fetching the data.'
        }
      }

      return formatApiData(response) as CurrencyData
    }
  
    return formatApiData(response) as CurrencyData
  } catch(e) {
    return {
      error: e,
      message: 'An error occurred while fetching the data'
    }
  }
}


export interface ExchangeRateResponse {
  'Realtime Currency Exchange Rate': {
    '1. From_Currency Code': string
    '2. From_Currency Name': string
    '3. To_Currency Code': string
    '4. To_Currency Name': string
    '5. Exchange Rate': string
    '6. Last Refreshed': string
    '7. Time Zone': string
    '8. Bid Price': string
    '9. Ask Price': string
  },
  error?: any
  message?: any
}

export const getExchangeRate = async (from: string, to: string) => {
  try {
    const request = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${API_KEY}`)
    const response = await request.json()
   
    if (response['Error Message']) {
      return {
        error: response['Error Message'],
        message: 'This convertion is not available at the moment'
      }
    }
    return response as ExchangeRateResponse
  } catch(e) {
    return {
      error: e,
      message: 'An error occurred while fetching the data'
    }
  }
}
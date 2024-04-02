import Image from 'next/image'
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import physicalCurrency from '../../../public/physical_currency_list.json'
import digitalCurrency from '../../../public/digital_currency_list.json'
import { ExchangeRateResponse, getExchangeRate } from '../utils'

function CurrencyConverter({selectedCurrency}: {selectedCurrency: string | undefined}) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState<string | number>('')
  const [result, setResult] = useState<string | number>('')
  const [error, setError] = useState('')
  const [options, setOptions] = useState<any>({
    from: '',
    to: '',
    rate: null,
  })

  const allCurrencyOptions = [...physicalCurrency, ...digitalCurrency]

  useEffect(() => {
    if (!selectedCurrency) return
    setFrom(selectedCurrency)
    setTo('USD')
  }, [selectedCurrency])
  
  const convertCurrency = async (value: string) => {
    setError('')
    if (from === '' || to === '') {
      setResult(amount)
      return
    }
    let rate
    
    if (options.from != from && options.to != to) {
      const rateResponse = await getExchangeRate(from, to) as ExchangeRateResponse
      if (rateResponse.error) {
        const reverseRateResponse = await getExchangeRate(to, from) as ExchangeRateResponse
        if (!reverseRateResponse.error) {
          rate = 1 / +reverseRateResponse['Realtime Currency Exchange Rate']['5. Exchange Rate']
          setOptions({
            from,
            to,
            rate
          })
          return
        }
        setError(rateResponse.message)
        return
      }
      rate = rateResponse['Realtime Currency Exchange Rate']['5. Exchange Rate']
      setOptions({
        from,
        to,
        rate
      })
    }
    rate = options.rate
  
    setResult(+rate * Number(value))
  }

  const invert = () => {
    const fromValue = from
    const resultValue = result
    setFrom(to)
    setTo(fromValue)
    setResult(amount)
    setAmount(resultValue)
  }

  return (
    <div>
      <div className='flex flex-col gap-1 items-center'>
        <div className='w-full flex gap-1'>
          <input 
            className='basis-8/12 w-full bg-slate-700 p-1' 
            type="text" 
            value={amount} 
            onInput={(e:any)=> {
              const regex = /^[0-9.,]+$/
              
              if (!regex.test(e.target.value)) {
                if (e.target.value === '') {
                  setAmount('')
                  setResult('')
                }
                return
              }

              const parsedValue = e.target.value.replace(/,/g, '.')

              setAmount(parsedValue)
              convertCurrency(parsedValue)
            }}
          />
          <select 
            name="from" id="from" className='basis-4/12 w-full bg-slate-700 p-1'
            onChange={(e) => setFrom(e.target.value)}
            value={from}
          >
            {allCurrencyOptions.map((currency) => {
              return <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>
            } )}
          </select>
        </div>
        <button onClick={invert}>
          <Image alt="exchange icon" src="/icons/exchange.svg" width={30} height={30} />
        </button>
        <div className='w-full flex gap-1'>
          <input disabled className='basis-8/12 w-full bg-slate-700 p-1 cursor-not-allowed' type="text" value={result}/>
          <select 
            name="from" id="from" className='basis-4/12 w-full bg-slate-700 p-1'
            onChange={(e) => setTo(e.target.value)}
            value={to}
          >
            {allCurrencyOptions.map((currency) => {
              return <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>
            } )}
          </select>
        </div>
      </div>
      {error && <div className='text-xs text-red-500'>{error}</div>}
    </div>
  )
}

export default CurrencyConverter
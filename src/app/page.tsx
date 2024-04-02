"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CurrencyData, formatApiData, getCurrencyDaily, getCurrencyMonthly, POPULAR_CURRENCIES } from "./utils";
import CurrencyListModal from "./components/CurrencyListModal";
import FinancialChart from "./components/FinancialChart";
import CurrencyConverter from "./components/CurrencyConverter";
import digitalCurrencies from '../../public/digital_currency_list.json';

export default function Home() {
  const [currency, setCurrency] = useState<null | CurrencyData>(null)
  const [dailyCurrency, setDailyCurrency] = useState<null | CurrencyData>(null)
  const [montlyCurrency, setMontlyCurrency] = useState<null | CurrencyData>(null)

  const [searchCurrency, setSearchCurrency] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCurrencyListModal, setShowCurrencyListModal] = useState(false)
  const [error, setError] = useState('')

  const handleSearchMontly = async (currency = searchCurrency) => {
    setError('')
    if (currency === montlyCurrency?.currencyCode) {
      setCurrency(montlyCurrency)
      return
    }

    if(!currency) {
      setError('Please enter a currency.')
      setLoading(false)
      return
    }

    const hasCurrency = digitalCurrencies.find(c => c.code.toLocaleLowerCase() === currency?.toLocaleLowerCase())
    if(!hasCurrency) {
      setError('Currency not found.')
      setLoading(false)
      return
    }

    setCurrency(null)
    setLoading(true)

    const response = await getCurrencyMonthly(currency)
    if(response?.error) {
      console.log(response)
      setError(response?.message || 'Something went wrong, please try again later.')
    } else {
      setCurrency(response as any)
      setMontlyCurrency(response as any)
    }
    setLoading(false)
  }

  const handleSearchDaily = async (currency = searchCurrency) => {
    setError('')
    if (currency === dailyCurrency?.currencyCode) {
      setCurrency(dailyCurrency)
      return
    }

    if(!currency) {
      setError('Please enter a currency.')
      setLoading(false)
      return
    }

    const hasCurrency = digitalCurrencies.find(c => c.code.toLocaleLowerCase() === currency.toLocaleLowerCase())
    if(!hasCurrency) {
      setError('Currency not found.')
      setLoading(false)
      return
    }

    setCurrency(null)
    setLoading(true)

    const response = await getCurrencyDaily(currency)
    if(response?.error) {
      setError(response?.message || 'Something went wrong, please try again later.')
    } else {
      setCurrency(response as any)
      setDailyCurrency(response as any)
    }
    setLoading(false)
  }

  const setAndSearch = (currency: string) => {
    setSearchCurrency(currency)
    handleSearchMontly(currency)
  }

  return (
    <main className="flex min-h-screen flex-col px-8 py-4 bg-slate-950">
        <div className="flex flex-col md:flex-row gap-4 max-w-screen-2xl">
        <section className="w-full md:w-9/12">
          <h1 className="text-white text-xl mb-4">Currency Tracker</h1>
          <div className="flex flex-col mb-4">
            <label htmlFor="currency" className="text-xs text-white mb-1">Search for a currency</label>
          <div className="flex relative w-fit">
            <input name="currency" id="currency" className="text-white p-1 rounded-sm bg-slate-800" type="text" value={searchCurrency} onChange={(e)=> {setSearchCurrency(e.target.value)}} onInput={()=> setError('')} />
            <button className="z-10 absolute bg-slate-700 text-white text-xs px-2 h-full rounded-sm right-0 top-0 border border-transparent hover:border-indigo-500" onClick={()=> handleSearchMontly()}>Search</button>
          </div>
          <div className="text-xs text-red-500">{error}</div>
          </div>

          {loading && (
            <div role="status" className="w-full h-full flex items-center justify-center">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin  fill-indigo-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            <span className="sr-only">Loading...</span>
            </div>
          )}

          {currency && (
            <div className="relative">
              <FinancialChart data={currency.data} currency={currency.currencyCode} />
              <div className="flex gap-2 absolute top-0 right-0 z-10">
                <button 
                  className="text-xs bg-indigo-500 text-white p-1 rounded-sm" onClick={()=> handleSearchMontly()}>
                  Montly
                </button>
                <button 
                  className="text-xs bg-indigo-500 text-white p-1 rounded-sm" onClick={()=> handleSearchDaily()}>
                    Daily
                </button>
              </div>
            </div>
          )}
        </section>
        <div className="w-full md:w-3/12 flex flex-col gap-4 ">
          <section >
            <div className="bg-slate-500/20 backdrop-blur-md p-4 rounded-md text-white">
              <h3 className="mb-4 text-sm">Most popular currencies</h3>
              <ul className="flex flex-col gap-1">
                {POPULAR_CURRENCIES.map((currency) => (
                  <li className="text-sm" key={currency.code}>
                    <button 
                      onClick={()=> setAndSearch(currency.code)}
                      className=" w-fit flex gap-2 py-1 px-2 -ml-2 items-center rounded-md text-left border border-transparent hover:border-white"
                    >
                      <Image src={currency.icon} alt={currency.name} width={30} height={30} />
                      <div className="flex text-xs md:flex-col gap-2 md:gap-0 lg:gap-2 lg:flex-row ">
                        <span><strong className="md:hidden">Name:</strong> {currency.name}</span>
                        <span className="md:hidden lg:block">|</span>
                        <span><strong className="md:hidden">Code:</strong> {currency.code}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <button className='mt-4 text-sm' onClick={()=> setShowCurrencyListModal(true)}>Check the full list</button>
            </div>
          </section>

          <section>
            <div className="bg-slate-500/20 backdrop-blur-md p-4 rounded-md text-white">
              <h3 className="mb-4 text-sm">Currency converter</h3>
              <CurrencyConverter selectedCurrency={searchCurrency} />
            </div>
          </section>
        </div>
        <CurrencyListModal handleClose={()=> setShowCurrencyListModal(false)} isOpen={showCurrencyListModal} setAndSearch={setAndSearch} />
      </div>
    </main>
  );
}

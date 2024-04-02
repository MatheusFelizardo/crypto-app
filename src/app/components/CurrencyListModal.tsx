'use client';

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import digitalCurrencies from '../../../public/digital_currency_list.json';

interface CurrencyListModalProps {
  handleClose: () => void
  setAndSearch: (currency: string) => void
  isOpen: boolean
}

interface CurrencyList {
  code: string
  name: string
}

interface ListItemProps {
  currency: CurrencyList
  handleSearch: (currency: string) => void
}

const ListItem = ({currency, handleSearch}: ListItemProps) => {
  return (
    <div>
      <button className='flex py-1 gap-2 text-sm rounded-md px-2 border border-transparent hover:border-white' onClick={()=> handleSearch(currency.code)}>
        <span>Name: {currency.name}</span>
        <span> | </span>
        <span>Code: {currency.code}</span>
      </button>
    </div>
  )

}

const CurrencyListModal = ({handleClose, isOpen, setAndSearch}: CurrencyListModalProps) => {
  const [currencies, setCurrencies] = useState<CurrencyList[] | null>(null)
  const [searchInput, setSearchInput] = useState<string>('')
  const [search, setSearch] = useState<any>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=> {
    const getCurrencies = async () => {
      const response = await fetch('/digital_currency_list.json')
      const data = await response.json()
      setCurrencies(data)
    }

    getCurrencies()
  }, [])

  const filterCurrencies = (e:ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    const searchedValue = e.target.value.toLocaleLowerCase()
    setSearchInput(e.target.value)
    const filteredCurrencies = digitalCurrencies.map((currency: CurrencyList) => {
      if (currency.name.toLocaleLowerCase().includes(searchedValue) || currency.code.toLocaleLowerCase().includes(searchedValue)) {
        return currency
      }
      return undefined
    }).filter((currency) => currency !== undefined)
    setSearch(filteredCurrencies)
    setIsLoading(false)
  }

  const handleSearch = (currency: string) => {
    setAndSearch(currency)
    closeModal()
  }

  const closeModal = () => {
    handleClose()
    setSearchInput('')
    setSearch('')
  }

  if (!isOpen) return null

  return (
    createPortal(
      <div className='fixed left-0 top-0 w-full h-full flex items-center justify-center px-4 lg:px-32 py-16 z-50'>
        <div className='absolute bg-black/50 w-full h-full'></div>
        <div className='w-full h-full bg-black border border-indigo-500 rounded-lg z-10 relative text-white py-4 px-2'>
          <button className='absolute right-5 top-5' onClick={closeModal}>
            <Image src='/icons/close.svg' alt='Close' width={20} height={20} />
          </button>
          <div className='flex flex-col lg:flex-row justify-between w-[calc(100%-4rem)] px-2'>
            <h1 className=' mb-4 text-indigo-500'>Listing all availabe currencies </h1>
            <div className='relative h-full'>
              <label htmlFor='search' className='sr-only'>Search</label>
              <input value={searchInput} onInput={filterCurrencies} className='text-black px-2 rounded-md placeholder:text-xs' type='text' placeholder='Search by name or code...' />
              {
                searchInput && 
                <button className='absolute right-2 p-1 top-1/2 -translate-y-1/2 z-20' onClick={()=> {
                  setSearchInput('')
                  setSearch('')
                }}>
                  <div className='relative flex items-center justify-center w-[10px] h-[10px]'>
                    <span className="block absolute w-[2px] h-3 bg-black rotate-45"></span>
                    <span className="block absolute w-[2px] h-3 bg-black -rotate-45"></span>
                  </div>
                </button>
              }
            </div>
          </div>
          <div id="currency-list-container" className='flex flex-col gap-1 mt-4 max-h-[calc(100%-6rem)] overflow-y-auto'>
          {isLoading && <div>Loading...</div>}
          {
            !isLoading && search  && search.map((currency: CurrencyList) => {
              return (
                <ListItem key={JSON.stringify(currency)} currency={currency} handleSearch={handleSearch}  />
              )
            })
          }
          {!isLoading && currencies && !search && currencies.map((currency) => {
              return (
                <ListItem key={JSON.stringify(currency)} currency={currency} handleSearch={handleSearch}  />
              )
            })}
          </div>
        </div>
      </div>,
      document.body
    )
  )
}

export default CurrencyListModal
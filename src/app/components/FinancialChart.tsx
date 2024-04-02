import React, { use, useEffect, useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { CurrencyInfo } from '../utils';
import 'chart.js/auto'
import {Chart as ChartJS} from 'chart.js/auto'

interface ChartData {
  labels: string[]
  open: number[]
  high: number[]
  low: number[]
  close: number[]
}

const FinancialChart = ({ data, currency }: { data: CurrencyInfo[], currency: string }) => {
  const chartRef = useRef<any>(null)
  const revertedData = useMemo(() => data.slice().reverse(), [data])
  const formatedData = {
    labels: [],
    open: [],
    high: [],
    low: [],
    close: []
  } as ChartData

  revertedData.forEach(d => {
    formatedData.labels.push(d.date)
    formatedData.open.push(d.open['USD'])
    formatedData.high.push(d.high['USD'])
    formatedData.low.push(d.low['USD'])
    formatedData.close.push(d.close['USD'])
  })

  const chartData = useMemo(() => ({
    labels: formatedData.labels, 
    datasets: [
      {
        label: 'Open',
        data: formatedData.open, 
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6', 
      },
      {
        label: 'High',
        data: formatedData.high, 
        backgroundColor: '#10B981',
        borderColor: '#10B981', 
      },
      {
        label: 'Low',
        data: formatedData.low, 
        backgroundColor: '#EF4444',
        borderColor: '#EF4444', 
      },
      {
        label: 'Close',
        data: formatedData.close,
        backgroundColor: '#6B7280',
        borderColor: '#6B7280', 
      },
    ],
  }), [formatedData.close, formatedData.high, formatedData.labels, formatedData.low, formatedData.open]);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
  }

  useEffect(() => {
    window?.addEventListener('resize', () => {
      const chart = chartRef?.current
      if (!chart) return
      chart?.resize()
    })

    return () => {
      window?.removeEventListener('resize', () => {
        const chart = chartRef?.current
        if (!chart) return
        chart?.resize()
      })
    }

  }, [chartRef])

  return (
    <div className="text-white w-full h-full">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default FinancialChart;

import React, { useState } from 'react'
import NavbarR from '../components/NavbarR'
import axios from "axios"

const Report = () => {
  const [range, setRange] = useState({ start: '', end: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sum, setSum] = useState(0);

  const handleReceipt = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/receipt/report`, {
        params: { 
          receipeNumber: range.start, 
          endNumber: range.end 
        }
      });
      setSum(response.data.totalAmount);
      setResults(response.data.data); 
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <> 
      <NavbarR />
      {/* Added p-8 for padding and mx-auto to center */}
      <div className='p-8 max-w-4xl mx-auto space-y-6'>
        
        <div className='bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300'>
          <h1 className='text-2xl font-bold mb-4 text-center'>Financial Report</h1>
          
          <div className='flex flex-col md:flex-row gap-4'>
            <input 
              type="number" 
              placeholder="Start Receipt #" 
              className="input input-bordered w-full"
              value={range.start}
              onChange={(e) => setRange({...range, start: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="End Receipt #" 
              className="input input-bordered w-full"
              value={range.end}
              onChange={(e) => setRange({...range, end: e.target.value})}
            />
            <button onClick={handleReceipt} className='btn btn-primary px-8'>
              {loading ? 'Searching...' : 'Generate Report'}
            </button>
          </div>
        </div>

        <div className='space-y-4'>
          {/* Header */}
          {results.length > 0 && (
            <div className="flex justify-between px-4 text-xs font-bold uppercase text-base-content/50">
              <span>Details</span>
              <span>Amount</span>
            </div>
          )}

          {/* The List */}
          <div className='max-h-96 overflow-y-auto pr-2 space-y-2'>
            {results.map((item) => (
              <div key={item._id} className='p-4 bg-base-200/50 hover:bg-base-200 border border-base-300 rounded-xl flex justify-between items-center transition-all'>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary">#{item.receiptNumber}</span>
                  <span className="font-medium">{item.description}</span>
                </div>
                <div className="text-right">
                  <span className='font-mono font-bold text-lg'>{item.amount.toLocaleString()}</span>
                  <span className="text-xs ml-1 opacity-50">EGP</span>
                </div>
              </div>
            ))}
          </div>

          
          {results.length > 0 && (
            <div className='mt-8 p-6 bg-primary text-primary-content rounded-2xl shadow-lg flex justify-between items-center'>
              <div>
                <p className="text-sm opacity-80 uppercase tracking-widest font-bold">Total Balance</p>
                <h2 className="text-3xl font-black">Report Summary</h2>
              </div>
              <div className="text-right">
                <p className="text-4xl font-mono font-black">
                  {sum.toLocaleString()} 
                  <span className="text-sm ml-2">EGP</span>
                </p>
                <p className="text-xs opacity-70">{results.length} Receipts found</p>
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {results.length === 0 && !loading && (
            <div className="text-center py-20 opacity-30 bg-base-200 rounded-2xl border-2 border-dashed border-base-300">
              <p className="italic">Enter a range and click search to see results.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Report
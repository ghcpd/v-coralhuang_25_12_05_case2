import React, { useState } from 'react'
import axios from 'axios'

export default function Booking({ apiBase, token }){
  const [type, setType] = useState('tours')
  const [itemId, setItemId] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')

  async function createBooking(e){
    e.preventDefault();
    try{
      const payload = { type, item_id: Number(itemId), amount_cents: Math.round(parseFloat(amount || '0')*100) }
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.post(`${apiBase}/bookings`, payload, { headers });
      setStatus('booking created: ' + JSON.stringify(res.data))
    }catch(err){ console.error(err); setStatus('booking failed: ' + (err.response?.data?.error || err.message)) }
  }

  return (
    <div className="card">
      <h3>Create booking</h3>
      <form onSubmit={createBooking} className="booking-form">
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="tours">Tour</option>
          <option value="flights">Flight</option>
          <option value="hotels">Hotel</option>
        </select>
        <input placeholder="item id" value={itemId} onChange={e=>setItemId(e.target.value)} />
        <input placeholder="amount (USD)" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button type="submit">Book</button>
      </form>
      {status && <div style={{marginTop:8,color:'#dfffe8'}}>{status}</div>}
    </div>
  )
}

import React from 'react'
import axios from 'axios'

export default function Booking({item, type}){
  async function book(){
    // For prototype: call backend to create booking (assumes auth)
    const res = await axios.post('/api/bookings', {type, providerId: item.id});
    alert('Booking created: ' + JSON.stringify(res.data.booking));
  }
  return (
    <div>
      <button onClick={book}>Book</button>
    </div>
  )
}

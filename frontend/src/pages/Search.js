import React, {useState} from 'react';
import axios from 'axios';

function BookingForm({item}){
  const [loading, setLoading] = useState(false);
  const book = async () => {
    setLoading(true);
    try{
      const res = await axios.post((process.env.REACT_APP_API_URL||'http://localhost:4000') + '/api/bookings', {userId:1, items:[item], totalAmount: item.price});
      alert('Created booking: ' + JSON.stringify(res.data.booking));
    }catch(e){
      alert('Error: ' + e.message);
    }finally{setLoading(false)}
  }
  return <button onClick={book} disabled={loading}>{loading? 'Booking...':'Book'}</button>
}

export default function Search(){
  const [results] = useState([
    {id: 'tour-1', title: 'City Tour', price: 49.99},
    {id: 'tour-2', title: 'Mountain Hike', price: 129.00}
  ]);

  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map(r => (
          <li key={r.id} style={{marginBottom:12}}>
            <strong>{r.title}</strong> — ${r.price.toFixed(2)} <BookingForm item={r} />
          </li>
        ))}
      </ul>
    </div>
  );
}

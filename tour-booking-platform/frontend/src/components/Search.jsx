import React, {useState} from 'react'
import axios from 'axios'

export default function Search(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  async function doSearch(){
    setLoading(true)
    const res = await axios.get('/api/search?q=' + encodeURIComponent(q));
    setResults(res.data.results)
    setLoading(false)
  }

  return (
    <div>
      <div style={{display: 'flex', gap: 8}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for destination or tour" />
        <button onClick={doSearch}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {results && (
        <div>
          <h3>Flights</h3>
          <ul>{results.flights.map(f => <li key={f.id}>{f.id} - {f.price/100} {f.currency}</li>)}</ul>
          <h3>Hotels</h3>
          <ul>{results.hotels.map(h => <li key={h.id}>{h.id} - {h.price/100} {h.currency}</li>)}</ul>
        </div>
      )}
    </div>
  )
}

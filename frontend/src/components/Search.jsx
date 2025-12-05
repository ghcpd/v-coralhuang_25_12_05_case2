import React, { useState } from 'react'
import axios from 'axios'

export default function Search({ apiBase, onResults }){
  const [type, setType] = useState('tours')
  const [q, setQ] = useState('')

  async function doSearch(e){
    e.preventDefault()
    try{
      const res = await axios.get(`${apiBase}/search`, { params: { type, q }})
      onResults(res.data)
    }catch(err){
      console.error(err)
      onResults({ error: 'search failed' })
    }
  }

  return (
    <form className="search" onSubmit={doSearch}>
      <div className="form-row">
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="tours">Tours</option>
          <option value="flights">Flights</option>
          <option value="hotels">Hotels</option>
        </select>
        <input placeholder="Search (e.g., Paris, NYC)" value={q} onChange={e => setQ(e.target.value)} />
        <button type="submit">Search</button>
      </div>
    </form>
  )
}

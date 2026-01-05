import React from 'react'
import Search from './components/Search'

export default function App(){
  return (
    <div style={{fontFamily: 'sans-serif', padding: 20}}>
      <h1>Tour Booking Platform (Prototype)</h1>
      <p>Search and book tours, flights, and hotels.</p>
      <Search />
    </div>
  )
}

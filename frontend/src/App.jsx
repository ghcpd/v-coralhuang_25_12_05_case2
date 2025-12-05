import React, {useState} from 'react'
import axios from 'axios'
import Search from './components/Search'
import Auth from './components/Auth'
import Booking from './components/Booking'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export default function App(){
  const [results, setResults] = useState(null)
  const [token, setToken] = useState('')

  return (
    <div className="app-root">
      <header className="header"><h1>Tour & Travel — MVP</h1></header>
      <main className="main">
        <div style={{display:'flex', gap: 12, alignItems:'flex-start'}}>
          <Search apiBase={API_BASE} onResults={setResults} />
          <div style={{minWidth:320}}>
            <Auth apiBase={API_BASE} onAuth={setToken} />
            <Booking apiBase={API_BASE} token={token} />
          </div>
        </div>

        <section className="results">
          {results ? (
            <pre>{JSON.stringify(results, null, 2)}</pre>
          ) : (
            <p>Search for tours, flights or hotels using the controls above.</p>
          )}
        </section>
      </main>
      <footer className="footer">Built for demo — payment flow uses Stripe test keys (server side placeholder)</footer>
    </div>
  )
}

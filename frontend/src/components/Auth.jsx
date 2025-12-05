import React, { useState } from 'react'
import axios from 'axios'

export default function Auth({ apiBase, onAuth }){
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('password')
  const [name, setName] = useState('')
  const [mode, setMode] = useState('login')
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault();
    try{
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const res = await axios.post(`${apiBase}${path}`, { email, password, name });
      onAuth(res.data.token)
      setMsg('Authenticated — token stored in-memory for this session')
    }catch(err){ console.error(err); setMsg('auth failed') }
  }

  return (
    <div className="card">
      <h3>{mode === 'login' ? 'Sign in' : 'Register'}</h3>
      <form onSubmit={submit} className="auth-form">
        {mode === 'register' && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <div style={{display:'flex', gap:8}}>
          <button type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
          <button type="button" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Register':'Back to login'}</button>
        </div>
      </form>
      {msg && <div style={{marginTop:8,color:'#a5d8ff'}}>{msg}</div>}
    </div>
  )
}

import { useState } from 'react';
import api, { errorText } from '../api';
export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setMessage(''); setBusy(true);
    if (isRegister && form.password.length < 6) { setMessage('Password must be at least 6 characters'); setBusy(false); return; }
    try {
      if (isRegister) { await api.post('/users/register', form); setIsRegister(false); setMessage('Account created. You can now log in.'); }
      else { const { data } = await api.post('/users/login', { email: form.email, password: form.password }); onLogin(data); }
    } catch (err) { setMessage(errorText(err)); } finally { setBusy(false); }
  }
  return <section className="auth-layout">
    <div className="auth-art"><div><span className="eyebrow">YOUR GAME. YOUR SPACE.</span><h1>Find your game.<br/>Book your ground.</h1><p>From quick matches to weekend tournaments, your next favourite sports space is just a few clicks away.</p></div><div className="auth-quote">✦ &nbsp; Less planning. More playing.</div></div>
    <div className="auth-form-wrap"><form onSubmit={submit} className="auth-form">
      <span className="eyebrow">WELCOME TO SPORTSPACE</span><h2>{isRegister ? 'Create your account' : 'Good to see you'}</h2><p className="intro">{isRegister ? 'Join the community and get your next game on the calendar.' : 'Log in to explore venues and manage your bookings.'}</p>
      {isRegister && <><label className="form-label" htmlFor="name">Full name</label><input className="form-field" id="name" name="name" placeholder="Your name" value={form.name} onChange={change} required /></>}
      <label className="form-label" htmlFor="email">Email address</label><input className="form-field" id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={change} required />
      <label className="form-label" htmlFor="password">Password</label><input className="form-field" id="password" name="password" type="password" placeholder="Enter your password" value={form.password} onChange={change} required minLength={6} />
      {message && <div className={'notice ' + (message.includes('created') ? 'ok' : 'err')}>{message}</div>}
      <button className="button button-primary" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account →' : 'Log in →'}</button>
      <div className="auth-switch">{isRegister ? 'Already have an account?' : 'New to SportSpace?'} <button type="button" onClick={() => { setIsRegister(!isRegister); setMessage(''); }}>{isRegister ? 'Log in' : 'Create an account'}</button></div>
    </form></div>
  </section>;
}

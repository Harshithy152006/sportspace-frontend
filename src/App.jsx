import { useState } from 'react';
import Login from './pages/Login.jsx';
import Venues from './pages/Venues.jsx';
import Bookings from './pages/Bookings.jsx';
import Manage from './pages/Manage.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [tab, setTab] = useState('venues');
  const login = (u) => { localStorage.setItem('user', JSON.stringify(u)); setUser(u); setTab('venues'); };
  const logout = () => { localStorage.removeItem('user'); setUser(null); setTab('venues'); };
  return <div className="app-shell">
    <header className="site-header">
      <button className="brand" onClick={() => setTab('venues')} aria-label="SportSpace home"><span className="brand-mark">S</span><span>SportSpace<small>PLAY MORE. BOOK EASY.</small></span></button>
      <nav className="main-nav" aria-label="Main navigation">
        {user ? <>
          <button className={tab === 'venues' ? 'nav-link active' : 'nav-link'} onClick={() => setTab('venues')}>Explore venues</button>
          <button className={tab === 'bookings' ? 'nav-link active' : 'nav-link'} onClick={() => setTab('bookings')}>{user.role === 'ADMIN' ? 'Booking requests' : 'My bookings'}</button>
          {user.role === 'ADMIN' && <button className={tab === 'manage' ? 'nav-link active' : 'nav-link'} onClick={() => setTab('manage')}>Sports & slots</button>}
          <span className="user-pill"><span className="avatar">{(user.name || 'U').slice(0,1).toUpperCase()}</span>{user.name}</span>
          <button className="button button-outline header-logout" onClick={logout}>Log out</button>
        </> : <span className="nav-note">Your next game starts here</span>}
      </nav>
    </header>
    <main className="main-content">{!user ? <Login onLogin={login} /> : tab === 'venues' ? <Venues user={user} /> : tab === 'bookings' ? <Bookings user={user} /> : <Manage />}</main>
    <footer className="site-footer"><div className="footer-brand"><span className="brand-mark">S</span><span><b>SportSpace</b><small>Make time for your game.</small></span></div><span>Find a court. Bring your team. Play your best.</span><span>© {new Date().getFullYear()} SportSpace</span></footer>
  </div>;
}

import { useEffect, useState } from 'react'; import api, { errorText } from '../api';
// Admin only: step 3 of the admin workflow (sports and time slots).
export default function Manage() {
  const [sports, setSports] = useState([]); const [slots, setSlots] = useState([]);
  const [sportName, setSportName] = useState(''); const [sportEditId, setSportEditId] = useState(null);
  const [slotForm, setSlotForm] = useState({ startTime: '', endTime: '' });
  const [message, setMessage] = useState(''); const [ok, setOk] = useState(false);
  const show = (text, good) => { setMessage(text); setOk(good); };
  const load = () => Promise.all([api.get('/sports'), api.get('/slots')]).then(([a, b]) => { setSports(a.data); setSlots(b.data); }).catch((e) => show(errorText(e), false));
  useEffect(() => { load(); }, []);
  const run = async (fn, text) => { try { await fn(); show(text, true); load(); } catch (e) { show(errorText(e), false); } };
  const saveSport = (e) => { e.preventDefault(); run(async () => { if (sportEditId) await api.put('/sports/' + sportEditId, { name: sportName }); else await api.post('/sports', { name: sportName }); setSportName(''); setSportEditId(null); }, 'Sport saved'); };
  const addSlot = (e) => { e.preventDefault(); run(async () => { await api.post('/slots', { ...slotForm, active: true }); setSlotForm({ startTime: '', endTime: '' }); }, 'Slot added'); };
  const toggle = (s) => run(() => api.put('/slots/' + s.id, { startTime: s.startTime, endTime: s.endTime, active: !s.active }), 'Slot updated');
  return (
    <div>
      <p className={ok ? 'ok' : 'err'}>{message}</p>
      <div className="card">
        <b>Sports</b>
        <form onSubmit={saveSport}>
          <input placeholder="Sport name" value={sportName} onChange={(e) => setSportName(e.target.value)} required />{' '}
          <button>{sportEditId ? 'Rename' : 'Add sport'}</button>{' '}
          {sportEditId && <button type="button" onClick={() => { setSportEditId(null); setSportName(''); }}>Cancel</button>}
        </form>
        {sports.map((s) => (
          <div key={s.id}>{s.name}{' '}
            <button onClick={() => { setSportEditId(s.id); setSportName(s.name); }}>Rename</button>{' '}
            <button onClick={() => run(() => api.delete('/sports/' + s.id), 'Sport deleted')}>Delete</button></div>
        ))}
      </div>
      <div className="card">
        <b>Time slots</b>
        <form onSubmit={addSlot}>
          <input type="time" value={slotForm.startTime} onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} required />{' '}
          <input type="time" value={slotForm.endTime} onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} required />{' '}
          <button>Add slot</button>
        </form>
        {slots.map((s) => (
          <div key={s.id}>{s.startTime.slice(0, 5)}–{s.endTime.slice(0, 5)} <span className={'tag ' + (s.active ? 'APPROVED' : 'REJECTED')}>{s.active ? 'ACTIVE' : 'INACTIVE'}</span>{' '}
            <button onClick={() => toggle(s)}>{s.active ? 'Deactivate' : 'Activate'}</button>{' '}
            <button onClick={() => run(() => api.delete('/slots/' + s.id), 'Slot deleted')}>Delete</button></div>
        ))}
      </div>
    </div>
  );
}

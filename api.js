// The ONLY file that talks to a back end. For now it uses sample data and the browser's own storage.
// Phase A step 2: set APPS_SCRIPT_URL to the new (third) Apps Script deployment and fill in the calls below.
(function () {
  const APPS_SCRIPT_URL = ''; // e.g. https://script.google.com/macros/s/XXXX/exec  (empty = demo mode)
  const DEMO = !APPS_SCRIPT_URL;
  const D = window.LC_DATA;
  const get = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage may be blocked */ } };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const iso = (d) => d.toISOString().slice(0, 10);
  function seedBookings() {
    const t = new Date(); const d1 = new Date(t); d1.setDate(t.getDate() + 1); const d2 = new Date(t); d2.setDate(t.getDate() + 9);
    return [
      { id: 'b1', room: 'Empower Room', date: iso(d1), start: '[Start]', end: '[End]', status: 'Approved' },
      { id: 'b2', room: '[Room name]', date: iso(d2), start: '[Start]', end: '[End]', status: 'Pending' }
    ];
  }
  window.LC_API = {
    demo: DEMO,
    async requestCode(email) { await wait(300); if (DEMO) return { ok: true, hint: '123456' }; throw new Error('Not connected yet'); },
    async verifyCode(email, code) { await wait(300); if (DEMO) return code === '123456' ? { ok: true, email } : { ok: false }; throw new Error('Not connected yet'); },
    async getBookings(email) { await wait(150); if (DEMO) return get('lc.bookings', seedBookings()); throw new Error('Not connected yet'); },
    async createBooking(email, b) {
      await wait(300);
      if (!DEMO) throw new Error('Not connected yet');
      const list = get('lc.bookings', seedBookings()); list.push({ id: 'b' + Date.now(), status: 'Pending', ...b }); set('lc.bookings', list); return { ok: true };
    },
    async getPins() { if (DEMO) return get('lc.pins', D.seedPins); return D.seedPins; },
    async addPin(pin) { const list = get('lc.pins', D.seedPins); list.unshift({ id: 'p' + Date.now(), status: 'pending', ...pin }); set('lc.pins', list); return { ok: true }; },
    store: { get, set }
  };
})();

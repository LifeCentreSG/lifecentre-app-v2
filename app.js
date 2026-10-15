(function () {
  'use strict';
  const D = window.LC_DATA, API = window.LC_API, S = API.store;
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const I = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    book: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>', back: '<path d="M15 6l-6 6 6 6"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/>',
    pin: '<path d="M9 3h6l-1 6 3 3H7l3-3z"/><path d="M12 15v6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    mail: '<path d="M3 6h18v12H3zM3 6l9 7 9-7"/>', chev: '<path d="M9 6l6 6-6 6"/>',
    full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
  };
  const svg = (k, s, w) => '<svg aria-hidden="true" width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round">' + I[k] + '</svg>';
  const play = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const pause = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

  const st = { member: S.get('lc.member', null), bookings: [], pins: [], seen: S.get('lc.seen', {}), signin: { step: 'email', email: '', msg: '' }, room: 'empower' };
  const today = new Date();
  const iso = (d) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };
  const fmt = (d, o) => d.toLocaleDateString('en-GB', o);
  const fromIso = (s) => new Date(s + 'T00:00:00');

  /* ---------- tab bar ---------- */
  const TABS = [['home', 'Home', 'home'], ['book', 'Book', 'book'], ['news', 'Soon', 'news'], ['contact', 'Contact', 'chat']];
  function route() { const h = (location.hash || '#/home').replace('#/', ''); return TABS.some((t) => t[0] === h && h !== 'news') ? h : 'home'; }
  function tabbar(cur) {
    $('#tabbar').innerHTML = TABS.map(([id, label, icon]) => {
      if (id === 'news') return '<button class="tab" disabled aria-disabled="true" aria-label="News and sermons, coming soon">' + svg(icon) + label + '</button>';
      const on = id === cur;
      return '<button class="tab" data-go="' + id + '"' + (on ? ' aria-current="page"' : '') + '>' + svg(icon, 20, on ? 2 : 1.8) + label + '</button>';
    }).join('');
  }

  /* ---------- home ---------- */
  function verseOfDay() { const n = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 864e5); return D.verses[n % D.verses.length]; }
  function nextServiceDate() { const d = new Date(today); d.setDate(d.getDate() + ((7 - d.getDay()) % 7)); return d; }
  function weekStrip() {
    const mon = new Date(today); mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const book = new Set((st.member ? st.bookings : []).map((b) => b.date));
    const days = [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; });
    const sun = days[6];
    return '<section class="week glass" aria-label="This week"><div class="row small"><span class="muted">This week</span><b>' + fmt(days[0], { day: 'numeric', month: 'short' }) + '–' + fmt(sun, { day: 'numeric', month: 'short' }) + '</b></div><div class="days">' +
      days.map((d) => { const t = iso(d) === iso(today); const ev = d.getDay() === 0 || book.has(iso(d)); return '<div class="day' + (t ? ' today' : '') + '"' + (t ? ' aria-current="date"' : '') + '><span class="d">' + 'MTWTFSS'[(d.getDay() + 6) % 7] + '</span><span class="n">' + d.getDate() + '</span><span class="dot' + (ev ? ' on' : '') + '"></span></div>'; }).join('') + '</div></section>';
  }
  function yourWeek() {
    const items = [];
    if (st.member) st.bookings.filter((b) => b.date >= iso(today)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 2).forEach((b) => items.push({ go: 'book', dot: b.status === 'Approved' ? 'var(--ok)' : 'var(--warn)', tag: b.status, nm: b.room, l1: fmt(fromIso(b.date), { weekday: 'short', day: 'numeric', month: 'short' }), l2: b.start + '–' + b.end }));
    const sv = D.services[0], sd = nextServiceDate();
    items.push({ go: 'home', dot: 'var(--info)', tag: 'Service', nm: sv.name, l1: fmt(sd, { weekday: 'short', day: 'numeric', month: 'short' }), l2: sv.time });
    if (items.length < 2) items.push({ go: 'book', dot: '#8A94A6', tag: 'Bookings', nm: 'Book a room', l1: 'Members can book', l2: 'Sign in to start' });
    return '<section aria-label="Your week" style="display:flex;flex-direction:column;gap:12px"><div class="row"><h2 class="sec-title">Your week</h2><button class="small" data-go="book" style="background:none;border:0;font-weight:600;cursor:pointer;color:var(--muted)">See all</button></div><div class="tiles">' +
      items.slice(0, 2).map((t) => '<button class="tile glass" data-go="' + t.go + '"><span class="st"><b style="background:' + t.dot + '"></b>' + esc(t.tag) + '</span><span class="nm">' + esc(t.nm) + '</span><span class="small muted">' + esc(t.l1) + '<br>' + esc(t.l2) + '</span></button>').join('') + '</div></section>';
  }
  function pinCard(p) {
    const wait = p.status === 'pending' ? '<span class="wait">Waiting for approval</span>' : '';
    const by = '<span class="by">Pinned by ' + esc(p.by) + '</span>';
    if (p.type === 'picture') return '<div class="pin photo glass"><img src="' + esc(p.img) + '" alt="' + esc(p.text || 'Pinned picture') + '">' + '<div class="meta">' + (p.text ? '<div class="small"><b>' + esc(p.text) + '</b></div>' : '') + by + wait + '</div></div>';
    return '<div class="pin glass"><span class="t">' + (p.type === 'verse' ? '“' + esc(p.text) + '”' : esc(p.text)) + '</span>' + (p.ref ? '<span class="small muted">' + esc(p.ref) + '</span>' : '') + by + wait + '<svg class="pn" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + I.pin + '</svg></div>';
  }
  function pinboard() {
    const mine = st.member ? st.member.email : null;
    const list = st.pins.filter((p) => p.status === 'approved' || (p.status === 'pending' && p.owner === mine));
    return '<section aria-label="Pinboard" style="display:flex;flex-direction:column;gap:12px"><div class="row"><div><h2 class="sec-title">Pinboard</h2><div class="small muted">Verses, pictures and notes from the church family</div></div><button class="btn sm" data-act="pin">' + svg('plus', 16, 2.4) + 'Pin</button></div><div class="pins">' + (list.length ? list.map(pinCard).join('') : '<p class="muted small">Nothing pinned yet. Be the first.</p>') + '</div></section>';
  }
  function home() {
    const v = verseOfDay(), c = D.conference, dev = D.speakers[0];
    const stories = D.speakers.map((s, i) => '<button class="story" data-story="' + i + '" aria-label="Open story: ' + esc(s.label) + '"><span class="ring' + (st.seen[s.id] || s.seen ? ' seen' : '') + '"><i style="background:' + s.color + '">' + esc(s.initials) + '</i></span><span class="cap">' + esc(s.label) + '</span></button>').join('');
    return '<div class="hello">Hello' + (st.member ? ', ' + esc(st.member.email.split('@')[0]) : '') + '</div>' +
      '<header class="top"><div><h1 class="h1a">Today</h1><p class="h1b">' + fmt(today, { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '') + '</p></div><button class="round soft" aria-label="Notifications (coming soon)" disabled>' + svg('bell') + '</button></header>' +
      '<section class="stories" aria-label="Stories from our pastors">' + stories + '</section>' +
      '<section class="verse glass" aria-label="Verse of the day"><div class="head"><span>Verse of the day</span><span>KJV</span></div><div class="card"><p>“' + esc(v.t) + '”</p><div class="small muted">' + esc(v.r) + '</div><div class="row" style="margin-top:18px"><button class="btn sm" data-act="save">' + svg('bookmark', 16, 2) + '<span id="savelbl">Save verse</span></button><button class="circle-out" data-act="share" aria-label="Share verse">' + svg('share', 18, 2) + '</button></div></div><button class="nextup" data-story="0"><span class="muted">Next up</span><b>Today’s devotion with ' + esc(dev.name) + '</b></button></section>' +
      '<button class="conf" data-act="splash" aria-label="' + esc(c.name) + ' ' + esc(c.year) + ', see details"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px"><span class="small" style="color:#AFC0E4;font-weight:600">Coming up</span><span class="t">' + esc(c.name) + '</span><span class="small" style="color:#C3D0EC">' + esc(c.year) + ' · ' + esc(c.venue) + '</span></div><span class="pill">Register</span></button>' +
      weekStrip() + yourWeek() + pinboard() +
      '<section class="dev glass" aria-label="Today\'s devotion"><div class="small muted">Today’s devotion</div><div class="r"><div class="p">' + esc(dev.initials) + '</div><div style="flex:1;min-width:0"><div class="tt">' + esc(dev.title) + '</div><div class="small muted">' + esc(dev.name) + ' · Audio · ' + Math.round(dev.seconds / 60) + ' min</div></div><button class="play" data-story="0" aria-label="Play today\'s devotion">' + play + '</button></div></section>';
  }

  /* ---------- book ---------- */
  function book() {
    const head = '<header class="top"><div><h1 class="h1a">Facilities</h1><p class="h1b">booking</p></div>' + (st.member ? '<button class="avatar" data-act="signout" aria-label="Signed in as ' + esc(st.member.email) + '. Tap to sign out">' + esc(st.member.email[0].toUpperCase()) + '</button>' : '<span class="round soft" aria-hidden="true">' + svg('bell') + '</span>') + '</header>';
    if (!st.member) {
      const s = st.signin, email = s.step === 'email';
      return head + '<section class="panel soft" aria-label="Sign in"><div class="head">Members only</div><div class="card"><h2 class="sec-title">Sign in to book a room</h2>' + (API.demo ? '<span class="demo">Demo mode: code is 123456</span>' : '') +
        '<p class="small muted" style="margin:0;line-height:1.5">' + (email ? 'We’ll email you a 6‑digit code. No password needed.' : 'We sent a 6‑digit code to ' + esc(s.email) + '. Paste or type it below.') + '</p>' +
        (email ? '<div class="field"><label for="em">Email address</label><input id="em" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" value="' + esc(s.email) + '"></div><div class="err" id="err" role="alert">' + esc(s.msg) + '</div><button class="btn block" data-act="sendcode">Send my code</button>'
          : '<div class="field"><label for="cd">6‑digit code</label><input id="cd" class="code" inputmode="numeric" autocomplete="one-time-code" maxlength="20" placeholder="••••••"></div><div class="err" id="err" role="alert">' + esc(s.msg) + '</div><button class="btn block" data-act="verify">Sign in</button>') +
        '</div><div class="foot">' + (email ? '<span class="muted">Not a member yet?</span><button data-go="contact">Contact us</button>' : '<button data-act="changeemail">Use a different email</button>') + '</div></section>' +
        '<p class="small muted" style="margin:0;padding:0 8px;line-height:1.5">Staff sign in with their Life Centre Google account.</p>';
    }
    const rooms = D.rooms.map((r) => '<button class="room" data-room="' + r.id + '" aria-pressed="' + (st.room === r.id) + '"><b>' + esc(r.name) + '</b><span>' + esc(r.capacity) + '</span></button>').join('');
    const rows = st.bookings.slice().sort((a, b) => a.date.localeCompare(b.date)).map((b) => '<div class="li"><div><div class="a">' + esc(b.room) + '</div><div class="b">' + esc(fmt(fromIso(b.date), { weekday: 'short', day: 'numeric', month: 'short' })) + ' · ' + esc(b.start) + '–' + esc(b.end) + '</div></div><span class="status"><b style="background:' + (b.status === 'Approved' ? 'var(--ok)' : 'var(--warn)') + '"></b>' + esc(b.status) + '</span></div>').join('');
    return head + '<section class="week soft" aria-label="Rooms"><div class="row small"><b>Choose a room</b><span class="muted">Members</span></div><div class="rooms">' + rooms + '</div><button class="btn block" data-act="newbook">' + svg('plus', 18, 2.2) + 'New booking</button></section>' +
      '<section style="display:flex;flex-direction:column;gap:10px"><h2 class="sec-title">Your bookings</h2><div class="list glass">' + (rows || '<div class="li muted">No bookings yet.</div>') + '</div></section>';
  }

  /* ---------- contact ---------- */
  function contact() {
    const c = D.church;
    const big = (href, ic, nm, sub) => (href ? '<a class="big glass" href="' + esc(href) + '">' : '<div class="big glass" aria-disabled="true">') + '<span class="ic">' + svg(ic, 18) + '</span><span class="nm">' + nm + '</span><span class="small muted">' + esc(sub) + '</span>' + (href ? '</a>' : '</div>');
    return '<header class="top"><div><h1 class="h1a">Contact us</h1><p class="h1b">Life Centre</p></div><span class="round soft" aria-hidden="true">' + svg('bell') + '</span></header>' +
      '<div class="bigs">' + big(c.whatsapp ? 'https://wa.me/' + c.whatsapp.replace(/\D/g, '') : '', 'chat', 'WhatsApp', c.whatsapp || '[Church number]') + big(c.phone ? 'tel:' + c.phone : '', 'phone', 'Call', c.phone || '[Office hours]') + '</div>' +
      '<div class="list glass"><a class="li" href="mailto:' + esc(c.email) + '"><div><div class="a">Email</div><div class="b">' + esc(c.email) + '</div></div>' + svg('chev', 18, 2) + '</a>' +
      '<a class="li" href="mailto:' + esc(c.email) + '?subject=Prayer%20request"><div><div class="a">Prayer request</div><div class="b">Shared only with the pastoral team</div></div>' + svg('chev', 18, 2) + '</a>' +
      '<a class="li" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.address) + '" target="_blank" rel="noopener"><div><div class="a">Plan a visit</div><div class="b">' + esc(c.address) + '</div></div>' + svg('chev', 18, 2) + '</a></div>';
  }

  /* ---------- render ---------- */
  async function refreshData() {
    st.pins = await API.getPins();
    st.bookings = st.member ? await API.getBookings(st.member.email).catch(() => []) : [];
  }
  async function render() {
    const r = route();
    tabbar(r);
    await refreshData();
    $('#view').innerHTML = r === 'book' ? book() : r === 'contact' ? contact() : home();
    document.title = 'Life Centre' + (r === 'home' ? '' : ' · ' + (r === 'book' ? 'Booking' : 'Contact'));
  }

  /* ---------- overlays ---------- */
  const ov = $('#overlay');
  let lastFocus = null;
  function openSheet(html, onMount) {
    lastFocus = document.activeElement;
    ov.innerHTML = '<div class="scrim" data-act="closesheet"><div class="sheet" role="dialog" aria-modal="true" tabindex="-1">' + html + '</div></div>';
    const sh = $('.sheet', ov); sh.focus(); if (onMount) onMount(sh);
  }
  function closeOverlay() { stopMedia(); ov.innerHTML = ''; document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  function openSplash() {
    const c = D.conference, colors = ['#FF5A36', '#FF7A3D', '#F59E5B', '#E8C27A', '#9EE0B8', '#5FD3C9', '#4CC3E8'], n = 44, on = 30;
    const ticks = [...Array(n)].map((_, i) => '<span style="height:' + (i < on ? 26 + (i % 3) * 4 + Math.round(i / on * 10) : 22) + 'px;background:' + (i < on ? colors[Math.min(6, Math.floor(i / on * 7))] : 'rgba(255,255,255,.28)') + '"></span>').join('');
    const dots = [['125px', '8%', 140, '#E5322D', 13], ['34px', '2%', 82, '#2F5BE8', 11], ['72%', '0', 70, '#B35FD6', 10], ['70%', '48%', 90, '#F3E31C', 11]];
    lastFocus = document.activeElement;
    ov.innerHTML = '<div class="splash" role="dialog" aria-modal="true" aria-label="' + esc(c.name) + ' ' + esc(c.year) + '"><div class="in"><div class="row mono small" style="color:#B9AEDB;padding-top:6px"><span>Life Centre presents</span></div><button class="xbtn" data-act="closesplash" aria-label="Close">' + svg('x') + '</button>' +
      '<div class="dots" aria-hidden="true"><i style="left:50%;top:22%;width:140px;height:140px;margin-left:-70px;background:#E5322D;box-shadow:0 0 60px rgba(229,50,45,.45)">[Speaker]</i><i style="left:6%;top:6%;width:82px;height:82px;background:#2F5BE8">[Speaker]</i><i style="right:6%;top:0;width:70px;height:70px;background:#B35FD6">[Speaker]</i><i style="right:4%;top:50%;width:90px;height:90px;background:#F3E31C;color:#111">[Speaker]</i><i style="left:44%;top:-4%;width:46px;height:46px;background:#3BD15A"></i><i style="left:5%;top:56%;width:56px;height:56px;background:#F08A24"></i></div>' +
      '<div class="panelg"><div class="mono" style="font-size:22px;font-weight:500;line-height:1.2">' + esc(c.name) + '</div><div class="row" style="align-items:flex-end"><div class="yr">' + esc(c.year) + '</div><div class="small" style="text-align:right;color:#D9D0F5;display:flex;flex-direction:column;gap:4px;padding-bottom:6px"><span>' + esc(c.dates) + '</span><span>' + esc(c.venue) + '</span></div></div><div class="ticks" aria-hidden="true">' + ticks + '</div><div class="row mono" style="font-size:11px;color:#C8BDEB"><span>' + esc(c.tagline) + '</span></div><div class="btns"><button class="reg" data-act="register">Register now</button><button class="later" data-act="closesplash">Later</button></div></div></div></div>';
    $('.reg', ov).focus();
  }

  /* story viewer: audio files play for real once speaker.src is set; until then playback is simulated */
  let M = null;
  function stopMedia() { if (M) { clearInterval(M.t); if (M.audio) M.audio.pause(); M = null; } }
  const mmss = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  function openStory(i) {
    stopMedia(); lastFocus = lastFocus || document.activeElement;
    const sp = D.speakers[i]; if (!sp) return closeOverlay();
    st.seen[sp.id] = true; S.set('lc.seen', st.seen);
    const prog = D.speakers.map((_, k) => '<div><b data-p="' + k + '" style="width:' + (k < i ? '100%' : '0') + '"></b></div>').join('');
    const nxt = D.speakers[i + 1];
    ov.innerHTML = '<div class="viewer" role="dialog" aria-modal="true" aria-label="Story: ' + esc(sp.name) + '"><div class="in"><div class="media"><div class="prog" aria-hidden="true">' + prog + '</div>' +
      '<div class="vbtns"><button class="round gb" data-act="closeviewer" aria-label="Close story">' + svg('back') + '</button><button class="round gb" data-act="save" aria-label="Save">' + svg('bookmark', 18, 2) + '</button></div>' +
      '<button style="position:absolute;left:0;top:90px;bottom:84px;width:28%;background:none;border:0;cursor:pointer" data-act="prevstory" aria-label="Previous story"></button><button style="position:absolute;right:0;top:90px;bottom:84px;width:28%;background:none;border:0;cursor:pointer" data-act="nextstory" aria-label="Next story"></button>' +
      '<div class="vc" aria-hidden="true">' + (sp.kind === 'audio' ? '<div class="big-ring"><i style="background:' + sp.color + '">' + esc(sp.initials) + '</i></div>' : '<span class="round" style="width:72px;height:72px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3)">' + play + '</span><span class="small" style="font-weight:600;color:#E2D3E4">[Welcome video · YouTube unlisted]</span>') + '</div>' +
      '<div class="bar gb"><button class="sp" data-act="speed" aria-label="Playback speed">1x</button><div class="tr"><div class="tk"><b id="tk"></b></div><div class="tm" id="tm">0:00 / ' + mmss(sp.seconds) + '</div></div><button class="pp" data-act="toggle" aria-label="Pause" id="pp">' + pause + '</button></div></div>' +
      '<div class="vbody"><h2>' + esc(sp.kind === 'audio' ? 'Daily ' + sp.title : sp.title) + '</h2><p>' + esc((sp.ref ? sp.ref + ' · ' : '') + sp.summary) + '</p><div class="by-row"><span class="ring"><i style="background:' + sp.color + ';display:flex;align-items:center;justify-content:center;border-radius:50%;color:#fff;font-style:normal;font-weight:700">' + esc(sp.initials) + '</i></span><div><div class="small" style="color:#BFAFC3">By</div><b>' + esc(sp.name) + '</b></div><span class="small" style="margin-left:auto;color:#BFAFC3">' + esc(sp.role) + '</span></div>' +
      (nxt ? '<button class="nextrow" data-act="nextstory"><span class="round" style="width:44px;height:44px;background:rgba(255,255,255,.12)">' + play + '</span><span style="flex:1"><b style="font-size:14px">Next story</b><br><span class="small" style="color:#BFAFC3">' + esc(nxt.name) + '</span></span>' + svg('chev', 14, 2) + '</button>' : '') + '</div></div></div>';
    document.body.style.overflow = 'hidden';
    M = { i, pos: 0, rate: 1, playing: true, dur: sp.seconds, audio: null };
    if (sp.src) { M.audio = new Audio(sp.src); M.audio.play().catch(() => {}); }
    M.t = setInterval(tick, 250); $('.viewer [data-act=closeviewer]').focus();
  }
  function tick() {
    if (!M || !M.playing) return;
    M.pos += 0.25 * M.rate; if (M.audio && !isNaN(M.audio.currentTime)) M.pos = M.audio.currentTime;
    const f = Math.min(1, M.pos / M.dur), a = $('[data-p="' + M.i + '"]'), tk = $('#tk');
    if (a) a.style.width = f * 100 + '%'; if (tk) tk.style.width = f * 100 + '%';
    const tm = $('#tm'); if (tm) tm.textContent = mmss(M.pos) + ' / ' + mmss(M.dur);
    if (M.pos >= M.dur) openStory(M.i + 1);
  }

  /* pin + booking sheets */
  function pinSheet(type) {
    if (!st.member) return openSheet('<h2>Sign in to pin</h2><p class="muted small" style="margin:0">Pinning is for signed-in members, so we can keep the board safe.</p><button class="btn block" data-act="goSignin">Sign in</button>');
    if (!type) return openSheet('<h2>Pin to the board</h2><div class="pinopts"><button class="opt" data-pintype="verse">Verse</button><button class="opt" data-pintype="picture">Picture</button><button class="opt" data-pintype="note">Note</button></div><p class="small muted" style="margin:0">New pins appear after a staff member approves them.</p>');
    const f = type === 'picture' ? '<div class="field"><label for="pf">Choose a picture</label><input id="pf" type="file" accept="image/*" style="height:auto;padding:12px"></div><div class="field"><label for="pt">Caption (optional)</label><input id="pt" maxlength="80"></div>'
      : type === 'verse' ? '<div class="field"><label for="pt">Verse text</label><textarea id="pt" maxlength="300"></textarea></div><div class="field"><label for="pr">Reference</label><input id="pr" placeholder="e.g. John 3:16 · KJV" maxlength="40"></div>'
      : '<div class="field"><label for="pt">Your note</label><textarea id="pt" maxlength="200"></textarea></div>';
    openSheet('<h2>Pin a ' + type + '</h2>' + f + '<div class="err" id="err" role="alert"></div><button class="btn block" data-act="submitpin" data-type="' + type + '">Send for approval</button>');
  }
  function resize(file) {
    return new Promise((res, rej) => { const fr = new FileReader(); fr.onerror = rej; fr.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => { const s = Math.min(1, 640 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * s; c.height = im.height * s; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.75)); }; im.src = fr.result; }; fr.readAsDataURL(file); });
  }
  function bookSheet() {
    const opts = D.rooms.map((r) => '<option value="' + esc(r.id) + '"' + (r.id === st.room ? ' selected' : '') + '>' + esc(r.name) + '</option>').join('');
    openSheet('<h2>New booking</h2><div class="field"><label for="br">Room</label><select id="br">' + opts + '</select></div><div class="field"><label for="bd">Date</label><input id="bd" type="date" min="' + iso(today) + '" value="' + iso(today) + '"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label for="bs">Start</label><input id="bs" type="time" value="09:00"></div><div class="field"><label for="be">End</label><input id="be" type="time" value="10:00"></div></div><div class="err" id="err" role="alert"></div><button class="btn block" data-act="submitbook">Request booking</button><p class="small muted" style="margin:0">Staff approve each request. You’ll see it as Pending until then.</p>');
  }

  /* ---------- events ---------- */
  document.addEventListener('click', async (e) => {
    const t = e.target.closest('[data-go],[data-act],[data-story],[data-room],[data-pintype]'); if (!t) return;
    if (t.dataset.go) { if (t.dataset.go === 'book' || t.dataset.go === 'home' || t.dataset.go === 'contact') { location.hash = '#/' + t.dataset.go; $('#view').focus(); } return; }
    if (t.dataset.story != null) { return openStory(+t.dataset.story); }
    if (t.dataset.room) { st.room = t.dataset.room; return render(); }
    if (t.dataset.pintype) return pinSheet(t.dataset.pintype);
    const a = t.dataset.act;
    if (a === 'closesheet') { if (e.target === t) closeOverlay(); return; }
    if (a === 'closesplash' || a === 'closeviewer') return closeOverlay();
    if (a === 'splash') return openSplash();
    if (a === 'register') { const u = D.conference.registerUrl; closeOverlay(); if (u) window.open(u, '_blank', 'noopener'); return; }
    if (a === 'nextstory') return openStory(M ? M.i + 1 : 0);
    if (a === 'prevstory') return openStory(M ? Math.max(0, M.i - 1) : 0);
    if (a === 'toggle' && M) { M.playing = !M.playing; if (M.audio) M.playing ? M.audio.play() : M.audio.pause(); $('#pp').innerHTML = M.playing ? pause : play; $('#pp').setAttribute('aria-label', M.playing ? 'Pause' : 'Play'); return; }
    if (a === 'speed' && M) { const r = [1, 1.25, 1.5, 2]; M.rate = r[(r.indexOf(M.rate) + 1) % r.length]; if (M.audio) M.audio.playbackRate = M.rate; t.textContent = M.rate + 'x'; return; }
    if (a === 'save') { const l = $('#savelbl'); if (l) l.textContent = 'Saved'; return; }
    if (a === 'share') { const v = verseOfDay(), txt = '“' + v.t + '” — ' + v.r; if (navigator.share) navigator.share({ text: txt }).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(() => {}); return; }
    if (a === 'pin') return pinSheet();
    if (a === 'goSignin') { closeOverlay(); location.hash = '#/book'; return; }
    if (a === 'newbook') return bookSheet();
    if (a === 'signout') { st.member = null; S.set('lc.member', null); st.signin = { step: 'email', email: '', msg: '' }; return render(); }
    if (a === 'changeemail') { st.signin.step = 'email'; st.signin.msg = ''; return render(); }
    if (a === 'sendcode') {
      const em = $('#em').value.trim();
      if (!/^\S+@\S+\.\S+$/.test(em)) return ($('#err').textContent = 'Please enter a valid email address.');
      t.disabled = true; try { await API.requestCode(em); st.signin = { step: 'code', email: em, msg: '' }; } catch (er) { st.signin.msg = 'We couldn’t send a code right now. Please try again.'; }
      return render().then(() => { const c = $('#cd'); if (c) c.focus(); });
    }
    if (a === 'verify') return verify();
    if (a === 'submitpin') {
      const type = t.dataset.type, txt = ($('#pt') ? $('#pt').value.trim() : ''), err = $('#err');
      const pin = { type, text: txt, by: st.member.email.split('@')[0], owner: st.member.email };
      if (type === 'verse') pin.ref = $('#pr').value.trim();
      if (type !== 'picture' && !txt) return (err.textContent = 'Please add some text.');
      t.disabled = true;
      try {
        if (type === 'picture') { const f = $('#pf').files[0]; if (!f) { t.disabled = false; return (err.textContent = 'Please choose a picture.'); } pin.img = await resize(f); }
        await API.addPin(pin); closeOverlay(); render();
      } catch (er) { t.disabled = false; err.textContent = 'Sorry, that didn’t work. Try a smaller picture.'; }
      return;
    }
    if (a === 'submitbook') {
      const b = { room: D.rooms.find((r) => r.id === $('#br').value).name, date: $('#bd').value, start: $('#bs').value, end: $('#be').value }, err = $('#err');
      if (!b.date || !b.start || !b.end || b.end <= b.start) return (err.textContent = 'Please check the date and that the end time is after the start.');
      t.disabled = true; try { await API.createBooking(st.member.email, b); closeOverlay(); render(); } catch (er) { t.disabled = false; err.textContent = 'We couldn’t save that. Please try again.'; }
    }
  });
  async function verify() {
    const raw = $('#cd').value.replace(/\D/g, ''); if (raw.length < 6) return;
    let ok = false; try { ok = (await API.verifyCode(st.signin.email, raw.slice(0, 6))).ok; } catch (e) { /* fall through */ }
    if (ok) { st.member = { email: st.signin.email }; S.set('lc.member', st.member); return render(); }
    st.signin.msg = 'That code didn’t work. Check it and try again.'; render();
  }
  document.addEventListener('input', (e) => { if (e.target.id === 'cd' && e.target.value.replace(/\D/g, '').length >= 6) verify(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && ov.innerHTML) closeOverlay(); if (e.key === 'Enter' && e.target.id === 'em') { const b = $('[data-act=sendcode]'); if (b) b.click(); } });
  window.addEventListener('hashchange', render);

  /* ---------- start ---------- */
  render();
  let shown = false; try { shown = sessionStorage.getItem('lc.splash'); sessionStorage.setItem('lc.splash', '1'); } catch (e) { /* ignore */ }
  if (!shown && !/nosplash/.test(location.search)) openSplash();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();

// Sample content. Replace with real data once the back end is connected.
// Everything in [square brackets] is a placeholder still to be confirmed by the church.
window.LC_DATA = {
  church: { name: 'Life Centre', email: 'hello@lifecentre.sg', address: '3 Yishun Street 11, Singapore 768645', whatsapp: '', phone: '' },
  conference: { name: 'Empower Conference', year: '2027', dates: '[Dates]', venue: '[Venue]', tagline: '[Theme or tagline]', registerUrl: '' },
  // Public-domain KJV. Rotates by day of year.
  verses: [
    { t: 'This is the day which the LORD hath made; we will rejoice and be glad in it.', r: 'Psalm 118:24' },
    { t: 'Be still, and know that I am God.', r: 'Psalm 46:10' },
    { t: 'The LORD is my shepherd; I shall not want.', r: 'Psalm 23:1' },
    { t: 'I can do all things through Christ which strengtheneth me.', r: 'Philippians 4:13' },
    { t: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.', r: 'Proverbs 3:5' },
    { t: 'The LORD bless thee, and keep thee.', r: 'Numbers 6:24' },
    { t: 'Casting all your care upon him; for he careth for you.', r: '1 Peter 5:7' }
  ],
  speakers: [
    { id: 'devotion', initials: 'P1', label: 'Today’s devotion', name: 'Ps. Grace', role: 'Morning devotion', color: '#1F4FA8', kind: 'audio', title: '[Devotion title]', ref: '[Scripture reference]', summary: '[One-line summary of this morning’s message.]', seconds: 270, seen: false },
    { id: 'sam', initials: 'P2', label: 'Ps. Sam', name: 'Ps. Sam', role: '[Role]', color: '#2E7D5B', kind: 'video', title: 'Welcome to Life Centre', ref: '', summary: '[Short caption: who they are and a line of welcome.]', seconds: 75, seen: false },
    { id: 'e1', initials: 'E1', label: 'Elder [Name]', name: 'Elder [Name]', role: 'Elder', color: '#B4472A', kind: 'video', title: 'Welcome', ref: '', summary: '[Short caption.]', seconds: 60, seen: false },
    { id: 'e2', initials: 'E2', label: 'Elder [Name]', name: 'Elder [Name]', role: 'Elder', color: '#6B4FA8', kind: 'video', title: 'Welcome', ref: '', summary: '[Short caption.]', seconds: 60, seen: true },
    { id: 'e3', initials: 'E3', label: 'Elder [Name]', name: 'Elder [Name]', role: 'Elder', color: '#3A5A78', kind: 'video', title: 'Welcome', ref: '', summary: '[Short caption.]', seconds: 60, seen: true }
  ],
  rooms: [
    { id: 'empower', name: 'Empower Room', capacity: '[Capacity]' },
    { id: 'r2', name: '[Room name]', capacity: '[Capacity]' },
    { id: 'r3', name: '[Room name]', capacity: '[Capacity]' },
    { id: 'r4', name: '[Room name]', capacity: '[Capacity]' }
  ],
  services: [{ dow: 0, name: 'Sunday Service', time: '[Service time]' }],
  seedPins: [
    { id: 's1', type: 'verse', text: 'Be still, and know that I am God.', ref: 'Psalm 46:10 · KJV', by: '[Member]', status: 'approved' },
    { id: 's2', type: 'note', text: '[Short note, e.g. a thank-you]', by: '[Member]', status: 'approved' }
  ]
};

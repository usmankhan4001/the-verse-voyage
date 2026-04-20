export interface SessionConfig {
  startAyah: number;
  endAyah: number;
  topic?: string;
}

export interface Surah {
  num: number;
  name: string;
  arabic: string;
  ayaat: number;
  themes: string;
  sessions: number;
  phase: number;
  defaultSessions?: SessionConfig[];
}

export const surahs: Surah[] = [
  // Phase 1 — Ruba 4 (Shortest surahs first for confidence building)
  { 
    num: 99,  name: 'Az-Zalzalah',    arabic: 'الزلزلة',     ayaat: 8,  themes: 'Earthquake of Earth · Deeds shown', sessions: 2, phase: 1,
    defaultSessions: [
      { startAyah: 1, endAyah: 5, topic: 'The Great Earthquake' },
      { startAyah: 6, endAyah: 8, topic: 'Individual Responsibility' }
    ]
  },
  { 
    num: 100, name: 'Al-Adiyaat',     arabic: 'العاديات',    ayaat: 11, themes: 'Racing horses · Human ingratitude', sessions: 2, phase: 1,
    defaultSessions: [
      { startAyah: 1, endAyah: 8, topic: 'The Panting Chargers' },
      { startAyah: 9, endAyah: 11, topic: 'The Secret of Hearts' }
    ]
  },
  { 
    num: 101, name: 'Al-Qariah',      arabic: 'القارعة',     ayaat: 11, themes: 'Day of Noise · Deeds weighed', sessions: 2, phase: 1,
    defaultSessions: [
      { startAyah: 1, endAyah: 5, topic: 'The Striking Calamity' },
      { startAyah: 6, endAyah: 11, topic: 'The Balance of Deeds' }
    ]
  },
  { 
    num: 102, name: 'At-Takathur',    arabic: 'التكاثر',     ayaat: 8,  themes: 'Race for wealth · Hereafter reality', sessions: 2, phase: 1,
    defaultSessions: [
      { startAyah: 1, endAyah: 5, topic: 'The Rivalry for Increase' },
      { startAyah: 6, endAyah: 8, topic: 'Certainty of the Fire' }
    ]
  },
  { 
    num: 103, name: 'Al-Asr',         arabic: 'العصر',       ayaat: 3,  themes: 'Time & loss · Path to success', sessions: 1, phase: 1,
    defaultSessions: [{ startAyah: 1, endAyah: 3, topic: 'The Declining Day' }]
  },
  { 
    num: 104, name: 'Al-Humazah',     arabic: 'الهمزة',      ayaat: 9,  themes: 'Slanderer warned · Fire of Allah', sessions: 2, phase: 1,
    defaultSessions: [
      { startAyah: 1, endAyah: 4, topic: 'The Scorner & Slanderer' },
      { startAyah: 5, endAyah: 9, topic: 'The Consuming Fire' }
    ]
  },
  { num: 105, name: 'Al-Feel',        arabic: 'الفيل',       ayaat: 5,  themes: "Army of Elephant · Allah's protection", sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 5, topic: 'The People of the Elephant' }] },
  { num: 106, name: 'Quraysh',        arabic: 'قريش',        ayaat: 4,  themes: 'Blessings on Quraysh · Worship Allah alone', sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 4, topic: 'The Tribe of Quraysh' }] },
  { num: 107, name: 'Al-Maun',        arabic: 'الماعون',     ayaat: 7,  themes: 'Deniers of faith · Neglect of prayer', sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 7, topic: 'Small Kindnesses' }] },
  { num: 108, name: 'Al-Kawthar',     arabic: 'الكوثر',      ayaat: 3,  themes: 'Gift of Al-Kawthar · Enemy cut off', sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 3, topic: 'Abundance' }] },
  { num: 109, name: 'Al-Kafiroon',    arabic: 'الكافرون',    ayaat: 6,  themes: 'Disavowal of shirk · Your deen yours', sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 6, topic: 'The Disbelievers' }] },
  { num: 110, name: 'An-Nasr',        arabic: 'النصر',       ayaat: 3,  themes: 'Victory of Islam · Seek forgiveness', sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 3, topic: 'Devine Support' }] },
  { num: 111, name: 'Al-Masad',       arabic: 'المسد',       ayaat: 5,  themes: 'Abu Lahab condemned · Wife carries thorns', sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 5, topic: 'Palm Fiber' }] },
  { num: 112, name: 'Al-Ikhlas',      arabic: 'الإخلاص',     ayaat: 4,  themes: 'Oneness of Allah · No equal', sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 4, topic: 'Purity of Faith' }] },
  { num: 113, name: 'Al-Falaq',       arabic: 'الفلق',       ayaat: 5,  themes: 'Refuge from evil · Dark & envy', sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 5, topic: 'The Daybreak' }] },
  { num: 114, name: 'An-Naas',        arabic: 'الناس',       ayaat: 6,  themes: 'Refuge from waswas · King of mankind', sessions: 1, phase: 1, defaultSessions: [{ startAyah: 1, endAyah: 6, topic: 'Mankind' }] },

  // Phase 2 — Ruba 3
  { num: 93,  name: 'Ad-Duha',        arabic: 'الضحى',       ayaat: 11, themes: "Reassurance to Prophet · Allah's favors", sessions: 2, phase: 2 },
  { num: 94,  name: 'Ash-Sharh',      arabic: 'الشرح',       ayaat: 8,  themes: 'Chest opened · After hardship ease', sessions: 2, phase: 2 },
  { num: 95,  name: 'At-Teen',        arabic: 'التين',       ayaat: 8,  themes: 'Best creation · Lowest of low', sessions: 2, phase: 2 },
  { num: 96,  name: 'Al-Alaq',        arabic: 'العلق',       ayaat: 19, themes: "First revelation · Read in Allah's name · Man transgresses", sessions: 3, phase: 2 },
  { num: 97,  name: 'Al-Qadr',        arabic: 'القدر',       ayaat: 5,  themes: 'Night of Power · Angels descend', sessions: 1, phase: 2 },
  { num: 98,  name: 'Al-Bayyinah',    arabic: 'البينة',      ayaat: 8,  themes: 'Clear evidence · Best of creation', sessions: 2, phase: 2 },

  // Phase 3 — Ruba 2
  { num: 87,  name: 'Al-Ala',         arabic: 'الأعلى',      ayaat: 19, themes: 'Glorify your Lord · Reminder benefits', sessions: 3, phase: 3 },
  { num: 88,  name: 'Al-Ghashiyah',   arabic: 'الغاشية',     ayaat: 26, themes: 'Faces humiliated · Faces radiant · Signs in creation', sessions: 3, phase: 3 },
  { num: 89,  name: 'Al-Fajr',        arabic: 'الفجر',       ayaat: 30, themes: 'Nations destroyed · Love of wealth · Soul at peace', sessions: 4, phase: 3 },
  { num: 90,  name: 'Al-Balad',       arabic: 'البلد',       ayaat: 20, themes: 'City & oath · Steep path of goodness', sessions: 3, phase: 3 },
  { num: 91,  name: 'Ash-Shams',      arabic: 'الشمس',       ayaat: 15, themes: 'Sun & oaths · Soul purified or corrupt', sessions: 2, phase: 3 },
  { num: 92,  name: 'Al-Layl',        arabic: 'الليل',       ayaat: 21, themes: 'Generous vs miser · Path made easy', sessions: 3, phase: 3 },

  // Phase 4 — Ruba 1
  { num: 78,  name: 'An-Naba',        arabic: 'النبأ',       ayaat: 40, themes: 'Great news questioned · Signs of Allah · Day of Judgment', sessions: 5, phase: 4 },
  { num: 79,  name: 'An-Naziat',      arabic: 'النازعات',    ayaat: 46, themes: 'Angels pulling souls · Moses & Pharaoh · Hour arrives', sessions: 5, phase: 4 },
  { num: 80,  name: 'Abasa',          arabic: 'عبس',         ayaat: 42, themes: 'Blind man rebuke · Ungrateful human', sessions: 4, phase: 4 },
  { num: 81,  name: 'At-Takwir',      arabic: 'التكوير',     ayaat: 29, themes: 'Sun folded up · Deeds witnessed', sessions: 3, phase: 4 },
  { num: 82,  name: 'Al-Infitar',     arabic: 'الانفطار',    ayaat: 19, themes: 'Sky split · Deeds recorded', sessions: 2, phase: 4 },
  { num: 83,  name: 'Al-Mutaffifeen', arabic: 'المطففين',    ayaat: 36, themes: 'Cheaters warned · Book of righteous · Day of recompense', sessions: 4, phase: 4 },
  { num: 84,  name: 'Al-Inshiqaq',    arabic: 'الانشقاق',    ayaat: 25, themes: 'Sky tears apart · Human toil & return', sessions: 3, phase: 4 },
  { num: 85,  name: 'Al-Burooj',      arabic: 'البروج',      ayaat: 22, themes: 'People of the trench · Allah the Forgiving', sessions: 3, phase: 4 },
  { num: 86,  name: 'At-Tariq',       arabic: 'الطارق',      ayaat: 17, themes: 'Piercing star · Quran decisive word', sessions: 2, phase: 4 },
];

export const phaseInfo = [
  { phase: 1, name: 'Ruba 4', label: 'Phase 1', color: 'var(--primary)', months: '1–2', description: 'Shortest surahs first for confidence building' },
  { phase: 2, name: 'Ruba 3', label: 'Phase 2', color: 'var(--purple)', months: '3–4', description: 'Emotional & early revelation surahs' },
  { phase: 3, name: 'Ruba 2', label: 'Phase 3', color: 'var(--gold)', months: '5–6', description: 'Building to longer surahs' },
  { phase: 4, name: 'Ruba 1', label: 'Phase 4', color: 'var(--coral)', months: '7–8', description: 'Longest surahs, deepest tafseer' },
];

export const sessionSteps = [
  { color: '#1D6B4A', title: 'Surah Intro Message', desc: 'Short text: Surah name, today\'s theme block, ayah numbers. Sets context.' },
  { color: '#4A3B8C', title: 'Arabic Ayaat Card', desc: 'Designed image card with Arabic text. Beautiful font, minimal design.' },
  { color: '#B84A2A', title: 'Audio Recitation', desc: 'Voice note or audio file. Students listen and repeat for hifz.' },
  { color: '#D4AF6A', title: 'Word-by-Word Translation', desc: 'Arabic word with Urdu meaning below. Helps with hifz AND understanding.' },
  { color: '#1A5490', title: 'Tafseer Insight', desc: 'Short Urdu tafseer (3–5 lines). End with a reflection question.' },
  { color: '#639922', title: 'Sabaq Confirmation', desc: 'Students reply with ✅ to confirm sabaq done. For attendance tracking.' },
];

export function getSurahsByPhase(phase: number): Surah[] {
  return surahs.filter(s => s.phase === phase);
}

export function getSurahByNum(num: number): Surah | undefined {
  return surahs.find(s => s.num === num);
}

export function getTotalSessions(): number {
  return surahs.reduce((sum, s) => sum + s.sessions, 0);
}

export function getTotalAyaat(): number {
  return surahs.reduce((sum, s) => sum + s.ayaat, 0);
}

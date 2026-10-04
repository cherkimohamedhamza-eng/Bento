// Bento — data layer: nutrients, storage, food database, calculations.

export const APP = 'Bento';
export const STORE_KEY = 'bento.v1';

// dv = US FDA Daily Value (adults, 2,000 kcal diet). kind 'limit' = stay under.
// d = decimals shown.
export const NUTRIENTS = [
  { k: 'kcal', name: 'Calories', unit: 'kcal', dv: 2000, grp: 'Energy and macros', d: 0 },
  { k: 'protein', name: 'Protein', unit: 'g', dv: 50, grp: 'Energy and macros', d: 1 },
  { k: 'carbs', name: 'Carbohydrates', unit: 'g', dv: 275, grp: 'Energy and macros', d: 1 },
  { k: 'fat', name: 'Fat', unit: 'g', dv: 78, grp: 'Energy and macros', d: 1 },
  { k: 'fiber', name: 'Fiber', unit: 'g', dv: 28, grp: 'Energy and macros', d: 1 },
  { k: 'sugar', name: 'Sugars', unit: 'g', dv: null, grp: 'Energy and macros', d: 1 },

  { k: 'satfat', name: 'Saturated fat', unit: 'g', dv: 20, kind: 'limit', grp: 'Fats', d: 1 },
  { k: 'monofat', name: 'Monounsaturated fat', unit: 'g', dv: null, grp: 'Fats', d: 1 },
  { k: 'polyfat', name: 'Polyunsaturated fat', unit: 'g', dv: null, grp: 'Fats', d: 1 },
  { k: 'chol', name: 'Cholesterol', unit: 'mg', dv: 300, kind: 'limit', grp: 'Fats', d: 0 },

  { k: 'sodium', name: 'Sodium', unit: 'mg', dv: 2300, kind: 'limit', grp: 'Minerals', d: 0 },
  { k: 'potassium', name: 'Potassium', unit: 'mg', dv: 4700, grp: 'Minerals', d: 0 },
  { k: 'calcium', name: 'Calcium', unit: 'mg', dv: 1300, grp: 'Minerals', d: 0 },
  { k: 'iron', name: 'Iron', unit: 'mg', dv: 18, grp: 'Minerals', d: 1 },
  { k: 'magnesium', name: 'Magnesium', unit: 'mg', dv: 420, grp: 'Minerals', d: 0 },
  { k: 'phosphorus', name: 'Phosphorus', unit: 'mg', dv: 1250, grp: 'Minerals', d: 0 },
  { k: 'zinc', name: 'Zinc', unit: 'mg', dv: 11, grp: 'Minerals', d: 1 },
  { k: 'copper', name: 'Copper', unit: 'mg', dv: 0.9, grp: 'Minerals', d: 2 },
  { k: 'manganese', name: 'Manganese', unit: 'mg', dv: 2.3, grp: 'Minerals', d: 2 },
  { k: 'selenium', name: 'Selenium', unit: 'µg', dv: 55, grp: 'Minerals', d: 0 },

  { k: 'vita', name: 'Vitamin A', unit: 'µg', dv: 900, grp: 'Vitamins', d: 0 },
  { k: 'vitc', name: 'Vitamin C', unit: 'mg', dv: 90, grp: 'Vitamins', d: 0 },
  { k: 'vitd', name: 'Vitamin D', unit: 'µg', dv: 20, grp: 'Vitamins', d: 1 },
  { k: 'vite', name: 'Vitamin E', unit: 'mg', dv: 15, grp: 'Vitamins', d: 1 },
  { k: 'vitk', name: 'Vitamin K', unit: 'µg', dv: 120, grp: 'Vitamins', d: 0 },
  { k: 'b1', name: 'Thiamin (B1)', unit: 'mg', dv: 1.2, grp: 'Vitamins', d: 2 },
  { k: 'b2', name: 'Riboflavin (B2)', unit: 'mg', dv: 1.3, grp: 'Vitamins', d: 2 },
  { k: 'b3', name: 'Niacin (B3)', unit: 'mg', dv: 16, grp: 'Vitamins', d: 1 },
  { k: 'b5', name: 'Pantothenic acid (B5)', unit: 'mg', dv: 5, grp: 'Vitamins', d: 1 },
  { k: 'b6', name: 'Vitamin B6', unit: 'mg', dv: 1.7, grp: 'Vitamins', d: 2 },
  { k: 'folate', name: 'Folate', unit: 'µg', dv: 400, grp: 'Vitamins', d: 0 },
  { k: 'b12', name: 'Vitamin B12', unit: 'µg', dv: 2.4, grp: 'Vitamins', d: 1 },
  { k: 'choline', name: 'Choline', unit: 'mg', dv: 550, grp: 'Vitamins', d: 0 },
];
export const NUT = Object.fromEntries(NUTRIENTS.map(n => [n.k, n]));
export const GROUPS = [...new Set(NUTRIENTS.map(n => n.grp))];
export const MACROS = ['protein', 'carbs', 'fat'];

// ---------- small helpers ----------
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const pad = n => String(n).padStart(2, '0');
export const dkey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return dkey(d); };
export const num = v => { const x = parseFloat(String(v).replace(',', '.')); return isFinite(x) ? x : 0; };
export function fmt(v, d = 0) {
  if (v == null || !isFinite(v)) return '–';
  const p = Math.pow(10, d);
  const r = Math.round(v * p) / p;
  return r.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: d });
}
export const fmtN = (k, v) => fmt(v, v >= 100 ? 0 : NUT[k].d);

// ---------- state ----------
const defaults = () => ({
  v: 1,
  settings: { theme: 'system', meals: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] },
  goals: { kcal: 2000, protein: 100, carbs: 250, fat: 67, targets: {} },
  profile: { sex: 'm', age: '', height: '', activity: 1.375, aim: 0 },
  foods: {},   // id -> food the user created, scanned or has logged
  diary: {},   // 'YYYY-MM-DD' -> [entry]
  body: [],    // [{d, w, bf, waist, note}]
  clip: null,  // copied entries
});

export let state = defaults();
let saveTimer = null;
let onSaveError = () => {};
export const setSaveErrorHandler = fn => { onSaveError = fn; };

export function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) state = merge(defaults(), JSON.parse(raw));
  } catch (e) { console.warn('Could not read saved data', e); }
  return state;
}
function merge(base, saved) {
  for (const k of Object.keys(base)) {
    if (saved[k] === undefined) continue;
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && ['settings', 'goals', 'profile'].includes(k))
      base[k] = { ...base[k], ...saved[k] };
    else base[k] = saved[k];
  }
  return base;
}
export function save(now = false) {
  clearTimeout(saveTimer);
  usageCache = null;
  const write = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { onSaveError(e); }
  };
  if (now) write(); else saveTimer = setTimeout(write, 250);
}
export function storageBytes() {
  try { return (localStorage.getItem(STORE_KEY) || '').length * 2; } catch { return 0; }
}
export function exportBackup() {
  return JSON.stringify({ app: 'bento-food-diary', exported: new Date().toISOString(), data: state }, null, 1);
}
export function importBackup(text) {
  const o = JSON.parse(text);
  const d = o && o.app === 'bento-food-diary' ? o.data : null;
  if (!d || typeof d.diary !== 'object' || typeof d.foods !== 'object') throw new Error('not a Bento backup');
  state = merge(defaults(), d);
  save(true);
}
export function resetAll() { state = defaults(); save(true); }

// ---------- targets ----------
export function target(k) {
  const g = state.goals;
  if (k in g && k !== 'targets') return g[k];
  if (g.targets[k] != null) return g.targets[k];
  return NUT[k].dv;
}
export function setTarget(k, v) {
  if (['kcal', 'protein', 'carbs', 'fat'].includes(k)) state.goals[k] = v;
  else if (v == null || v === '') delete state.goals.targets[k];
  else state.goals.targets[k] = v;
  save();
}
// Mifflin-St Jeor resting energy x activity, plus a weekly-change adjustment.
export function suggestGoals({ sex, age, height, weight, activity, aim }) {
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'f' ? -161 : 5);
  const floor = sex === 'f' ? 1200 : 1500;
  const kcal = Math.max(floor, Math.round((bmr * activity + aim) / 10) * 10);
  const protein = Math.round(weight * 1.6);
  const fat = Math.round(kcal * 0.27 / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { kcal, protein, carbs, fat, maintenance: Math.round(bmr * activity) };
}

// ---------- built-in food database ----------
export const db = { ready: false, keys: [], groups: [], foods: [], lower: [] };
let dbPromise = null;
export function loadDb() {
  dbPromise ??= fetch('data/foods.json').then(r => r.json()).then(j => {
    db.keys = j.keys; db.groups = j.groups; db.foods = j.foods; db.version = j.v;
    db.lower = j.foods.map(f => f[1].toLowerCase());
    db.ready = true;
    return db;
  });
  return dbPromise;
}
export function dbFood(row) {
  const n = {};
  db.keys.forEach((k, i) => { if (row[3][i] != null) n[k] = row[3][i]; });
  const p = [];
  for (let i = 0; i < row[4].length; i += 2) p.push([tidyPortion(row[4][i]), row[4][i + 1]]);
  return { id: 'u' + row[0], name: row[1], src: 'usda', grp: db.groups[row[2]], n, p };
}
const tidyPortion = s => s.replace(/\s+/g, ' ').replace(/ ,/g, ',').replace(/,\s*\(/, ' (').trim();

const SRC_LABEL = { usda: 'USDA', off: 'Open Food Facts', label: 'From a label', custom: 'My food', recipe: 'My recipe' };
export const srcLabel = f => SRC_LABEL[f.src] || '';

export function getFood(id) {
  if (state.foods[id]) return state.foods[id];
  if (id[0] === 'u' && db.ready) {
    const row = db.foods.find(r => r[0] === id.slice(1));
    if (row) return dbFood(row);
  }
  return null;
}
// Keep a copy of any food that gets logged, so the diary never depends on the big database.
export function keepFood(food) {
  if (!state.foods[food.id]) state.foods[food.id] = { ...food };
  return state.foods[food.id];
}

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export function search(query, { limit = 60 } = {}) {
  const q = norm(query).trim();
  if (!q) return [];
  const toks = q.split(/[\s,]+/).filter(Boolean).map(t => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t));
  const out = [];
  const usage = usageStats();
  const score = (lname, base) => {
    let s = base;
    for (const t of toks) {
      const i = lname.indexOf(t);
      if (i < 0) return null;
      if (i === 0) s += 40;
      else if (/[\s,(\-/]/.test(lname[i - 1])) s += 15;
    }
    if (lname.startsWith(toks[0])) s += 60;
    const first = lname.split(',')[0];
    if (first === toks.join(' ') || first === toks.join(' ') + 's' || first === toks.join(' ') + 'es') s += 50;
    if (/\braw\b/.test(lname) && !/raw/.test(q)) s += 12;
    if (/\bwhole\b/.test(lname)) s += 6;
    s -= lname.length / 5;
    return s;
  };
  const seen = new Set();
  for (const f of Object.values(state.foods)) {
    if (f.hid) continue;
    const s = score(norm(f.name + ' ' + (f.brand || '')), 120 + Math.min(60, (usage[f.id]?.c || 0) * 6));
    if (s != null) { out.push([s, f]); seen.add(f.id); }
  }
  if (db.ready) {
    for (let i = 0; i < db.foods.length; i++) {
      const row = db.foods[i];
      if (seen.has('u' + row[0])) continue;
      const brandish = /[A-Z]{3,}/.test(row[1]) ? -25 : 0;
      const g = db.groups[row[2]];
      const s = score(db.lower[i], brandish + (g === 'Fast food' || g === 'Restaurant foods' ? -15 : 0));
      if (s != null) out.push([s, row]);
    }
  }
  out.sort((a, b) => b[0] - a[0]);
  return out.slice(0, limit).map(([, f]) => (Array.isArray(f) ? dbFood(f) : f));
}

// ---------- diary ----------
export const dayEntries = k => state.diary[k] || [];
export function entryNutrients(e) {
  if (e.n) return e.n;
  const f = state.foods[e.f];
  if (!f) return {};
  const out = {};
  for (const k in f.n) out[k] = f.n[k] * e.g / 100;
  return out;
}
export const entryName = e => e.name || state.foods[e.f]?.name || 'Unknown food';
export function entryAmount(e) {
  if (e.n) return 'Quick add';
  if (!e.u || e.u === 'g') return `${fmt(e.g, e.g < 10 ? 1 : 0)} g`;
  return `${fmt(e.q, 2)} × ${e.u}`;
}
export function sum(entries) {
  const t = {};
  for (const e of entries) {
    const n = entryNutrients(e);
    for (const k in n) t[k] = (t[k] || 0) + n[k];
  }
  return t;
}
export const dayTotals = k => sum(dayEntries(k));
export function addEntry(day, e) {
  (state.diary[day] ??= []).push({ i: uid(), ...e });
  save();
}
export function updateEntry(day, id, patch) {
  const e = dayEntries(day).find(x => x.i === id);
  if (e) Object.assign(e, patch);
  save();
}
export function removeEntry(day, id) {
  const list = dayEntries(day);
  const i = list.findIndex(x => x.i === id);
  if (i < 0) return null;
  const [e] = list.splice(i, 1);
  if (!list.length) delete state.diary[day];
  save();
  return e;
}
export function copyEntries(entries, label) {
  state.clip = { label, items: entries.map(({ i, ...rest }) => rest) };
  save();
}
export function pasteEntries(day, meal) {
  if (!state.clip) return 0;
  for (const e of state.clip.items) addEntry(day, { ...e, m: meal ?? e.m });
  return state.clip.items.length;
}
export function averageTotals(endDay, days) {
  const t = {}; let n = 0;
  for (let i = 0; i < days; i++) {
    const es = dayEntries(addDays(endDay, -i));
    if (!es.length) continue;
    n++;
    const s = sum(es);
    for (const k in s) t[k] = (t[k] || 0) + s[k];
  }
  for (const k in t) t[k] /= n;
  return { totals: t, daysLogged: n };
}

// Which foods get eaten, how often, at which meal and in what amount — drives the History list.
let usageCache = null;
export function usageStats() {
  if (usageCache) return usageCache;
  const u = {};
  const today = dkey();
  for (const day of Object.keys(state.diary)) {
    const age = Math.round((parseKey(today) - parseKey(day)) / 864e5);
    if (age > 120) continue;
    for (const e of state.diary[day]) {
      if (!e.f) continue;
      const r = (u[e.f] ??= { c: 0, m: {}, last: '', e: null });
      r.c += 1;
      r.m[e.m] = (r.m[e.m] || 0) + 1;
      if (day >= r.last) { r.last = day; r.e = e; }
    }
  }
  usageCache = u;
  return u;
}
export const touch = () => { usageCache = null; };
export function history(meal, limit = 40) {
  const u = usageStats();
  const today = dkey();
  return Object.entries(u)
    .filter(([id]) => state.foods[id] && !state.foods[id].hid)
    .map(([id, r]) => {
      const age = Math.max(0, Math.round((parseKey(today) - parseKey(r.last)) / 864e5));
      return { food: state.foods[id], last: r.e, score: r.c + (r.m[meal] || 0) * 3 + Math.max(0, 14 - age) };
    })
    .sort((a, b) => b.score - a.score).slice(0, limit);
}

// ---------- foods the user owns ----------
export function saveFood(food) {
  food.id ??= (food.src === 'recipe' ? 'r' : 'c') + uid();
  state.foods[food.id] = food;
  touch(); save();
  return food;
}
export function deleteFood(id) {
  const used = Object.values(state.diary).some(list => list.some(e => e.f === id));
  if (used) state.foods[id].hid = true; else delete state.foods[id];
  touch(); save();
}
export const findByBarcode = code => Object.values(state.foods).find(f => f.bc === code && !f.hid) || null;
export const myFoods = src => Object.values(state.foods)
  .filter(f => !f.hid && (src === 'recipe' ? f.src === 'recipe' : ['custom', 'label', 'off'].includes(f.src)))
  .sort((a, b) => a.name.localeCompare(b.name));

// Recipe -> nutrients per 100 g of the finished dish.
export function recipeNutrients(ings, cookedWeight) {
  const t = {}; let raw = 0;
  for (const { f, g } of ings) {
    const food = getFood(f);
    if (!food) continue;
    raw += g;
    for (const k in food.n) t[k] = (t[k] || 0) + food.n[k] * g / 100;
  }
  const total = cookedWeight > 0 ? cookedWeight : raw;
  const n = {};
  if (total > 0) for (const k in t) n[k] = Math.round(t[k] / total * 100 * 1000) / 1000;
  return { n, total, raw };
}

// ---------- body ----------
export function saveBody(rec) {
  const i = state.body.findIndex(b => b.d === rec.d);
  if (i >= 0) state.body[i] = rec; else state.body.push(rec);
  state.body.sort((a, b) => (a.d < b.d ? -1 : 1));
  save();
}
export function removeBody(d) { state.body = state.body.filter(b => b.d !== d); save(); }
// Exponentially smoothed trend: daily scale noise mostly cancels out.
export function trend(points) {
  let t = null, prev = null;
  return points.map(p => {
    if (t == null) t = p.v;
    else {
      const gap = Math.max(1, Math.round((parseKey(p.d) - parseKey(prev)) / 864e5));
      const a = 1 - Math.pow(0.9, gap);
      t = t + a * (p.v - t);
    }
    prev = p.d;
    return { d: p.d, v: p.v, t };
  });
}

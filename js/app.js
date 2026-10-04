// Bento — interface.
import * as C from './core.js';
import * as S from './scan.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const { fmt, num, NUT, NUTRIENTS, GROUPS } = C;

const P = {
  back: '<path d="m15 5-7 7 7 7"/>', next: '<path d="m9 5 7 7-7 7"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  dots: '<circle cx="5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  barcode: '<path d="M4 7V5h3M17 5h3v2M4 17v2h3M17 19h3v-2M8 8.5v7M11 8.5v7M13.5 8.5v7M16.5 8.5v7"/>',
  label: '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
  bolt: '<path d="M13 3 5 13.5h6L10.5 21 19 10h-6z"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
  star: '<path d="m12 4 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>',
  trash: '<path d="M5 7h14M10 7V4.5h4V7M7 7l1 12.5h8L17 7M10.5 11v5M13.5 11v5"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
  paste: '<rect x="5.5" y="5" width="13" height="15.5" rx="2.5"/><path d="M9 5V3.5h6V5M9 11h6M9 15h4"/>',
  torch: '<path d="M8 3.5h8V8l-2 3v9.5h-4V11L8 8zM8 6.5h8"/>',
  today: '<path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0zM8 20.5h8M9 7.5c0-1.5 1.5-1.5 1.5-3M13.5 7.5c0-1.5 1.5-1.5 1.5-3"/>',
  nutrients: '<path d="M5 6.5h9M5 12h14M5 17.5h6"/><circle cx="18" cy="6.5" r="1.4"/><circle cx="15" cy="17.5" r="1.4"/>',
  body: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><path d="M8.5 9.5a5 5 0 0 1 7 0M12 9v2.5"/>',
  more: '<path d="M5 7h7M16 7h3M5 12h3M12 12h7M5 17h9M18 17h1"/><circle cx="14" cy="7" r="1.8"/><circle cx="10" cy="12" r="1.8"/><circle cx="16" cy="17" r="1.8"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>',
  book: '<path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H19v14H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 8.5h6"/>',
  box: '<path d="m12 3.5 7.5 4v9L12 20.5l-7.5-4v-9zM4.5 7.5l7.5 4 7.5-4M12 11.5v9"/>',
  save: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 19.5h14"/>',
  restore: '<path d="M12 15V4m0 0L8 8m4-4 4 4M5 19.5h14"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
  install: '<rect x="6.5" y="3" width="11" height="18" rx="2.5"/><path d="M12 8v6m0 0-2.5-2.5M12 14l2.5-2.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.5-2.5h5L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.3"/>',
};
const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

const ui = { tab: 'today', day: C.dkey(), nutRange: 'day', bodyMetric: 'w', bodyRange: 90 };
const tmpFoods = {};
const anyFood = id => tmpFoods[id] || C.getFood(id);
const meals = () => C.state.settings.meals;
const longDate = k => C.parseKey(k).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const shortDate = k => C.parseKey(k).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
function dayTitle(k) {
  const t = C.dkey();
  return k === t ? 'Today' : k === C.addDays(t, -1) ? 'Yesterday' : k === C.addDays(t, 1) ? 'Tomorrow'
    : C.parseKey(k).toLocaleDateString('en-GB', { weekday: 'long' });
}
function mealForNow() {
  const h = new Date().getHours();
  return h < 10.5 ? 0 : h < 15 ? 1 : h < 21 ? 2 : 3;
}

// ---------- overlays (closed by the phone's back button) ----------
const stack = [];
let waiters = [];
function openOv(kind, html, opts = {}) {
  const el = document.createElement('div');
  el.className = `ov ${kind}`;
  el.innerHTML = kind === 'sheet' ? `<div class="in" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>` : `<div class="in">${html}</div>`;
  if (kind === 'sheet') el.addEventListener('click', e => { if (e.target === el) closeOv(); });
  $('#overlays').append(el);
  stack.push({ el, onClose: opts.onClose, onShow: opts.onShow });
  history.pushState({ depth: stack.length }, '');
  return el;
}
function closeOv(n = 1) {
  n = Math.min(n, stack.length);
  if (!n) return Promise.resolve();
  return new Promise(res => { waiters.push(res); history.go(-n); });
}
addEventListener('popstate', e => {
  const depth = e.state?.depth ?? 0;
  while (stack.length > depth) { const o = stack.pop(); o.el.remove(); o.onClose?.(); }
  waiters.splice(0).forEach(r => r());
  if (!stack.length) render(); else stack[stack.length - 1].onShow?.();
});
const topOv = () => stack[stack.length - 1]?.el;

let toastTimer;
function toast(msg, action) {
  const t = $('#toast');
  t.innerHTML = `<span>${esc(msg)}</span>${action ? `<button>${esc(action.label)}</button>` : ''}`;
  if (action) t.querySelector('button').onclick = () => { t.classList.remove('on'); action.fn(); };
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), action ? 5000 : 2400);
}

// ---------- action plumbing ----------
const acts = {};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (el && acts[el.dataset.act]) acts[el.dataset.act](el, e);
});

// ---------- tabs ----------
function renderTabs() {
  const b = (id, label) => `<button data-act="tab" data-tab="${id}" ${ui.tab === id ? 'aria-current="page"' : ''}>${icon(id)}<span>${label}</span></button>`;
  $('#tabs').innerHTML = b('today', 'Today') + b('nutrients', 'Nutrients')
    + `<button class="plus" data-act="add" aria-label="Add food">${icon('plus')}</button>` + b('body', 'Body') + b('more', 'More');
}
acts.tab = el => { ui.tab = el.dataset.tab; scrollTo(0, 0); render(); };
function render() {
  renderTabs();
  ({ today: viewToday, nutrients: viewNutrients, body: viewBody, more: viewMore })[ui.tab]();
}

// ---------- today ----------
function dayNav() {
  return `<button class="ib" data-act="day" data-d="-1" aria-label="Previous day">${icon('back')}</button>
    <button class="ib" data-act="day" data-d="1" aria-label="Next day">${icon('next')}</button>`;
}
function viewToday() {
  const day = ui.day, entries = C.dayEntries(day), tot = C.sum(entries);
  const tk = C.target('kcal'), kc = tot.kcal || 0;
  const cell = (cls, k, label) => {
    const v = tot[k] || 0, t = C.target(k), pct = t ? Math.min(100, v / t * 100) : 0;
    const over = t && Math.round(v) > Math.round(t);
    return `<button class="cell ${cls}${over ? ' over' : ''}" data-act="nutrient" data-k="${k}" style="--fill:${pct.toFixed(0)}%">
      <span class="lab">${label}</span><b class="num">${fmt(v)}<span style="font-size:.6em;font-weight:500"> g</span></b>
      <span class="sub">${over ? `${fmt(v - t)} g over` : `of ${fmt(t)} g`}</span></button>`;
  };
  const left = tk - kc;
  const monday = (() => { const d = C.parseKey(day); return C.addDays(day, -((d.getDay() + 6) % 7)); })();
  const week = Array.from({ length: 7 }, (_, i) => {
    const k = C.addDays(monday, i), v = C.dayTotals(k).kcal || 0, d = C.parseKey(k);
    return `<button data-act="goDay" data-day="${k}" aria-pressed="${k === day}" class="${k === C.dkey() ? 'today' : ''}${v > tk * 1.05 ? ' over' : ''}"
      aria-label="${longDate(k)}, ${fmt(v)} kcal"><span>${'MTWTFSS'[i]}</span><b>${d.getDate()}</b><i style="--h:${Math.min(100, v / tk * 100).toFixed(0)}%"></i></button>`;
  }).join('');

  const mealHtml = meals().map((name, m) => {
    const list = entries.filter(e => e.m === m);
    const rows = list.map(e => {
      const n = C.entryNutrients(e);
      return `<li><button class="row" data-act="entry" data-id="${e.i}"><span class="t"><strong>${esc(C.entryName(e))}</strong><small>${esc(C.entryAmount(e))}</small></span>
        <span class="v num">${fmt(n.kcal || 0)}<small>kcal</small></span></button></li>`;
    }).join('');
    return `<section class="meal"><header><h2>${esc(name)}</h2>${list.length ? `<span class="kc num">${fmt(C.sum(list).kcal || 0)} kcal</span>` : ''}
      <button class="ib" data-act="mealMenu" data-meal="${m}" aria-label="${esc(name)} options">${icon('dots')}</button>
      <button class="ib" data-act="add" data-meal="${m}" aria-label="Add food to ${esc(name)}">${icon('plus')}</button></header>
      ${list.length ? `<ul class="rows">${rows}</ul>` : `<button class="addrow" data-act="add" data-meal="${m}">${icon('plus')}Add food</button>`}</section>`;
  }).join('');

  $('#view').innerHTML = `
    <header class="top"><button class="datebtn grow" data-act="pickDate" aria-label="Choose a date"><h1>${dayTitle(day)}</h1><span class="when">${longDate(day)}</span></button>
      ${dayNav()}<button class="ib" data-act="dayMenu" aria-label="Day options">${icon('dots')}</button></header>
    <div class="week">${week}</div>
    <section class="bento" aria-label="Day summary">
      <button class="cell cal${left < 0 ? ' over' : ''}" data-act="nutrient" data-k="kcal" style="--fill:${Math.min(100, kc / tk * 100).toFixed(0)}%">
        <span class="lab">Calories</span><b class="num">${fmt(kc)}</b>
        <span class="sub">${left >= 0 ? `${fmt(left)} left of ${fmt(tk)}` : `${fmt(-left)} over ${fmt(tk)}`}</span></button>
      ${cell('p', 'protein', 'Protein')}${cell('c', 'carbs', 'Carbs')}${cell('f', 'fat', 'Fat')}${cell('fi', 'fiber', 'Fiber')}
    </section>
    ${mealHtml}`;
}
acts.day = el => { ui.day = C.addDays(ui.day, +el.dataset.d); render(); };
acts.goDay = el => { ui.day = el.dataset.day; render(); };
acts.pickDate = () => {
  const inp = $('#datePick');
  inp.value = ui.day;
  inp.onchange = () => { if (inp.value) { ui.day = inp.value; render(); } };
  try { inp.showPicker(); } catch { inp.focus(); inp.click(); }
};

function menuSheet(title, items) {
  const el = openOv('sheet', `<div class="sh"><div class="grow"><h2>${esc(title)}</h2></div></div>
    <div class="ovb"><div class="menu">${items.filter(Boolean).map((it, i) =>
      `<button data-i="${i}">${icon(it.icon)}<span class="t">${esc(it.label)}${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span></button>`).join('')}</div></div>`);
  const list = items.filter(Boolean);
  el.querySelector('.menu').onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    await closeOv(); list[+b.dataset.i].fn();
  };
}
const clipSub = () => C.state.clip ? `${C.state.clip.items.length} item${C.state.clip.items.length === 1 ? '' : 's'} from ${C.state.clip.label}` : '';
acts.mealMenu = el => {
  const m = +el.dataset.meal, name = meals()[m], day = ui.day;
  const list = C.dayEntries(day).filter(e => e.m === m);
  const yest = C.dayEntries(C.addDays(day, -1)).filter(e => e.m === m);
  menuSheet(name, [
    list.length && { icon: 'copy', label: `Copy ${name.toLowerCase()}`, sub: 'Paste it into any meal or day', fn: () => { C.copyEntries(list, `${name}, ${shortDate(day)}`); toast('Copied'); } },
    C.state.clip && { icon: 'paste', label: 'Paste here', sub: clipSub(), fn: () => { const n = C.pasteEntries(day, m); render(); toast(`Pasted ${n} item${n === 1 ? '' : 's'}`); } },
    yest.length && { icon: 'restore', label: `Repeat ${name.toLowerCase()} from the day before`, sub: `${yest.length} item${yest.length === 1 ? '' : 's'}`, fn: () => { yest.forEach(({ i, ...e }) => C.addEntry(day, e)); render(); toast('Added'); } },
    list.length && { icon: 'book', label: 'Save as a recipe', sub: 'Reuse this meal in one tap', fn: () => openRecipeEditor({ name: '', servings: 1, ing: list.filter(e => e.f).map(e => ({ f: e.f, g: e.g })) }) },
    list.length && { icon: 'trash', label: `Clear ${name.toLowerCase()}`, fn: () => {
      const removed = list.map(e => C.removeEntry(day, e.i)); render();
      toast('Cleared', { label: 'Undo', fn: () => { removed.forEach(({ i, ...e }) => C.addEntry(day, e)); render(); } });
    } },
    !list.length && !C.state.clip && !yest.length && { icon: 'plus', label: 'Add food', fn: () => openAdd({ meal: m }) },
  ]);
};
acts.dayMenu = () => {
  const day = ui.day, list = C.dayEntries(day), yest = C.dayEntries(C.addDays(day, -1));
  menuSheet(dayTitle(day), [
    list.length && { icon: 'copy', label: 'Copy the whole day', fn: () => { C.copyEntries(list, shortDate(day)); toast('Copied'); } },
    C.state.clip && { icon: 'paste', label: 'Paste', sub: clipSub() + ', into the same meals', fn: () => { const n = C.pasteEntries(day); render(); toast(`Pasted ${n} item${n === 1 ? '' : 's'}`); } },
    yest.length && { icon: 'restore', label: 'Repeat everything from the day before', sub: `${yest.length} items`, fn: () => { yest.forEach(({ i, ...e }) => C.addEntry(day, e)); render(); toast('Added'); } },
    { icon: 'today', label: 'Go to today', fn: () => { ui.day = C.dkey(); render(); } },
  ]);
};

// ---------- add food ----------
let add = null;
function openAdd({ meal, mode = 'log', onPick } = {}) {
  const prev = add;
  add = { meal: meal ?? prev?.meal ?? mealForNow(), mode, onPick, tab: 'history', q: '', day: ui.day, online: null };
  const el = openOv('page', `
    <div class="ovh"><button class="ib" data-act="close" aria-label="Back">${icon('back')}</button>
      <label class="searchbar">${icon('search')}<input type="search" id="q" placeholder="Search foods" autocomplete="off" enterkeyhint="search" aria-label="Search foods"></label></div>
    <div class="ovb" id="addBody"></div>`, { onClose: () => { add = prev; }, onShow: () => renderAdd() });
  const q = $('#q', el);
  let t;
  q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { add.q = q.value; add.online = null; renderAdd(); }, 110); });
  C.loadDb().then(() => add && add.q && renderAdd());
  renderAdd();
}
acts.add = el => openAdd({ meal: el.dataset.meal != null ? +el.dataset.meal : undefined });
acts.close = () => closeOv();

function foodRow(f, { sub, val, valSub, quick } = {}) {
  return `<li><div class="row"><button class="t" data-act="food" data-id="${esc(f.id)}"><strong>${esc(f.name)}</strong><small>${esc(sub ?? (f.brand || C.srcLabel(f)))}</small></button>
    <button class="v num" data-act="food" data-id="${esc(f.id)}" tabindex="-1">${val ?? fmt(f.n.kcal || 0)}<small>${valSub ?? 'kcal per 100 g'}</small></button>
    ${quick ? `<button class="go" data-act="quickLog" data-id="${esc(f.id)}" aria-label="Add ${esc(f.name)} again">${icon('plus')}</button>` : ''}</div></li>`;
}
function renderAdd() {
  const body = $$('#addBody').pop();
  if (!body || !add) return;
  const log = add.mode === 'log';
  if (add.q.trim()) {
    const res = C.search(add.q);
    let online = '';
    if (add.online === 'loading') online = `<p class="hint">Searching packaged products online…</p>`;
    else if (Array.isArray(add.online)) online = add.online.length
      ? `<div class="listhead"><span>Packaged products (Open Food Facts)</span></div><ul class="rows">${add.online.map(f => foodRow(f)).join('')}</ul>`
      : `<p class="hint">No packaged products matched online.</p>`;
    else if (add.online === 'error') online = `<p class="hint">Online search needs a connection. Try again later.</p>`;
    else online = `<button class="btn ghost wide" style="margin-top:14px" data-act="searchOnline">${icon('search')}Search packaged products online</button>`;
    body.innerHTML = (res.length ? `<ul class="rows">${res.map(f => foodRow(f, { sub: f.brand || (f.src === 'usda' ? f.grp : C.srcLabel(f)) })).join('')}</ul>`
      : `<p class="hint">${C.db.ready ? `Nothing in the built-in list matches “${esc(add.q)}”.` : 'Loading the food list…'}</p>`)
      + online + (log ? `<button class="btn ghost wide" style="margin-top:10px" data-act="newFood">${icon('pencil')}Create “${esc(add.q.trim())}” yourself</button>` : '');
    return;
  }
  const seg = [['history', 'History'], ['mine', 'My foods'], ['recipes', 'Recipes']].map(([id, l]) =>
    `<button data-act="addTab" data-t="${id}" aria-pressed="${add.tab === id}">${l}</button>`).join('');
  let list = '';
  if (add.tab === 'history') {
    const h = C.history(add.meal);
    list = h.length ? `<ul class="rows">${h.map(({ food, last }) => foodRow(food, {
      sub: C.entryAmount(last), val: fmt(C.entryNutrients(last).kcal || 0), valSub: 'kcal', quick: log })).join('')}</ul>`
      : `<p class="hint">Foods you log show up here, with the ones you usually eat at this meal first. Tap the plus to log the same amount again.</p>`;
  } else {
    const mine = C.myFoods(add.tab === 'recipes' ? 'recipe' : 'food');
    list = (mine.length ? `<ul class="rows">${mine.map(f => foodRow(f, { sub: f.brand || C.srcLabel(f) })).join('')}</ul>`
      : `<p class="hint">${add.tab === 'recipes' ? 'A recipe adds up its ingredients so a dish you cook often is one tap.' : 'Foods you create, scan or read from a label are kept here.'}</p>`)
      + (log ? `<button class="btn ghost wide" style="margin-top:10px" data-act="${add.tab === 'recipes' ? 'newRecipe' : 'newFood'}">${icon('plus')}${add.tab === 'recipes' ? 'New recipe' : 'New food'}</button>` : '');
  }
  body.innerHTML = `
    ${log ? `<div class="chips" role="group" aria-label="Meal" style="margin:2px 0 12px">${meals().map((n, i) =>
      `<button data-act="addMeal" data-m="${i}" aria-pressed="${i === add.meal}">${esc(n)}</button>`).join('')}</div>` : ''}
    <div class="tools">
      <button class="hot" data-act="scanBarcode">${icon('barcode')}Scan barcode</button>
      <button class="hot" data-act="scanLabel">${icon('label')}Scan label</button>
      ${log ? `<button data-act="quickAdd">${icon('bolt')}Quick add</button>` : `<button data-act="newFood">${icon('pencil')}New food</button>`}
      ${log ? `<button data-act="newFood">${icon('pencil')}New food</button>` : `<span></span>`}
    </div>
    <div class="seg">${seg}</div><div style="margin-top:10px">${list}</div>`;
}
acts.addTab = el => { add.tab = el.dataset.t; renderAdd(); };
acts.addMeal = el => { add.meal = +el.dataset.m; renderAdd(); };
acts.searchOnline = async () => {
  const q = add.q; add.online = 'loading'; renderAdd();
  try {
    const list = await S.searchProducts(q);
    list.forEach(f => { tmpFoods[f.id] = f; });
    if (add && add.q === q) add.online = list;
  } catch { if (add) add.online = 'error'; }
  if (add) renderAdd();
};
acts.food = el => { const f = anyFood(el.dataset.id); if (f) openFoodSheet(f); };
acts.quickLog = el => {
  const f = C.state.foods[el.dataset.id], last = f && C.usageStats()[f.id]?.e;
  if (!f || !last) return;
  C.addEntry(add.day, { m: add.meal, f: f.id, g: last.g, q: last.q, u: last.u });
  toast(`Added to ${meals()[add.meal]}`);
  el.innerHTML = icon('check');
};

// ---------- food sheet: choose an amount, see what it adds ----------
let fs = null;
function openFoodSheet(food, { entry, day } = {}) {
  const mode = entry ? 'edit' : add?.mode === 'pick' ? 'pick' : 'log';
  const last = !entry && C.usageStats()[food.id]?.e;
  const from = entry || last;
  let q = 100, u = -1;
  if (from) { u = from.u && from.u !== 'g' ? (food.p || []).findIndex(p => p[0] === from.u) : -1; q = u >= 0 ? from.q : from.g; }
  else if (mode !== 'pick' && food.p?.length) { u = 0; q = 1; }
  fs = { food, q, u, mode, entry, day: day || add?.day || ui.day, meal: entry ? entry.m : add?.meal ?? mealForNow() };
  const own = ['custom', 'label', 'recipe', 'off'].includes(food.src);
  const units = `<option value="-1">grams</option>` + (food.p || []).map((p, i) => `<option value="${i}">${esc(p[0])} (${fmt(p[1], 1)} g)</option>`).join('');
  openOv('sheet', `
    <div class="sh"><div class="grow"><h2>${esc(food.name)}</h2><small>${esc([food.brand, C.srcLabel(food)].filter(Boolean).join(', '))}</small></div>
      ${own && mode !== 'edit' ? `<button class="ib" data-act="editFood" aria-label="Edit this food">${icon('pencil')}</button>` : ''}
      <button class="ib" data-act="close" aria-label="Close">${icon('close')}</button></div>
    <div class="ovb">
      <div class="amount"><input class="inp" id="fsQ" type="number" inputmode="decimal" step="any" min="0" value="${q}" aria-label="Amount">
        <select class="inp" id="fsU" aria-label="Unit">${units}</select></div>
      ${mode === 'pick' ? '' : `<div class="chips" role="group" aria-label="Meal" style="margin-top:12px">${meals().map((n, i) =>
        `<button data-act="fsMeal" data-m="${i}" aria-pressed="${i === fs.meal}">${esc(n)}</button>`).join('')}</div>`}
      <div id="fsPreview"></div>
    </div>
    <div class="ovf">${mode === 'edit' ? `<button class="btn danger" style="flex:0 0 auto" data-act="fsDelete" aria-label="Remove from diary">${icon('trash')}</button>
      <button class="btn" style="flex:0 0 auto" data-act="fsCopy" aria-label="Copy">${icon('copy')}</button>` : ''}
      <button class="btn primary" data-act="fsSave" id="fsSave"></button></div>`, { onClose: () => { fs = null; } });
  const el = topOv();
  $('#fsU', el).value = String(u);
  $('#fsQ', el).oninput = e => { fs.q = num(e.target.value); fsPreview(); };
  $('#fsU', el).onchange = e => {
    const nu = +e.target.value, g = fsGrams();
    fs.u = nu; fs.q = nu < 0 ? Math.round(g) : 1;
    $('#fsQ', el).value = fs.q; fsPreview();
  };
  fsPreview();
}
const fsGrams = () => (fs.u < 0 ? fs.q : fs.q * fs.food.p[fs.u][1]);
function nutrientTable(n) {
  return `<table class="ntable">${GROUPS.map(g => `<tr><th colspan="2">${g}</th></tr>` + NUTRIENTS.filter(x => x.grp === g).map(x =>
    `<tr><td>${x.name}</td><td>${n[x.k] == null ? '–' : `${C.fmtN(x.k, n[x.k])} ${x.unit}`}</td></tr>`).join('')).join('')}</table>`;
}
function fsPreview() {
  const el = topOv(); if (!fs || !el) return;
  const g = fsGrams(), n = {};
  for (const k in fs.food.n) n[k] = fs.food.n[k] * g / 100;
  const open = $('#fsPreview details', el)?.open;
  $('#fsPreview', el).innerHTML = `
    <div class="mini"><div><span>Calories</span><b class="num">${fmt(n.kcal || 0)}</b></div>
      <div style="--tone:var(--p)"><span>Protein</span><b class="num">${fmt(n.protein || 0, 1)}</b></div>
      <div style="--tone:var(--c)"><span>Carbs</span><b class="num">${fmt(n.carbs || 0, 1)}</b></div>
      <div style="--tone:var(--f)"><span>Fat</span><b class="num">${fmt(n.fat || 0, 1)}</b></div></div>
    <details class="more" ${open ? 'open' : ''}><summary>All nutrients in ${fmt(g, g < 10 ? 1 : 0)} g</summary>${nutrientTable(n)}</details>`;
  const b = $('#fsSave', el);
  b.textContent = fs.mode === 'edit' ? 'Save changes' : fs.mode === 'pick' ? 'Add to recipe' : `Add to ${meals()[fs.meal]}`;
  b.disabled = !(g > 0);
}
acts.fsMeal = el => { fs.meal = +el.dataset.m; $$('[data-act=fsMeal]', topOv()).forEach(b => b.setAttribute('aria-pressed', b === el)); fsPreview(); };
acts.fsSave = async () => {
  const g = fsGrams(); if (!(g > 0)) return;
  const { food, mode } = fs;
  const rec = { m: fs.meal, f: food.id, g: Math.round(g * 10) / 10, q: fs.q, u: fs.u < 0 ? 'g' : food.p[fs.u][0] };
  C.keepFood(food);
  if (mode === 'edit') { C.updateEntry(fs.day, fs.entry.i, rec); await closeOv(); toast('Saved'); return; }
  if (mode === 'pick') { const cb = add.onPick; await closeOv(2); cb({ f: food.id, g: rec.g }); return; }
  C.addEntry(fs.day, rec);
  const meal = meals()[fs.meal];
  await closeOv();
  if (add) { add.q = ''; const q = $$('#q').pop(); if (q) q.value = ''; add.tab = 'history'; renderAdd(); }
  toast(`Added to ${meal}`);
};
acts.fsDelete = async () => {
  const { day, entry } = fs;
  const removed = C.removeEntry(day, entry.i);
  await closeOv();
  toast('Removed', { label: 'Undo', fn: () => { const { i, ...e } = removed; C.addEntry(day, e); render(); } });
};
acts.fsCopy = async () => { C.copyEntries([fs.entry], C.entryName(fs.entry)); await closeOv(); toast('Copied. Paste it from a meal’s menu'); };
acts.editFood = async () => {
  const f = fs.food; await closeOv();
  if (f.src === 'recipe') openRecipeEditor(f); else openFoodEditor(f);
};
acts.entry = el => {
  const e = C.dayEntries(ui.day).find(x => x.i === el.dataset.id); if (!e) return;
  if (e.n) return openQuickAdd(e);
  const f = C.state.foods[e.f]; if (f) openFoodSheet(f, { entry: e, day: ui.day });
};

// ---------- quick add ----------
function openQuickAdd(entry) {
  const n = entry?.n || {};
  const meal = entry ? entry.m : add?.meal ?? mealForNow(), day = entry ? ui.day : add?.day || ui.day;
  const f = (id, label, unit, v) => `<label class="field"><span>${label}</span><span class="unitin"><input class="inp" id="${id}" type="number" inputmode="decimal" step="any" min="0" value="${v ?? ''}"><em>${unit}</em></span></label>`;
  const el = openOv('sheet', `
    <div class="sh"><div class="grow"><h2>Quick add</h2><small>For when you only know the numbers</small></div><button class="ib" data-act="close" aria-label="Close">${icon('close')}</button></div>
    <div class="ovb"><label class="field"><span>What was it? (optional)</span><input class="inp" id="qaName" value="${esc(entry?.name || '')}" placeholder="Lunch out"></label>
      ${f('qaK', 'Calories', 'kcal', n.kcal)}<div class="three">${f('qaP', 'Protein', 'g', n.protein)}${f('qaC', 'Carbs', 'g', n.carbs)}${f('qaF', 'Fat', 'g', n.fat)}</div></div>
    <div class="ovf">${entry ? `<button class="btn danger" style="flex:0 0 auto" id="qaDel" aria-label="Remove">${icon('trash')}</button>` : ''}<button class="btn primary" id="qaSave">${entry ? 'Save changes' : `Add to ${esc(meals()[meal])}`}</button></div>`);
  $('#qaSave', el).onclick = async () => {
    const v = { kcal: num($('#qaK', el).value), protein: num($('#qaP', el).value), carbs: num($('#qaC', el).value), fat: num($('#qaF', el).value) };
    if (!v.kcal) v.kcal = Math.round(v.protein * 4 + v.carbs * 4 + v.fat * 9);
    if (!v.kcal) return toast('Enter calories or macros');
    const rec = { m: meal, name: $('#qaName', el).value.trim() || 'Quick add', n: v };
    if (entry) C.updateEntry(day, entry.i, rec); else C.addEntry(day, rec);
    await closeOv(); toast(entry ? 'Saved' : `Added to ${meals()[meal]}`);
  };
  if (entry) $('#qaDel', el).onclick = async () => { C.removeEntry(day, entry.i); await closeOv(); toast('Removed'); };
}
acts.quickAdd = () => openQuickAdd();

// ---------- create or edit a food ----------
function openFoodEditor(food, { prefill, note, rawText } = {}) {
  const editing = !!food;
  const src = food || { name: prefill?.name || (add?.q || '').trim(), brand: '', bc: prefill?.bc || '', n: prefill?.n || {}, p: [] };
  const basis = prefill?.basis?.per === 'serving' ? 'serving' : '100g';
  const servG = prefill?.basis?.per === 'serving' ? (prefill.basis.grams || '') : (src.p?.[0]?.[1] || '');
  const servName = src.p?.[0]?.[0] || '';
  const nf = (x, big) => `<label class="field"><span>${x.name}</span><span class="unitin"><input class="inp" data-k="${x.k}" type="number" inputmode="decimal" step="any" min="0" value="${src.n[x.k] ?? ''}" ${big ? '' : 'placeholder="–"'}><em>${x.unit}</em></span></label>`;
  const main = ['kcal', 'protein', 'carbs', 'fat'];
  const el = openOv('page', `
    <div class="ovh"><button class="ib" data-act="close" aria-label="Back">${icon('back')}</button><h2>${editing ? 'Edit food' : 'New food'}</h2></div>
    <div class="ovb">
      ${note ? `<p class="note warn">${esc(note)}</p>` : ''}
      <label class="field"><span>Name</span><input class="inp" id="feName" value="${esc(src.name)}" autocomplete="off"></label>
      <div class="two"><label class="field"><span>Brand (optional)</span><input class="inp" id="feBrand" value="${esc(src.brand || '')}" autocomplete="off"></label>
        <label class="field"><span>Barcode (optional)</span><input class="inp" id="feBc" inputmode="numeric" value="${esc(src.bc || '')}"></label></div>
      <h3 class="sect">Nutrition on the label is given</h3>
      <div class="seg" id="feBasis"><button data-b="100g" aria-pressed="${basis === '100g'}">per 100 g or ml</button><button data-b="serving" aria-pressed="${basis === 'serving'}">per serving</button></div>
      <div class="two"><label class="field"><span>Serving name</span><input class="inp" id="feServName" value="${esc(servName)}" placeholder="1 pack"></label>
        <label class="field"><span>One serving weighs</span><span class="unitin"><input class="inp" id="feServG" type="number" inputmode="decimal" step="any" min="0" value="${servG}"><em>g</em></span></label></div>
      <p class="hint" id="feHint"></p>
      <div class="two">${main.map(k => nf(NUT[k], true)).join('')}</div>
      <details class="more"><summary>More nutrients</summary>${GROUPS.map(g => {
        const list = NUTRIENTS.filter(x => x.grp === g && !main.includes(x.k));
        return `<h3 class="sect" style="font-size:15px;margin-top:16px">${g}</h3><div class="two">${list.map(x => nf(x)).join('')}</div>`;
      }).join('')}</details>
      ${rawText ? `<details class="more"><summary>Text the reader saw</summary><pre style="white-space:pre-wrap;font-size:12.5px;color:var(--ink2);margin:10px 4px">${esc(rawText)}</pre></details>` : ''}
      ${editing ? `<button class="btn danger wide" style="margin-top:20px" id="feDel">${icon('trash')}Delete this food</button>` : ''}
    </div>
    <div class="ovf"><button class="btn primary" id="feSave">Save food</button></div>`);
  let b = basis;
  const hint = () => {
    $('#feHint', el).textContent = b === 'serving'
      ? 'Type the numbers exactly as printed for one serving. If the weight of a serving is not printed, leave 100 and log it by serving.'
      : 'Add a serving (for example “1 slice”, 30 g) if you want to log by pieces instead of grams.';
    if (b === 'serving' && !$('#feServG', el).value) $('#feServG', el).value = 100;
  };
  hint();
  $('#feBasis', el).onclick = e => {
    const bt = e.target.closest('button'); if (!bt) return;
    b = bt.dataset.b; $$('#feBasis button', el).forEach(x => x.setAttribute('aria-pressed', x === bt)); hint();
  };
  if (Object.keys(src.n).some(k => !main.includes(k))) $('details.more', el).open = true;
  $('#feSave', el).onclick = async () => {
    const name = $('#feName', el).value.trim();
    if (!name) { toast('Give the food a name'); $('#feName', el).focus(); return; }
    const sg = num($('#feServG', el).value);
    if (b === 'serving' && !(sg > 0)) { toast('Enter what one serving weighs'); return; }
    const k100 = b === 'serving' ? 100 / sg : 1;
    const n = {};
    $$('input[data-k]', el).forEach(i => { if (i.value !== '') n[i.dataset.k] = +(num(i.value) * k100).toPrecision(6); });
    if (n.kcal == null) n.kcal = Math.round((n.protein || 0) * 4 + (n.carbs || 0) * 4 + (n.fat || 0) * 9);
    const sn = $('#feServName', el).value.trim();
    const p = [...(sg > 0 ? [[sn || '1 serving', sg]] : []), ...(src.p || []).slice(1)];
    const out = { ...(food || {}), name, n, p, src: food?.src || (prefill?.n ? 'label' : 'custom') };
    const brand = $('#feBrand', el).value.trim(), bc = $('#feBc', el).value.trim();
    if (brand) out.brand = brand; else delete out.brand;
    if (bc) out.bc = bc; else delete out.bc;
    C.saveFood(out);
    await closeOv();
    toast('Food saved');
    if (!editing && add) openFoodSheet(out); else if (add) renderAdd();
  };
  if (editing) $('#feDel', el).onclick = async () => { C.deleteFood(food.id); await closeOv(); if (add) renderAdd(); toast('Deleted'); };
}
acts.newFood = () => openFoodEditor(null);

// ---------- recipes ----------
function openRecipeEditor(recipe) {
  const rec = { id: recipe?.id, name: recipe?.name || '', servings: recipe?.servings || 1, cooked: recipe?.cooked || '', ing: (recipe?.ing || []).map(x => ({ ...x })) };
  const el = openOv('page', `
    <div class="ovh"><button class="ib" data-act="close" aria-label="Back">${icon('back')}</button><h2>${rec.id ? 'Edit recipe' : 'New recipe'}</h2></div>
    <div class="ovb"><label class="field"><span>Name</span><input class="inp" id="reName" value="${esc(rec.name)}" placeholder="Chicken tagine" autocomplete="off"></label>
      <div class="two"><label class="field"><span>Makes how many servings</span><input class="inp" id="reServ" type="number" inputmode="decimal" min="1" step="any" value="${rec.servings}"></label>
        <label class="field"><span>Cooked weight (optional)</span><span class="unitin"><input class="inp" id="reCooked" type="number" inputmode="decimal" min="0" step="any" value="${rec.cooked}"><em>g</em></span></label></div>
      <h3 class="sect">Ingredients</h3><div id="reIng"></div>
      <button class="btn ghost wide" style="margin-top:10px" id="reAdd">${icon('plus')}Add ingredient</button>
      <div id="reTotal"></div>
      ${rec.id ? `<button class="btn danger wide" style="margin-top:20px" id="reDel">${icon('trash')}Delete this recipe</button>` : ''}</div>
    <div class="ovf"><button class="btn primary" id="reSave">Save recipe</button></div>`);
  const draw = () => {
    $('#reIng', el).innerHTML = rec.ing.length ? `<ul class="rows">${rec.ing.map((x, i) => `<li><div class="row"><span class="t"><strong>${esc(C.getFood(x.f)?.name || 'Unknown food')}</strong></span>
      <span class="unitin" style="width:104px"><input class="inp" style="min-height:42px" type="number" inputmode="decimal" min="0" step="any" value="${x.g}" data-i="${i}" aria-label="Grams"><em>g</em></span>
      <button class="ib" data-rm="${i}" aria-label="Remove ingredient">${icon('close')}</button></div></li>`).join('')}</ul>` : `<p class="hint">Add each ingredient with the amount that goes into the whole dish.</p>`;
    total();
  };
  const total = () => {
    const { n, total } = C.recipeNutrients(rec.ing, num($('#reCooked', el).value));
    const s = Math.max(1, num($('#reServ', el).value) || 1), per = total / s, v = k => (n[k] || 0) * per / 100;
    $('#reTotal', el).innerHTML = rec.ing.length ? `<h3 class="sect">One serving, about ${fmt(per)} g</h3>
      <div class="mini" style="margin-top:0"><div><span>Calories</span><b class="num">${fmt(v('kcal'))}</b></div><div style="--tone:var(--p)"><span>Protein</span><b class="num">${fmt(v('protein'), 1)}</b></div>
      <div style="--tone:var(--c)"><span>Carbs</span><b class="num">${fmt(v('carbs'), 1)}</b></div><div style="--tone:var(--f)"><span>Fat</span><b class="num">${fmt(v('fat'), 1)}</b></div></div>` : '';
  };
  $('#reIng', el).addEventListener('input', e => { const i = e.target.dataset.i; if (i != null) { rec.ing[+i].g = num(e.target.value); total(); } });
  $('#reIng', el).addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b) { rec.ing.splice(+b.dataset.rm, 1); draw(); } });
  $('#reServ', el).oninput = total; $('#reCooked', el).oninput = total;
  $('#reAdd', el).onclick = () => openAdd({ mode: 'pick', onPick: x => { rec.ing.push(x); draw(); } });
  $('#reSave', el).onclick = async () => {
    const name = $('#reName', el).value.trim();
    if (!name) { toast('Give the recipe a name'); $('#reName', el).focus(); return; }
    if (!rec.ing.length) { toast('Add at least one ingredient'); return; }
    const cooked = num($('#reCooked', el).value), servings = Math.max(1, num($('#reServ', el).value) || 1);
    const { n, total: tw } = C.recipeNutrients(rec.ing, cooked);
    C.saveFood({ ...(rec.id ? C.state.foods[rec.id] : {}), id: rec.id, src: 'recipe', name, n, servings, cooked: cooked || undefined, ing: rec.ing,
      p: [['1 serving', Math.round(tw / servings * 10) / 10]] });
    await closeOv(); if (add) { add.tab = 'recipes'; renderAdd(); }
    toast('Recipe saved');
  };
  if (rec.id) $('#reDel', el).onclick = async () => { C.deleteFood(rec.id); await closeOv(); if (add) renderAdd(); toast('Deleted'); };
  draw();
}
acts.newRecipe = () => openRecipeEditor(null);

// ---------- barcode scanner ----------
let scanner = null;
acts.scanBarcode = async () => {
  const el = openOv('scan', `<video muted playsinline></video><div class="frame"></div>
    <div class="ovh"><button class="ib" data-act="close" aria-label="Back">${icon('back')}</button><span style="flex:1"></span><button class="ib" id="torch" hidden aria-label="Light">${icon('torch')}</button></div>
    <div class="panel" id="scanPanel"></div>`, { onClose: () => { scanner?.stop(); scanner = null; } });
  const panel = $('#scanPanel', el);
  const manual = `<form class="manual" id="bcForm"><input class="inp" id="bcIn" inputmode="numeric" placeholder="Or type the number" aria-label="Barcode number"><button class="btn dark">Look up</button></form>`;
  const idle = msg => {
    panel.innerHTML = `<p>${msg}</p>${manual}`;
    $('#bcForm', panel).onsubmit = e => { e.preventDefault(); const v = $('#bcIn', panel).value.replace(/\D/g, ''); if (v.length >= 8) found(v); else toast('That number looks too short'); };
  };
  const found = async code => {
    scanner?.stop(); scanner = null;
    let f = C.findByBarcode(code), offline = false;
    if (!f) {
      panel.innerHTML = `<p>Looking up ${esc(code)}…</p><div class="progress"><i style="--w:60%"></i></div>`;
      try { f = await S.lookupBarcode(code); if (f) C.saveFood(f); } catch { offline = true; }
    }
    if (topOv() !== el) return;
    if (f) { await closeOv(); openFoodSheet(f); return; }
    panel.innerHTML = `<p><strong>${offline ? 'No connection to look this up.' : 'This product is not in the open database yet.'}</strong><br>
      Photograph its nutrition label, and next time the barcode will be recognised.</p>
      <div class="two"><button class="btn primary" id="bcLabel">${icon('label')}Scan label</button><button class="btn" id="bcHand">${icon('pencil')}Type it in</button></div>`;
    $('#bcLabel', panel).onclick = async () => { await closeOv(); startLabelScan(code); };
    $('#bcHand', panel).onclick = async () => { await closeOv(); openFoodEditor(null, { prefill: { bc: code } }); };
  };
  idle('Point the camera at the barcode.');
  try {
    scanner = await S.startBarcodeScanner($('video', el), found);
    if (topOv() !== el) { scanner.stop(); scanner = null; return; }
    if (scanner.canTorch) { const t = $('#torch', el); t.hidden = false; t.onclick = () => scanner?.torch(); }
  } catch (e) {
    $('.frame', el).remove();
    idle(e.name === 'NotAllowedError' ? 'Camera access is blocked. Allow the camera for this app in your browser settings, or type the number under the barcode.'
      : 'No camera available here. Type the number under the barcode.');
  }
};

// ---------- label scanner ----------
let labelBarcode = null;
function startLabelScan(code) { labelBarcode = code || null; const i = $('#labelCam'); i.value = ''; i.click(); }
acts.scanLabel = () => startLabelScan();
$('#labelCam').addEventListener('change', async e => {
  const file = e.target.files[0]; if (!file) return;
  const el = openOv('page', `<div class="ovh"><button class="ib" data-act="close" aria-label="Cancel">${icon('close')}</button><h2>Reading the label</h2></div>
    <div class="center"><p id="ocrMsg">Preparing the photo</p><div class="progress" style="width:240px"><i id="ocrBar"></i></div>
    <p class="hint">This happens on your phone. The first time it downloads the reader, about 9 MB.</p></div>`);
  let res, err;
  try { res = await S.readLabel(file, (p, msg) => { const b = $('#ocrBar', el); if (b) { b.style.setProperty('--w', Math.round(p * 100) + '%'); $('#ocrMsg', el).textContent = msg; } }); }
  catch (x) { err = x; console.warn(x); }
  if (topOv() !== el) return;
  await closeOv();
  const bc = labelBarcode;
  if (err || !res.count) {
    openFoodEditor(null, { prefill: { bc }, rawText: res?.text, note: err ? 'The label reader could not start (it needs a connection the first time). You can type the numbers in.'
      : 'No numbers could be read from that photo. Fill the label in by hand, or go back and try a closer, flatter, well-lit shot.' });
  } else {
    openFoodEditor(null, { prefill: { n: res.n, basis: res.basis, bc }, rawText: res.text,
      note: `Read ${res.count} value${res.count === 1 ? '' : 's'} from the photo. Check each one against the label before saving, the reader makes mistakes.` });
  }
});

// ---------- nutrients ----------
function periodData() {
  if (ui.nutRange === 'day') return { totals: C.dayTotals(ui.day), label: `${dayTitle(ui.day)}, ${shortDate(ui.day)}`, days: [ui.day] };
  const { totals, daysLogged } = C.averageTotals(ui.day, 7);
  return { totals, label: `Daily average, ${shortDate(C.addDays(ui.day, -6))} to ${shortDate(ui.day)} (${daysLogged} day${daysLogged === 1 ? '' : 's'} logged)`,
    days: Array.from({ length: 7 }, (_, i) => C.addDays(ui.day, -i)), daysLogged };
}
function viewNutrients() {
  const { totals, label } = periodData();
  const row = x => {
    const v = totals[x.k] || 0, t = C.target(x.k), pct = t ? v / t * 100 : 0;
    return `<li><button class="nrow" data-act="nutrient" data-k="${x.k}"><span class="l"><span>${x.name}</span>
      <em><b>${C.fmtN(x.k, v)}</b>${t ? ` / ${fmt(t, t < 10 ? 1 : 0)}` : ''} ${x.unit}</em></span>
      <span class="bar ${t ? '' : 'none'} ${x.kind === 'limit' ? 'limit' : ''} ${pct >= 100 ? 'done' : ''}"><i style="--w:${Math.min(100, pct).toFixed(0)}%"></i></span></button></li>`;
  };
  $('#view').innerHTML = `
    <header class="top"><div class="grow"><h1>Nutrients</h1><span class="when">${esc(label)}</span></div>${dayNav()}</header>
    <div class="seg" style="margin-top:6px"><button data-act="nutRange" data-r="day" aria-pressed="${ui.nutRange === 'day'}">One day</button>
      <button data-act="nutRange" data-r="week" aria-pressed="${ui.nutRange === 'week'}">7-day average</button></div>
    ${GROUPS.map(g => `<h2 class="sect">${g}</h2><ul class="rows">${NUTRIENTS.filter(x => x.grp === g).map(row).join('')}</ul>`).join('')}
    <p class="hint" style="margin-top:14px">Bars show progress to your daily target. Sodium, saturated fat and cholesterol are upper limits, so their bar turns red when you pass them. Scanned and hand-entered foods only count the nutrients their label lists.</p>`;
}
acts.nutRange = el => { ui.nutRange = el.dataset.r; render(); };
acts.nutrient = el => {
  const x = NUT[el.dataset.k];
  const range = ui.tab === 'nutrients' ? ui.nutRange : 'day';
  const days = range === 'day' ? [ui.day] : Array.from({ length: 7 }, (_, i) => C.addDays(ui.day, -i));
  const by = {}; let total = 0;
  for (const d of days) for (const e of C.dayEntries(d)) {
    const v = C.entryNutrients(e)[x.k] || 0; if (!v) continue;
    by[C.entryName(e)] = (by[C.entryName(e)] || 0) + v; total += v;
  }
  const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const t = C.target(x.k);
  const el2 = openOv('sheet', `<div class="sh"><div class="grow"><h2>${x.name}</h2><small>${range === 'day' ? `${dayTitle(ui.day)}, ${shortDate(ui.day)}` : 'Last 7 days, total'}</small></div>
      <button class="ib" data-act="close" aria-label="Close">${icon('close')}</button></div>
    <div class="ovb">
      ${top.length ? `<h3 class="sect" style="margin-top:8px">Where it came from</h3><ul class="rows">${top.map(([name, v]) => `<li><div class="row"><span class="t"><strong>${esc(name)}</strong>
        <span class="bar"><i style="--w:${(v / total * 100).toFixed(0)}%"></i></span></span><span class="v num">${C.fmtN(x.k, v)}<small>${x.unit}</small></span></div></li>`).join('')}</ul>`
        : `<p class="hint">Nothing logged ${range === 'day' ? 'on this day' : 'in these 7 days'} contains ${x.name.toLowerCase()}.</p>`}
      <label class="field"><span>Daily ${x.kind === 'limit' ? 'limit' : 'target'}</span><span class="unitin"><input class="inp" id="ntT" type="number" inputmode="decimal" step="any" min="0" value="${t ?? ''}" placeholder="None"><em>${x.unit}</em></span></label>
      <p class="hint">${x.dv ? `Standard reference value: ${fmt(x.dv, x.dv < 10 ? 1 : 0)} ${x.unit} a day.` : 'There is no standard reference value for this one.'}</p></div>
    <div class="ovf">${x.dv && !['kcal', 'protein', 'carbs', 'fat'].includes(x.k) ? `<button class="btn" id="ntReset">Use standard</button>` : ''}<button class="btn primary" id="ntSave">Save target</button></div>`);
  $('#ntSave', el2).onclick = async () => {
    const v = $('#ntT', el2).value;
    if (['kcal', 'protein', 'carbs', 'fat'].includes(x.k) && !(num(v) > 0)) return toast('Enter a number above zero');
    C.setTarget(x.k, v === '' ? null : num(v)); await closeOv(); toast('Target saved');
  };
  const r = $('#ntReset', el2); if (r) r.onclick = async () => { C.setTarget(x.k, null); await closeOv(); toast('Back to the standard value'); };
};

// ---------- body ----------
const METRICS = { w: { name: 'Weight', unit: 'kg' }, bf: { name: 'Body fat', unit: '%' }, waist: { name: 'Waist', unit: 'cm' } };
function viewBody() {
  const m = ui.bodyMetric, M = METRICS[m];
  const all = C.trend(C.state.body.filter(b => b[m] != null).map(b => ({ d: b.d, v: b[m] })));
  const from = ui.bodyRange ? C.addDays(C.dkey(), -ui.bodyRange) : '';
  const pts = all.filter(p => p.d >= from);
  const lastP = pts[pts.length - 1], firstP = pts[0];
  const delta = lastP && firstP && pts.length > 1 ? lastP.t - firstP.t : null;
  const ranges = [[30, '1 month'], [90, '3 months'], [365, '1 year'], [0, 'All']];
  $('#view').innerHTML = `
    <header class="top"><div class="grow"><h1>Body</h1></div><button class="btn primary" style="min-height:44px;padding:0 16px" data-act="logBody">${icon('plus')}Log</button></header>
    <div class="seg" style="margin-top:6px">${Object.entries(METRICS).map(([k, x]) => `<button data-act="bodyMetric" data-m="${k}" aria-pressed="${k === m}">${x.name}</button>`).join('')}</div>
    ${pts.length ? `<div class="chart">${chartSvg(pts, M.unit)}<div class="legend"><span><i class="dot"></i>Each reading</span><span><i></i>Trend</span></div></div>
      <div class="stats"><div><span>Latest</span><b class="num">${fmt(lastP.v, 1)} ${M.unit}</b></div><div><span>Trend</span><b class="num">${fmt(lastP.t, 1)} ${M.unit}</b></div>
        <div><span>Change</span><b class="num">${delta == null ? '–' : (delta > 0 ? '+' : delta < 0 ? '−' : '') + fmt(Math.abs(delta), 1) + ' ' + M.unit}</b></div></div>`
      : `<p class="note">${all.length ? 'No readings in this period.' : `No ${M.name.toLowerCase()} readings yet. Log one to start the chart. The trend line smooths out day-to-day swings, so one heavy morning does not mislead you.`}</p>`}
    <div class="chips" style="margin-top:12px">${ranges.map(([d, l]) => `<button data-act="bodyRange" data-r="${d}" aria-pressed="${ui.bodyRange === d}">${l}</button>`).join('')}</div>
    ${C.state.body.length ? `<h2 class="sect">Readings</h2><ul class="rows">${[...C.state.body].reverse().slice(0, 60).map(b => `<li><button class="row" data-act="logBody" data-d="${b.d}">
      <span class="t"><strong>${longDate(b.d)}</strong><small>${[b.bf != null && `${fmt(b.bf, 1)} % body fat`, b.waist != null && `waist ${fmt(b.waist, 1)} cm`].filter(Boolean).join(', ')}</small></span>
      <span class="v num">${b.w != null ? fmt(b.w, 1) : '–'}<small>kg</small></span></button></li>`).join('')}</ul>` : ''}`;
}
function chartSvg(pts, unit) {
  const W = 340, H = 170, L = 34, R = 8, T = 8, B = 22;
  const xs = pts.map(p => C.parseKey(p.d).getTime()), x0 = Math.min(...xs), x1 = Math.max(...xs);
  const vals = pts.flatMap(p => [p.v, p.t]);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const padY = Math.max(0.5, (hi - lo) * 0.15); lo -= padY; hi += padY;
  const X = t => (x1 === x0 ? (L + W - R) / 2 : L + (t - x0) / (x1 - x0) * (W - L - R));
  const Y = v => T + (hi - v) / (hi - lo) * (H - T - B);
  const grid = [0, 0.5, 1].map(f => { const v = lo + (hi - lo) * (1 - f), y = Y(v);
    return `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${L - 6}" y="${y + 4}" text-anchor="end">${fmt(v, 1)}</text>`; }).join('');
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(xs[i]).toFixed(1)} ${Y(p.t).toFixed(1)}`).join('');
  const dots = pts.map((p, i) => `<circle cx="${X(xs[i]).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="2.6" fill="var(--ink2)" opacity=".55"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Chart of readings and trend in ${unit}">${grid}${dots}
    <path d="${path}" fill="none" stroke="var(--ume)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${L}" y="${H - 4}">${shortDate(pts[0].d)}</text>${pts.length > 1 ? `<text x="${W - R}" y="${H - 4}" text-anchor="end">${shortDate(pts[pts.length - 1].d)}</text>` : ''}</svg>`;
}
acts.bodyMetric = el => { ui.bodyMetric = el.dataset.m; render(); };
acts.bodyRange = el => { ui.bodyRange = +el.dataset.r; render(); };
acts.logBody = el => {
  const d0 = el.dataset.d || C.dkey();
  const ex = C.state.body.find(b => b.d === d0);
  const f = (id, label, unit, v) => `<label class="field"><span>${label}</span><span class="unitin"><input class="inp" id="${id}" type="number" inputmode="decimal" step="any" min="0" value="${v ?? ''}"><em>${unit}</em></span></label>`;
  const s = openOv('sheet', `<div class="sh"><div class="grow"><h2>${ex ? 'Edit reading' : 'Log a reading'}</h2><small>Fill in only what you measured</small></div><button class="ib" data-act="close" aria-label="Close">${icon('close')}</button></div>
    <div class="ovb"><label class="field"><span>Date</span><input class="inp" id="bdD" type="date" value="${d0}" max="${C.dkey()}"></label>
      ${f('bdW', 'Weight', 'kg', ex?.w)}<div class="two">${f('bdF', 'Body fat', '%', ex?.bf)}${f('bdWa', 'Waist', 'cm', ex?.waist)}</div></div>
    <div class="ovf">${ex ? `<button class="btn danger" style="flex:0 0 auto" id="bdDel" aria-label="Delete reading">${icon('trash')}</button>` : ''}<button class="btn primary" id="bdSave">Save reading</button></div>`);
  $('#bdSave', s).onclick = async () => {
    const rec = { d: $('#bdD', s).value || d0 };
    for (const [id, k] of [['bdW', 'w'], ['bdF', 'bf'], ['bdWa', 'waist']]) { const v = $('#' + id, s).value; if (v !== '' && num(v) > 0) rec[k] = num(v); }
    if (Object.keys(rec).length < 2) return toast('Enter at least one measurement');
    if (ex && rec.d !== ex.d) C.removeBody(ex.d);
    C.saveBody(rec); await closeOv(); toast('Saved');
  };
  if (ex) $('#bdDel', s).onclick = async () => { C.removeBody(ex.d); await closeOv(); toast('Deleted'); };
};

// ---------- more ----------
let installEvt = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (ui.tab === 'more' && !stack.length) render(); });
function viewMore() {
  const g = C.state.goals, th = C.state.settings.theme;
  const item = (act, ic, label, sub) => `<button data-act="${act}">${icon(ic)}<span class="t">${label}${sub ? `<small>${sub}</small>` : ''}</span>${icon('next')}</button>`;
  $('#view').innerHTML = `
    <header class="top"><div class="grow"><h1>More</h1></div></header>
    <div class="menu">${item('goals', 'target', 'Goals', `${fmt(g.kcal)} kcal, ${fmt(g.protein)} g protein, ${fmt(g.carbs)} g carbs, ${fmt(g.fat)} g fat`)}
      ${item('myFoods', 'box', 'My foods', `${C.myFoods('food').length} saved`)}${item('myRecipes', 'book', 'Recipes', `${C.myFoods('recipe').length} saved`)}</div>
    <h2 class="sect">Appearance</h2>
    <div class="seg">${[['system', 'Match phone'], ['light', 'Light'], ['dark', 'Dark']].map(([k, l]) => `<button data-act="theme" data-t="${k}" aria-pressed="${th === k}">${l}</button>`).join('')}</div>
    <h2 class="sect">Your data</h2>
    <div class="menu"><button data-act="backup">${icon('save')}<span class="t">Save a backup file<small>Everything you have logged, in one file</small></span></button>
      <button data-act="restore">${icon('restore')}<span class="t">Restore from a backup file<small>Replaces what is on this phone</small></span></button>
      <div class="item">${icon('info')}<span class="t">Stored on this phone only<small>${fmt(C.storageBytes() / 1024)} KB used of roughly 5,000 KB. Nothing is sent anywhere.</small></span></div></div>
    <h2 class="sect">App</h2>
    <div class="menu">${installEvt ? `<button data-act="install">${icon('install')}<span class="t">Install on this phone<small>Opens like any other app, works offline</small></span></button>` : ''}
      <button data-act="offlineLabel">${icon('label')}<span class="t">Get the label reader ready for offline use<small>Downloads about 9 MB once</small></span></button>
      ${item('about', 'info', 'About and data sources', '')}</div>`;
}
acts.theme = el => {
  C.state.settings.theme = el.dataset.t; C.save(); applyTheme(); render();
};
function applyTheme() {
  const t = C.state.settings.theme;
  if (t === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  $('meta[name=theme-color]').content = dark ? '#111416' : '#F4F4F0';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
acts.install = async () => { if (!installEvt) return; installEvt.prompt(); await installEvt.userChoice; installEvt = null; render(); };
acts.offlineLabel = async el => {
  const files = ['vendor/tesseract/tesseract.min.js', 'vendor/tesseract/worker.min.js', 'vendor/lang/eng.traineddata.gz', 'vendor/lang/jpn.traineddata.gz',
    'vendor/tesseract/tesseract-core-relaxedsimd-lstm.wasm.js', 'vendor/tesseract/tesseract-core-simd-lstm.wasm.js', 'vendor/tesseract/tesseract-core-lstm.wasm.js', 'vendor/zxing/zxing.min.js'];
  const sub = el.querySelector('small'); let done = 0;
  try {
    for (const f of files) { sub.textContent = `Downloading ${++done} of ${files.length}…`; const r = await fetch(f); if (!r.ok) throw 0; await r.blob(); }
    sub.textContent = 'Ready. Label reading now works without a connection.';
  } catch { sub.textContent = 'Could not download. Check your connection and try again.'; }
};
acts.backup = () => {
  const blob = new Blob([C.exportBackup()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `bento-backup-${C.dkey()}.json`;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast('Backup file saved to your downloads');
};
acts.restore = () => { const i = $('#restoreFile'); i.value = ''; i.click(); };
$('#restoreFile').addEventListener('change', async e => {
  const file = e.target.files[0]; if (!file) return;
  const text = await file.text();
  let info;
  try { const o = JSON.parse(text); if (o.app !== 'bento-food-diary') throw 0; info = { days: Object.keys(o.data.diary || {}).length, when: (o.exported || '').slice(0, 10) }; }
  catch { return toast('That file is not a Bento backup'); }
  const s = openOv('sheet', `<div class="sh"><div class="grow"><h2>Restore this backup?</h2></div></div>
    <div class="ovb"><p>The backup from ${esc(info.when || 'an unknown date')} holds ${info.days} logged day${info.days === 1 ? '' : 's'}. It will replace everything currently on this phone.</p></div>
    <div class="ovf"><button class="btn" data-act="close">Keep what I have</button><button class="btn primary" id="rsGo">Restore backup</button></div>`);
  $('#rsGo', s).onclick = async () => {
    try { C.importBackup(text); applyTheme(); await closeOv(); toast('Backup restored'); } catch { toast('That file could not be restored'); }
  };
});
function listPage(title, kind) {
  const draw = () => {
    const list = C.myFoods(kind);
    $('.ovb', el).innerHTML = (list.length ? `<ul class="rows">${list.map(f => `<li><button class="row" data-id="${esc(f.id)}"><span class="t"><strong>${esc(f.name)}</strong><small>${esc(f.brand || C.srcLabel(f))}</small></span>
      <span class="v num">${fmt(f.n.kcal || 0)}<small>kcal per 100 g</small></span></button></li>`).join('')}</ul>`
      : `<p class="hint">${kind === 'recipe' ? 'No recipes yet.' : 'Nothing here yet. Foods you create, scan or read from a label are kept here.'}</p>`)
      + `<button class="btn primary wide" style="margin-top:12px" id="lpNew">${icon('plus')}${kind === 'recipe' ? 'New recipe' : 'New food'}</button>`;
  };
  const el = openOv('page', `<div class="ovh"><button class="ib" data-act="close" aria-label="Back">${icon('back')}</button><h2>${title}</h2></div><div class="ovb"></div>`, { onShow: () => draw() });
  el.addEventListener('click', e => {
    const r = e.target.closest('.row[data-id]');
    if (r) { const f = C.state.foods[r.dataset.id]; kind === 'recipe' ? openRecipeEditor(f) : openFoodEditor(f); }
    else if (e.target.closest('#lpNew')) kind === 'recipe' ? openRecipeEditor(null) : openFoodEditor(null);
  });
  draw();
}
acts.myFoods = () => listPage('My foods', 'food');
acts.myRecipes = () => listPage('Recipes', 'recipe');

acts.goals = () => {
  const g = C.state.goals, p = C.state.profile, lastW = [...C.state.body].reverse().find(b => b.w != null)?.w;
  const f = (id, label, unit, v) => `<label class="field"><span>${label}</span><span class="unitin"><input class="inp" id="${id}" type="number" inputmode="decimal" step="any" min="0" value="${v ?? ''}"><em>${unit}</em></span></label>`;
  const opt = (list, cur) => list.map(([v, l]) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${l}</option>`).join('');
  const el = openOv('page', `<div class="ovh"><button class="ib" data-act="close" aria-label="Back">${icon('back')}</button><h2>Goals</h2></div>
    <div class="ovb">${f('glK', 'Calories a day', 'kcal', g.kcal)}<div class="three">${f('glP', 'Protein', 'g', g.protein)}${f('glC', 'Carbs', 'g', g.carbs)}${f('glF', 'Fat', 'g', g.fat)}</div>
      <p class="hint" id="glSum"></p>
      <h3 class="sect">Work out a starting point</h3>
      <div class="two"><label class="field"><span>Sex</span><select class="inp" id="pfS">${opt([['m', 'Male'], ['f', 'Female']], p.sex)}</select></label>${f('pfA', 'Age', 'years', p.age)}</div>
      <div class="two">${f('pfH', 'Height', 'cm', p.height)}${f('pfW', 'Weight', 'kg', lastW ?? p.weight ?? '')}</div>
      <label class="field"><span>Activity</span><select class="inp" id="pfAct">${opt([[1.2, 'Mostly sitting'], [1.375, 'Lightly active, some walking'], [1.55, 'Active, exercise 3 to 5 days a week'], [1.725, 'Very active, hard exercise most days']], p.activity)}</select></label>
      <label class="field"><span>Aim</span><select class="inp" id="pfAim">${opt([[-500, 'Lose about 0.5 kg a week'], [-250, 'Lose about 0.25 kg a week'], [0, 'Stay the same weight'], [250, 'Gain about 0.25 kg a week']], p.aim)}</select></label>
      <button class="btn dark wide" style="margin-top:14px" id="glSuggest">Suggest my goals</button>
      <p class="hint">The suggestion estimates your energy use with the Mifflin-St Jeor equation. It is a starting estimate, not medical advice: adjust it by how your weight trend actually moves over a few weeks.</p></div>
    <div class="ovf"><button class="btn primary" id="glSave">Save goals</button></div>`);
  const sumUp = () => {
    const k = num($('#glP', el).value) * 4 + num($('#glC', el).value) * 4 + num($('#glF', el).value) * 9;
    $('#glSum', el).textContent = `These macros add up to ${fmt(k)} kcal.`;
  };
  el.addEventListener('input', sumUp); sumUp();
  $('#glSuggest', el).onclick = () => {
    const pr = { sex: $('#pfS', el).value, age: num($('#pfA', el).value), height: num($('#pfH', el).value), weight: num($('#pfW', el).value), activity: +$('#pfAct', el).value, aim: +$('#pfAim', el).value };
    if (!(pr.age > 0 && pr.height > 0 && pr.weight > 0)) return toast('Fill in age, height and weight first');
    const s = C.suggestGoals(pr);
    Object.assign(C.state.profile, pr); C.save();
    $('#glK', el).value = s.kcal; $('#glP', el).value = s.protein; $('#glC', el).value = s.carbs; $('#glF', el).value = s.fat; sumUp();
    toast(`You burn about ${fmt(s.maintenance)} kcal a day`);
  };
  $('#glSave', el).onclick = async () => {
    const v = { kcal: num($('#glK', el).value), protein: num($('#glP', el).value), carbs: num($('#glC', el).value), fat: num($('#glF', el).value) };
    if (!(v.kcal > 0)) return toast('Enter a calorie goal');
    Object.assign(C.state.goals, v); C.save(); await closeOv(); toast('Goals saved');
  };
};
acts.about = () => openOv('page', `<div class="ovh"><button class="ib" data-act="close" aria-label="Back">${icon('back')}</button><h2>About and data sources</h2></div>
  <div class="ovb prose">
    <p>Bento is a private food diary. There is no account and no server: your diary lives in this browser on this phone. Save a backup file now and then, because clearing the browser's site data erases it.</p>
    <h3 class="sect">Built-in foods</h3>
    <p>${fmt(C.db.foods.length || 8257)} everyday foods with ${NUTRIENTS.length} nutrients each come from the USDA National Nutrient Database for Standard Reference, release 28 (US Department of Agriculture, public domain). Values are per 100 g of the edible part.</p>
    <h3 class="sect">Barcodes</h3>
    <p>Scanned barcodes are looked up in <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener">Open Food Facts</a>, a free database filled in by volunteers and shared under the Open Database Licence. It needs a connection, coverage varies by country, and entries can be incomplete or wrong, so compare with the pack. Each product you scan is kept on the phone and works offline afterwards.</p>
    <h3 class="sect">Labels</h3>
    <p>Label photos are read on the phone by Tesseract (open source), in English and Japanese; French labels usually work too. The photo is not uploaded or stored. The reader makes mistakes, so check the numbers before saving.</p>
    <h3 class="sect">Targets</h3>
    <p>Default vitamin and mineral targets are the US FDA Daily Values for adults. Your needs can differ with age, sex, pregnancy or a health condition. You can change any target by tapping the nutrient.</p>
    <p>Bento is a logging tool, not medical or dietary advice.</p></div>`);

// ---------- start ----------
C.setSaveErrorHandler(() => toast('Storage is full. Save a backup, then delete old days.'));
C.load();
history.replaceState({ depth: 0 }, '');
applyTheme();
render();
C.loadDb().catch(() => toast('The food list could not be loaded'));
if (new URLSearchParams(location.search).has('add')) openAdd();
addEventListener('visibilitychange', () => { if (document.hidden) C.save(true); else if (!stack.length) render(); });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});

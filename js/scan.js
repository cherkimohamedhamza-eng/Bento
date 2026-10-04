// Bento — camera features: barcode scanning, product lookup, nutrition-label reading.
import { NUT } from './core.js';

const abs = p => new URL(p, document.baseURI).href;
const loadScript = src => new Promise((res, rej) => {
  if (document.querySelector(`script[data-src="${src}"]`)) return res();
  const s = document.createElement('script');
  s.src = src; s.dataset.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src));
  document.head.append(s);
});

// ---------- barcode ----------
export function validBarcode(code) {
  if (!/^\d{8}$|^\d{12,14}$/.test(code)) return false;
  const d = code.split('').map(Number);
  const check = d.pop();
  const s = d.reverse().reduce((a, x, i) => a + x * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (s % 10)) % 10 === check;
}

export async function startBarcodeScanner(video, onCode) {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('nocamera');
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
  });
  video.srcObject = stream;
  video.setAttribute('playsinline', '');
  await video.play().catch(() => {});
  const track = stream.getVideoTracks()[0];
  let stopped = false, timer = null, reader = null, last = '', hits = 0;

  const accept = raw => {
    const code = String(raw).trim();
    if (!validBarcode(code)) return;
    // require the same reading twice in a row: cheap protection against misreads
    if (code === last) hits++; else { last = code; hits = 1; }
    if (hits >= 2 && !stopped) { stop(); onCode(code); }
  };

  if ('BarcodeDetector' in window) {
    const det = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
    const tick = async () => {
      if (stopped) return;
      try { if (video.readyState >= 2) for (const b of await det.detect(video)) accept(b.rawValue); } catch {}
      timer = setTimeout(tick, 140);
    };
    tick();
  } else {
    await loadScript('vendor/zxing/zxing.min.js');
    const Z = window.ZXing;
    const hints = new Map([[Z.DecodeHintType.POSSIBLE_FORMATS,
      [Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.UPC_E]]]);
    reader = new Z.BrowserMultiFormatReader(hints, 120);
    reader.decodeFromStream(stream, video, res => { if (res) accept(res.getText()); });
  }

  function stop() {
    stopped = true;
    clearTimeout(timer);
    try { reader?.reset(); } catch {}
    stream.getTracks().forEach(t => t.stop());
    video.srcObject = null;
  }
  const canTorch = !!track.getCapabilities?.().torch;
  let torchOn = false;
  const torch = async () => {
    torchOn = !torchOn;
    try { await track.applyConstraints({ advanced: [{ torch: torchOn }] }); } catch { torchOn = false; }
    return torchOn;
  };
  return { stop, canTorch, torch };
}

// ---------- Open Food Facts ----------
// OFF stores every "_100g" mass value in grams; convert to the unit this app uses.
const OFF_MAP = {
  kcal: ['energy-kcal'], protein: ['proteins'], carbs: ['carbohydrates'], fat: ['fat'], fiber: ['fiber'],
  sugar: ['sugars'], satfat: ['saturated-fat'], monofat: ['monounsaturated-fat'], polyfat: ['polyunsaturated-fat'],
  chol: ['cholesterol'], sodium: ['sodium'], potassium: ['potassium'], calcium: ['calcium'], iron: ['iron'],
  magnesium: ['magnesium'], phosphorus: ['phosphorus'], zinc: ['zinc'], copper: ['copper'], manganese: ['manganese'],
  selenium: ['selenium'], vita: ['vitamin-a'], vitc: ['vitamin-c'], vitd: ['vitamin-d'], vite: ['vitamin-e'],
  vitk: ['vitamin-k'], b1: ['vitamin-b1'], b2: ['vitamin-b2'], b3: ['vitamin-pp'], b5: ['pantothenic-acid'],
  b6: ['vitamin-b6'], folate: ['vitamin-b9', 'folates'], b12: ['vitamin-b12'], choline: ['choline'],
};
const UNIT_FACTOR = { g: 1, mg: 1e3, 'µg': 1e6, kcal: 1 };
const OFF_FIELDS = 'code,product_name,product_name_en,generic_name,brands,quantity,serving_size,serving_quantity,nutriments';

export function offToFood(p) {
  const nm = p.nutriments || {};
  const servQ = parseFloat(p.serving_quantity) || 0;
  const n = {};
  const read = (key, suffix) => { const v = nm[key + suffix]; return v === '' || v == null ? null : Number(v); };
  for (const [k, keys] of Object.entries(OFF_MAP)) {
    for (const key of keys) {
      let v = read(key, '_100g');
      if (v == null && servQ > 0) { const s = read(key, '_serving'); if (s != null) v = s / servQ * 100; }
      if (v != null && isFinite(v)) { n[k] = +(v * UNIT_FACTOR[NUT[k].unit]).toPrecision(5); break; }
    }
  }
  if (n.kcal == null) {
    const kj = read('energy-kj', '_100g') ?? read('energy', '_100g');
    if (kj != null) n.kcal = Math.round(kj / 4.184);
  }
  if (n.sodium == null && nm.salt_100g != null && nm.salt_100g !== '') n.sodium = Math.round(nm.salt_100g * 393.4);
  if (n.kcal == null && n.protein == null && n.carbs == null && n.fat == null) return null;
  const name = (p.product_name || p.product_name_en || p.generic_name || '').trim() || 'Product ' + p.code;
  const food = { id: 'o' + p.code, name, src: 'off', bc: String(p.code), n, p: [] };
  const brand = (p.brands || '').split(',')[0].trim();
  if (brand) food.brand = brand;
  if (servQ > 0) food.p.push([(p.serving_size || 'serving').trim().slice(0, 40), servQ]);
  return food;
}
// -> food | null (product unknown or without nutrition). Throws when offline.
export async function lookupBarcode(code) {
  const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${OFF_FIELDS}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('http ' + r.status);
  const j = await r.json();
  if (!j || j.status !== 1 || !j.product) return null;
  return offToFood({ code, ...j.product });
}
export async function searchProducts(q) {
  const url = 'https://world.openfoodfacts.org/cgi/search.pl?action=process&search_simple=1&json=1&page_size=24'
    + `&search_terms=${encodeURIComponent(q)}&fields=${OFF_FIELDS}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('http ' + r.status);
  const j = await r.json();
  return (j.products || []).map(offToFood).filter(Boolean);
}

// ---------- nutrition label reading (runs on the phone, nothing is uploaded) ----------
let workerP = null;
export async function readLabel(file, onProgress = () => {}) {
  onProgress(0.02, 'Preparing the photo');
  const canvas = await toCanvas(file, 1800);
  await loadScript('vendor/tesseract/tesseract.min.js');
  const logger = m => {
    if (m.status === 'recognizing text') onProgress(0.35 + m.progress * 0.65, 'Reading the label');
    else onProgress(0.05 + (m.progress || 0) * 0.3, 'Loading the label reader');
  };
  workerP ??= window.Tesseract.createWorker(['eng', 'jpn'], 1, {
    workerPath: abs('vendor/tesseract/worker.min.js'),
    corePath: abs('vendor/tesseract/'),
    langPath: abs('vendor/lang/'),
    workerBlobURL: false, gzip: true, logger,
  }).catch(e => { workerP = null; throw e; });
  const worker = await workerP;
  const { data } = await worker.recognize(canvas);
  onProgress(1, 'Done');
  return { text: data.text, ...parseLabel(data.text) };
}
async function toCanvas(file, max) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => createImageBitmap(file));
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return c;
}

const CJK = '\\u3040-\\u30ff\\u3400-\\u9fff';
// Most specific first: each match is blanked out so "fat" cannot re-match inside "saturated fat".
const LABEL_PATTERNS = [
  [null, 'includes[^\\n]{0,12}added sugars?|added sugars?|calories from fat'],
  ['satfat', 'saturated fat|saturates|sat\\.? ?fat|飽和脂肪酸|acides gras satures|satures'],
  [null, 'trans fat|トランス脂肪酸|acides gras trans'],
  ['monofat', 'monounsaturated(?: fat)?|mono-?unsaturates'],
  ['polyfat', 'polyunsaturated(?: fat)?|poly-?unsaturates'],
  ['chol', 'cholesterol|コレステロール'],
  ['fiber', 'dietary fib(?:er|re)|fibres alimentaires|fib(?:er|re)s?|食物繊維|食物せんい'],
  ['netcarb', '糖質'],
  ['sugar', 'total sugars?|of which sugars?|dont sucres|sugars?|sucres|糖類'],
  ['carbs', 'total carbohydrates?|total carb\\.?|carbohydrates?|炭水化物|glucides'],
  ['protein', 'proteins?|たんぱく質|たんばく質|タンパク質|たん白質|蛋白質'],
  ['fat', 'total fat|matieres grasses|lipides|脂質|fat'],
  ['salt', '食塩相当量|食塩|salt|\\bsel\\b'],
  ['sodium', 'sodium|ナトリウム'],
  ['potassium', 'potassium|カリウム'],
  ['calcium', 'calcium|カルシウム'],
  ['magnesium', 'magnesium|マグネシウム'],
  ['phosphorus', 'phosphorus|リン'],
  ['zinc', 'zinc|亜鉛'],
  ['iron', 'iron|\\bfer\\b|鉄'],
  ['vita', 'vitamin(?:e)? ?a\\b|ビタミンa'],
  ['b12', 'vitamin(?:e)? ?b12|ビタミンb12'],
  ['b6', 'vitamin(?:e)? ?b6|ビタミンb6'],
  ['b1', 'vitamin(?:e)? ?b1\\b|thiamine?|ビタミンb1'],
  ['b2', 'vitamin(?:e)? ?b2\\b|riboflavin|ビタミンb2'],
  ['b3', 'niacin|ナイアシン'],
  ['folate', 'folate|folic acid|葉酸'],
  ['vitc', 'vitamin(?:e)? ?c\\b|ビタミンc'],
  ['vitd', 'vitamin(?:e)? ?d\\b|ビタミンd'],
  ['vite', 'vitamin(?:e)? ?e\\b|ビタミンe'],
  ['vitk', 'vitamin(?:e)? ?k\\b|ビタミンk'],
];
const NUMBER = '[^\\d\\n]{0,16}?(\\d+(?:[.,]\\d+)?)\\s*(mg|mcg|µg|μg|ug|kcal|kj|g|%)?';
const toNum = s => parseFloat(s.replace(',', '.'));

export function cleanLabelText(text) {
  let t = text.normalize('NFKC').toLowerCase();
  t = t.normalize('NFD').replace(/[̀-̧́̂̈]/g, '').normalize('NFC'); // é -> e (keeps Japanese marks)
  t = t.replace(new RegExp(`(?<=[${CJK}])[ \\t]+(?=[${CJK}])`, 'g'), '');           // "エ ネ ル ギ ー" -> "エネルギー"
  t = t.replace(/(?<=\d)[ \t]*[.,][ \t]*(?=\d)/g, '.');                                 // "8 . 5" -> "8.5"
  t = t.replace(/(?<=\d)o(?=[\d.g])|(?<=[\d.])o\b/g, '0');                              // letter o read for zero
  t = t.replace(/(?<![a-z0-9])o(?=(?:mg|mcg|g)\b)/g, '0');                              // "Omg" -> "0mg"
  t = t.replace(/[|]/g, ' ');
  return t;
}

export function parseLabel(text) {
  let t = cleanLabelText(text);
  const found = {};

  // What the numbers refer to: 100 g, or one serving of a stated weight.
  let basis = { per: 'serving', grams: null };
  const m100 = /(?:per|pour|par)\s*100\s*(?:g|ml)|100\s*(?:g|ml)\s*(?:当た?り|あたり)/.exec(t);
  const mJp = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:g|ml)[^\\n${CJK}]{0,3}(?:当た?り|あたり)`).exec(t);
  const mUs = /serving size[^\n]*?(\d+(?:\.\d+)?)\s*(?:g|ml)\b/.exec(t) || /(?:per|par)\s*(?:serving|portion)?[^\n\d]{0,12}\(?(\d+(?:\.\d+)?)\s*(?:g|ml)\)?/.exec(t);
  const m9 = /serving size[^\n]*?\((\d+(?:\.\d+)?)9\)/.exec(t);                       // "(55g)" misread as "(559)"
  if (m100) basis = { per: '100g', grams: 100 };
  else if (mJp) basis = +mJp[1] === 100 ? { per: '100g', grams: 100 } : { per: 'serving', grams: +mJp[1] };
  else if (mUs) basis = +mUs[1] === 100 ? { per: '100g', grams: 100 } : { per: 'serving', grams: +mUs[1] };
  else if (m9) basis = { per: 'serving', grams: +m9[1] };

  // Energy: prefer a number written with kcal, then "Calories 230", then kJ.
  const kcal = /(\d+(?:\.\d+)?)\s*kcal/.exec(t);
  const cal = new RegExp(`(?:calories|energy|energie|エネルギー|熱量)${NUMBER}`).exec(t);
  const kj = /(\d+(?:\.\d+)?)\s*kj/.exec(t);
  if (kcal) found.kcal = toNum(kcal[1]);
  else if (cal && cal[2] !== 'kj') found.kcal = toNum(cal[1]);
  else if (kj) found.kcal = Math.round(toNum(kj[1]) / 4.184);
  t = t.replace(/calories|energy|energie|エネルギー|熱量/g, m => ' '.repeat(m.length));

  for (const [key, pat] of LABEL_PATTERNS) {
    const re = new RegExp(`(?:${pat})${key ? NUMBER : ''}`, 'g');
    let m, first = true;
    while ((m = re.exec(t))) {
      if (key && first && found[key] == null) {
        let v = toNum(m[1]);
        const unit = (m[2] || '').replace('mcg', 'µg').replace('μg', 'µg').replace('ug', 'µg');
        const want = key === 'salt' || key === 'netcarb' ? 'g' : NUT[key].unit;
        const f = { g: 1, mg: 1e-3, 'µg': 1e-6 };
        if (unit === '%') v = NUT[key]?.dv ? v * NUT[key].dv / 100 : null;
        else if (unit && f[unit] && unit !== want) v = v * f[unit] / f[want];
        if (v != null && isFinite(v)) found[key] = +v.toPrecision(6);
        first = false;
      }
      t = t.slice(0, m.index) + ' '.repeat(m[0].length) + t.slice(m.index + m[0].length);
    }
  }
  if (found.sodium == null && found.salt != null) found.sodium = Math.round(found.salt * 393.4);
  if (found.carbs == null && found.netcarb != null) found.carbs = +(found.netcarb + (found.fiber || 0)).toFixed(1);
  delete found.salt; delete found.netcarb;
  return { n: found, basis, count: Object.keys(found).length };
}

// Fuel economy, worked out "full tank to full tank": the litres put in after one full tank, up
// to and including the next full tank, divided by the km driven between them.
import { round1 } from './logic.js';

const round2 = (n) => Math.round(n * 100) / 100;

/** Petrol fills that can be used for economy (have litres and an odometer), oldest first. */
function fills(expenses) {
  return expenses
    .filter((e) => e.category === 'fuel' && e.litres && e.odometer !== null && e.odometer !== undefined)
    .sort((a, b) => a.odometer - b.odometer || (a.date < b.date ? -1 : 1));
}

/** One entry per full-to-full stretch: { date, km, litres, economy } (economy in L/100 km). */
export function fuelSegments(expenses) {
  const list = fills(expenses);
  const out = [];
  let lastFull = null;
  let litres = 0;
  for (const f of list) {
    if (lastFull) litres += f.litres;
    if (f.full_tank === false) continue;
    if (lastFull) {
      const km = round1(f.odometer - lastFull.odometer);
      if (km > 0) {
        const economy = round1((litres / km) * 100);
        out.push({ date: f.date, km, litres: round2(litres), economy, suspicious: economy < 2 || economy > 30 });
      }
    }
    lastFull = f;
    litres = 0;
  }
  return out;
}

/**
 * Fuel figures for a period. kmDriven is the km logged in the period (for cost per km);
 * carCosts is all car-related spending in the period (for running cost per km).
 */
export function fuelStats(expenses, start, end, { kmDriven = 0, carCosts = 0 } = {}) {
  const inRange = (d) => d >= start && d <= end;
  const fuel = expenses.filter((e) => e.category === 'fuel' && inRange(e.date));
  const withLitres = fuel.filter((e) => e.litres);
  const litres = round2(withLitres.reduce((a, e) => a + e.litres, 0));
  const spentWithLitres = withLitres.reduce((a, e) => a + e.amount, 0);
  const fuelSpent = round2(fuel.reduce((a, e) => a + e.amount, 0));

  const all = fuelSegments(expenses);
  const segs = all.filter((s) => inRange(s.date) && !s.suspicious);
  const segKm = segs.reduce((a, s) => a + s.km, 0);
  const economy = segKm ? round1((segs.reduce((a, s) => a + s.litres, 0) / segKm) * 100) : null;

  // Warnings look at the most recent stretch against the ones before it.
  const latest = all[all.length - 1] || null;
  const earlier = all.slice(0, -1).filter((s) => !s.suspicious);
  const usual = earlier.length >= 2
    ? round1((earlier.reduce((a, s) => a + s.litres, 0) / earlier.reduce((a, s) => a + s.km, 0)) * 100) : null;
  let warning = null;
  if (latest?.suspicious) warning = 'missed';
  else if (latest && usual && latest.economy > usual * 1.25) warning = 'high';

  return {
    litres,
    fuelSpent,
    pricePerLitre: litres ? round2(spentWithLitres / litres) : null,
    economy,
    fuelPerKm: kmDriven ? round2(fuelSpent / kmDriven) : null,
    runningPerKm: kmDriven ? round2(carCosts / kmDriven) : null,
    latest,
    usual,
    warning,
  };
}

export function fuelLines(f) {
  if (!f || (!f.litres && !f.fuelSpent)) return [];
  const money = (n) => `$${n.toFixed(2)}`;
  return [
    ['Fuel', ''],
    ['  Litres', f.litres ? `${f.litres} L` : '—'],
    ['  Average economy', f.economy ? `${f.economy} L/100 km` : 'needs two full-tank fills with odometer'],
    ['  Average price', f.pricePerLitre ? `${money(f.pricePerLitre)} per litre` : '—'],
    ['  Fuel cost per km', f.fuelPerKm !== null ? money(f.fuelPerKm) : '—'],
    ['  Running cost per km (all car costs)', f.runningPerKm !== null ? money(f.runningPerKm) : '—'],
  ];
}

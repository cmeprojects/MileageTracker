// Service, registration and insurance reminders, worked out from the car settings and the
// Service / Registration / Insurance expenses already logged.
export const DEFAULT_SERVICE = { km: 10000, months: 12 };
const SOON_KM = 500;
const SOON_DAYS = 30;

const addMonths = (date, months) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
};
const addYear = (date) => addMonths(date, 12);
const daysBetween = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
const latest = (expenses, category) => expenses.filter((e) => e.category === category).sort((a, b) => (a.date < b.date ? 1 : -1))[0] || null;

/** The next due date: the later of the date set in Car details and a year after the last payment. */
function renewal(setDate, lastExpense) {
  const candidates = [setDate, lastExpense ? addYear(lastExpense.date) : null].filter(Boolean).sort();
  return candidates.length ? candidates[candidates.length - 1] : null;
}

export function carReminders({ settings = {}, expenses, odometer, today }) {
  const out = [];
  const km = Number(settings.serviceKm) || DEFAULT_SERVICE.km;
  const months = Number(settings.serviceMonths) || DEFAULT_SERVICE.months;
  const lastService = latest(expenses, 'service');
  const service = lastService ? (() => {
    const dueDate = addMonths(lastService.date, months);
    const dueKm = lastService.odometer !== null && lastService.odometer !== undefined ? lastService.odometer + km : null;
    const kmLeft = dueKm !== null && odometer !== null ? Math.round(dueKm - odometer) : null;
    const daysLeft = daysBetween(today, dueDate);
    return { kind: 'service', dueDate, dueKm, kmLeft, daysLeft, lastDate: lastService.date, lastOdo: lastService.odometer };
  })() : null;
  if (service) {
    const overdue = (service.kmLeft !== null && service.kmLeft < 0) || service.daysLeft < 0;
    const soon = (service.kmLeft !== null && service.kmLeft <= SOON_KM) || service.daysLeft <= SOON_DAYS;
    out.push({ ...service, status: overdue ? 'overdue' : soon ? 'soon' : 'ok' });
  }
  for (const [kind, category, setKey] of [['rego', 'registration', 'regoDue'], ['insurance', 'insurance', 'insuranceDue']]) {
    const dueDate = renewal(settings[setKey], latest(expenses, category));
    if (!dueDate) continue;
    const daysLeft = daysBetween(today, dueDate);
    out.push({ kind, dueDate, daysLeft, status: daysLeft < 0 ? 'overdue' : daysLeft <= SOON_DAYS ? 'soon' : 'ok' });
  }
  return out;
}

/** Reminders worth showing now, most urgent first. */
export function dueReminders(list) {
  const rank = { overdue: 0, soon: 1 };
  return list.filter((r) => r.status !== 'ok').sort((a, b) => rank[a.status] - rank[b.status] || a.daysLeft - b.daysLeft);
}


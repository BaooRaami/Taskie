// Taskie - Helpers (DB + Notifications + Icons + Date Utilities + Recurrence + Label Formatting)

// ===== IndexedDB =====
const DB_NAME = 'TaskyDB';
const DB_VERSION = 2;
const STORE_NAME = 'tasks';
const REPEAT_STORE_NAME = 'repeatTasks';
let dbInstance = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) { resolve(dbInstance); return; }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { dbInstance = request.result; resolve(dbInstance); };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('dueDate', 'dueDate', { unique: false });
      }
      if (!db.objectStoreNames.contains(REPEAT_STORE_NAME)) {
        db.createObjectStore(REPEAT_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

function clean(obj) { return JSON.parse(JSON.stringify(obj)); }

function dbOp(storeName, mode, fn) {
  return async function (...args) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const req = fn(store, ...args);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };
}

const TaskDB = {
  getAll: dbOp(STORE_NAME, 'readonly', s => s.getAll()),
  add: dbOp(STORE_NAME, 'readwrite', (s, task) => s.add(clean(task))),
  update: dbOp(STORE_NAME, 'readwrite', (s, task) => s.put(clean(task))),
  delete: dbOp(STORE_NAME, 'readwrite', (s, id) => s.delete(id)),
  clearAll: dbOp(STORE_NAME, 'readwrite', s => s.clear())
};

window.dbHelper = {
  getRepeatTasks: dbOp(REPEAT_STORE_NAME, 'readonly', s => s.getAll()),
  async saveRepeatTasks(tasksList) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(REPEAT_STORE_NAME, 'readwrite');
      const store = tx.objectStore(REPEAT_STORE_NAME);
      store.clear().onsuccess = () => {
        tasksList.forEach(item => store.put(item));
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
};

// ===== Notification System =====
const GRACE_PERIOD = 2 * 60 * 60 * 1000;

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => { console.log('Notification permission:', permission); });
  }
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.08, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.start(start);
      osc.stop(start + 0.35);
    });
  } catch (e) { console.error('Audio play failed:', e); }
}

function showBrowserNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try { new Notification(title, { body, requireInteraction: true }); } catch (e) { console.error('Notification failed:', e); }
  }
}

async function processReminders(tasks) {
  // Reminders feature removed — no-op
}

// ===== Icons =====
function svg(d) {
  return `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="${d}"/></svg>`;
}

const icons = Object.fromEntries(Object.entries({

  dashboard: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm200-80v-240H200v240h200Zm80 0h280v-240H480v240ZM200-520h560v-240H200v240Z",
  tasks: "M348.5-291.5Q360-303 360-320t-11.5-28.5Q337-360 320-360t-28.5 11.5Q280-337 280-320t11.5 28.5Q303-280 320-280t28.5-11.5Zm0-160Q360-463 360-480t-11.5-28.5Q337-520 320-520t-28.5 11.5Q280-497 280-480t11.5 28.5Q303-440 320-440t28.5-11.5Zm0-160Q360-623 360-640t-11.5-28.5Q337-680 320-680t-28.5 11.5Q280-657 280-640t11.5 28.5Q303-600 320-600t28.5-11.5ZM440-280h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z",
  export: "M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z",
  import: "M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q17-72 85-137t145-65q33 0 56.5 23.5T520-716v242l64-62 56 56-160 160-160-160 56-56 64 62v-242q-76 14-118 73.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-48-22-89.5T600-680v-93q74 35 117 103.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm220-358Z",
  settings: "m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z",
  delete: "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z",
  repeat: "M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v240h-80v-80H200v400h280v80H200ZM760 0q-73 0-127.5-45.5T564-160h62q13 44 49.5 72T760-60q58 0 99-41t41-99q0-58-41-99t-99-41q-29 0-54 10.5T662-300h58v60H560v-160h60v57q27-26 63-41.5t77-15.5q83 0 141.5 58.5T960-200q0 83-58.5 141.5T760 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z",
  search: "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z",
  add: "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z",
  tick: "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z",
  palette: "M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-155.5t88-127Q256-817 328-848.5T480-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T872-508q0 100-59.5 156T650-296h-72q-11 0-15.5 7t-4.5 15q0 16 20 42t20 62q0 42-25 65t-93 23Zm-260-320q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm140-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm140 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q17 0 28.5-11.5T520-200q0-17-11.5-28.5T480-240q-17 0-28.5 11.5T440-200q0 17 11.5 28.5T480-160Z",
  keyboard: "M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h640v-400H160v400Zm120-40h400v-80H280v80ZM200-440h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM200-560h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Z",

}).map(([k, d]) => [k, svg(d)]));

// ===== Date & Time Utilities =====
function getTodayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function parseInputDate(str) {
  if (!str) return null;
  let [y, m, d] = str.split('-').map(Number);
  if (y > 9999) y = 9999;
  return new Date(y, m - 1, d).getTime();
}

function formatDateForInput(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fmtDate(ts, opts, withTime) {
  if (!ts) return '—';
  const d = new Date(ts);
  return withTime ? d.toLocaleString('en-US', opts) : d.toLocaleDateString('en-US', opts);
}

function formatDate(ts) { return fmtDate(ts, { month: 'short', day: 'numeric' }); }
function formatDateFull(ts) { return fmtDate(ts, { month: 'short', day: 'numeric', year: 'numeric' }); }
function formatDateTime(ts) { return fmtDate(ts, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }, true); }

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// ===== Recurrence Engine =====
function getCycleKey(repeatTask, date) {
  if (repeatTask.mode === 'days') {
    return date.getTime();
  } else if (repeatTask.mode === 'week') {
    return date.getFullYear() + '-' + getWeekNumber(date);
  } else {
    return date.getFullYear() + '-' + date.getMonth();
  }
}

function getNextOccurrence(form, afterTimestamp) {
  const after = new Date(afterTimestamp);
  after.setHours(0, 0, 0, 0);
  if (form.mode === 'days') {
    const interval = form.intervalDays || 1;
    const next = new Date(after);
    next.setDate(next.getDate() + interval);
    return next.getTime();
  }
  if (form.mode === 'week') {
    const days = form.selectedDays || [];
    if (days.length === 0) return null;
    for (let i = 1; i <= 14; i++) {
      const check = new Date(after);
      check.setDate(check.getDate() + i);
      if (days.includes(check.getDay())) {
        return check.getTime();
      }
    }
    return null;
  }
  if (form.mode === 'date') {
    const dates = form.selectedDates || [];
    if (dates.length === 0) return null;
    const sortedDates = [...dates].sort((a, b) => a - b);
    let year = after.getFullYear();
    let month = after.getMonth();
    for (let m = 0; m < 24; m++) {
      const checkMonth = month + m;
      const checkYear = year + Math.floor(checkMonth / 12);
      const checkMonthIdx = checkMonth % 12;
      for (const d of sortedDates) {
        const lastDayOfMonth = new Date(checkYear, checkMonthIdx + 1, 0).getDate();
        const useDate = d > lastDayOfMonth ? lastDayOfMonth : d;
        const candidate = new Date(checkYear, checkMonthIdx, useDate);
        candidate.setHours(0, 0, 0, 0);
        if (candidate.getTime() > after.getTime()) {
          return candidate.getTime();
        }
      }
    }
    return null;
  }
  return null;
}

function* occurrenceGenerator(form, opts = {}) {
  let last = new Date();
  last.setHours(0, 0, 0, 0);
  last.setDate(last.getDate() - 1);
  let cycleCount = 0;
  let lastCycleKey = null;
  const maxIterations = opts.maxIterations || 80;
  let results = 0;
  for (let i = 0; i < maxIterations; i++) {
    const next = getNextOccurrence(form, last.getTime());
    if (!next) break;
    if (form.endCondition === 'date' && form.endDate) {
      const end = new Date(form.endDate);
      end.setHours(0, 0, 0, 0);
      if (next > end.getTime()) break;
    }
    const d = new Date(next);
    const cycleKey = getCycleKey(form, d);
    if (cycleKey !== lastCycleKey) {
      cycleCount++;
      lastCycleKey = cycleKey;
    }
    if (form.endCondition === 'count' && cycleCount > form.endCount) break;
    yield next;
    results++;
    if (opts.maxResults && results >= opts.maxResults) break;
    last = new Date(next);
  }
}

function getRepeatInstances(repeatTask, count, includeCompleted = false) {
  const instances = [];
  const completed = repeatTask.completedDates || [];
  for (const next of occurrenceGenerator(repeatTask, { maxIterations: count * 4 })) {
    const d = new Date(next);
    const dateStr = formatDateForInput(d);
    if (!includeCompleted && completed.includes(dateStr)) continue;
    instances.push({
      id: 'repeat-' + repeatTask.id + '-' + next,
      title: repeatTask.title,
      hasDueDate: true,
      dueDate: next,
      status: 'not-started',
      createdAt: Date.now(),
      completedAt: null,
      repeatTaskId: repeatTask.id,
      repeatInstanceDate: dateStr,
      subtasks: [],
      reminders: []
    });
    if (instances.length >= count) break;
  }
  return instances;
}

function getRepeatInstanceWindow(repeatTask, uncompletedCount) {
  const instances = [];
  const completed = repeatTask.completedDates || [];
  let uncompletedFound = 0;
  for (const next of occurrenceGenerator(repeatTask, { maxIterations: uncompletedCount * 6 })) {
    const d = new Date(next);
    const dateStr = formatDateForInput(d);
    const isDone = completed.includes(dateStr);
    instances.push({
      id: 'repeat-' + repeatTask.id + '-' + next,
      title: repeatTask.title,
      hasDueDate: true,
      dueDate: next,
      status: isDone ? 'finished' : 'not-started',
      createdAt: Date.now(),
      completedAt: null,
      repeatTaskId: repeatTask.id,
      repeatInstanceDate: dateStr,
      subtasks: [],
      reminders: [],
      checked: isDone
    });
    if (!isDone) uncompletedFound++;
    if (uncompletedFound >= uncompletedCount) break;
  }
  return instances;
}

// ===== Display / Label Formatting =====
function formatFrequency(item) {
  if (item.mode === 'days') {
    return `Every ${item.intervalDays} day(s)`;
  } else if (item.mode === 'week') {
    if (!item.selectedDays || item.selectedDays.length === 0) return 'Weekly (No days)';
    const map = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 0: 'Sun' };
    const days = item.selectedDays.map(d => map[d]).join(', ');
    return `Weekly on ${days}`;
  } else if (item.mode === 'date') {
    if (!item.selectedDates || item.selectedDates.length === 0) return 'Monthly (No dates)';
    const dates = [...item.selectedDates].sort((a, b) => a - b).map(d => d === 31 ? '31 / Last' : d).join(', ');
    return `Monthly on ${dates}`;
  }
  return '-';
}

function formatEndDate(item) {
  if (item.endCondition === 'never') return 'Never';
  if (item.endCondition === 'count') return `After ${item.endCount} time(s)`;
  if (item.endCondition === 'date') return item.endDate ? formatDate(item.endDate) : 'No date set';
  return '-';
}

function taskHasSubtaskDueDates(task) {
  return task.subtasks && task.subtasks.some(s => s.dueDate);
}

function subtaskDueDateValue(st) {
  return st.dueDate ? formatDateForInput(new Date(st.dueDate)) : '';
}

function isOverdue(task) {
  if (taskHasSubtaskDueDates(task)) return false;
  if (!task.hasDueDate || !task.dueDate || task.status === 'finished') return false;
  return task.dueDate < Date.now();
}

function groupLabel(name) {
  const labels = { overdue: 'Overdue', today: 'Today', week: 'Due This Week', later: 'Later', noDate: 'No Due Date' };
  return labels[name] || name;
}

function isRepeatInstance(task) {
  return task && String(task.id).startsWith('repeat-');
}

function dueChipLabel(task) {
  if (taskHasSubtaskDueDates(task)) return 'Subtasks';
  if (!task.hasDueDate || !task.dueDate) return 'Not specified';
  return formatDate(task.dueDate);
}

function subtaskChipLabel(task) {
  if (!task.subtasks || task.subtasks.length === 0) return 'No Subtasks';
  const done = task.subtasks.filter(s => s.done).length;
  return `${done} / ${task.subtasks.length} Done`;
}

function instanceChipLabel(item) {
  const window = getRepeatInstanceWindow(item, 7);
  const totalCompleted = (item.completedDates || []).length;
  return `${totalCompleted} / ${window.length} Done`;
}

function statusLabel(status) {
  const labels = { 'not-started': 'Not Started', 'in-progress': 'In Progress', 'finished': 'Finished' };
  return labels[status] || status;
}

function subtaskProgress(task) {
  if (!task.subtasks || task.subtasks.length === 0) return null;
  const done = task.subtasks.filter(s => s.done).length;
  return `${done}/${task.subtasks.length}`;
}

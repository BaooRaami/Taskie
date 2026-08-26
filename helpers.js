// Tasky - Helpers (DB + Notifications + Recurrence)

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
  return async function(...args) {
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
        resolve();
      };
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
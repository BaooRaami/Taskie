// Taskie - Main Vue Application
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

}).map(([k, d]) => [k, svg(d)]));

const { createApp } = Vue;

createApp({
  data() {
    return {
      icons,
      page: 'dashboard',
      tasks: [],
      searchQuery: '',
      filterStatus: '',

      reminderInterval: null,
      editingCell: null,
      editValue: '',
      quickAddText: '',
      sortColumn: 'createdAt',
      sortDir: 'desc',
      dueEditingId: null,
      dueEditForm: null,
      createdEditingId: null,
      createdEditValue: '',
      subtaskEditingId: null,
      subtaskEditForm: [],
      newSubtaskText: '',
      editingSubtaskId: null,
      subtaskEditValue: '',
      subtaskJustSaved: false,
      newSubtaskDueDate: '',
      subtaskEditParentTask: null,
      customDateStart: '',
      customDateEnd: '',
      dashboardSections: [
        { key: 'overdue', title: 'Overdue', emptyMsg: 'No overdue tasks', showDate: true, dateClass: 'overdue-date' },
        { key: 'today', title: 'Today', emptyMsg: 'No tasks for today', showDate: true },
        { key: 'next7', title: 'Next 7 Days', emptyMsg: 'No tasks in next 7 days', showDate: true },
        { key: 'next30', title: 'Next 30 Days', emptyMsg: 'No tasks in next 30 days', showDate: true }
      ],
      highlightedTaskId: null,
      slidingTaskIds: {},
      toastMessage: '',
      toastVisible: false,
      toastTimer: null,
      showRepeatAddModal: false,
      repeatTitleError: false,
      showConfirmDialog: false,
      confirmMessage: '',
      confirmCallback: null,
      confirmBeforeDelete: true,
      hideEmptyLists: false,
      hideCustomList: false,
      trackInProgress: true,
      weekDaysList: [
        { label: 'Mon', val: 1 },
        { label: 'Tue', val: 2 },
        { label: 'Wed', val: 3 },
        { label: 'Thu', val: 4 },
        { label: 'Fri', val: 5 },
        { label: 'Sat', val: 6 },
        { label: 'Sun', val: 0 }
      ],
      repeatForm: {
        id: null,
        title: '',
        mode: 'days',
        intervalDays: 1,
        selectedDays: [],
        selectedDates: [],
        endCondition: 'never',
        endCount: 1,
        endDate: ''
      },
      repeatTasks: [],
      instanceEditingId: null,
      instanceForm: []
    };
  },

  computed: {
    filteredItems() {
      if (this.page === 'repeat-tasks') {
        let items = this.repeatTasks;
        if (this.searchQuery.trim()) {
          const q = this.searchQuery.toLowerCase();
          items = items.filter(t => t.title.toLowerCase().includes(q));
        }
        if (this.sortColumn) {
          const dir = this.sortDir === 'asc' ? 1 : -1;
          items = items.slice().sort((a, b) => {
            switch (this.sortColumn) {
              case 'title':
                return dir * a.title.localeCompare(b.title);
              case 'frequency':
                return dir * this.formatFrequency(a).localeCompare(this.formatFrequency(b));
              case 'endDate': {
                const aVal = a.endCondition === 'date' && a.endDate ? new Date(a.endDate).getTime() : (a.endCondition === 'count' ? a.endCount : Infinity);
                const bVal = b.endCondition === 'date' && b.endDate ? new Date(b.endDate).getTime() : (b.endCondition === 'count' ? b.endCount : Infinity);
                if (aVal === Infinity && bVal === Infinity) return 0;
                if (aVal === Infinity) return dir * 1;
                if (bVal === Infinity) return dir * -1;
                return dir * (aVal - bVal);
              }
              case 'createdAt': {
                const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dir * (aDate - bDate);
              }
            }
            return 0;
          });
        }
        return items;
      }
      let tasks = this.tasks;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        tasks = tasks.filter(t => t.title.toLowerCase().includes(q));
      }
      if (this.filterStatus) tasks = tasks.filter(t => t.status === this.filterStatus);
      if (this.sortColumn) {
        const dir = this.sortDir === 'asc' ? 1 : -1;
        tasks = tasks.slice().sort((a, b) => {
          switch (this.sortColumn) {
            case 'title':
              return dir * a.title.localeCompare(b.title);
            case 'status': {
              const order = { 'not-started': 0, 'in-progress': 1, 'finished': 2 };
              return dir * ((order[a.status] || 0) - (order[b.status] || 0));
            }
            case 'subtasks': {
              const aCount = a.subtasks ? a.subtasks.length : 0;
              const bCount = b.subtasks ? b.subtasks.length : 0;
              return dir * (aCount - bCount);
            }
            case 'dueDate': {
              if (!a.hasDueDate && !b.hasDueDate) return 0;
              if (!a.hasDueDate) return dir * 1;
              if (!b.hasDueDate) return dir * -1;
              return dir * ((a.dueDate || 0) - (b.dueDate || 0));
            }
            case 'createdAt': {
              return dir * ((a.createdAt || 0) - (b.createdAt || 0));
            }
          }
          return 0;
        });
      }
      return tasks;
    },

    dashboardGroups() {
      const todayStart = this.getTodayStart();
      const next7End = todayStart + (7 * 86400000);
      const next30End = todayStart + (30 * 86400000);
      let customStart = null, customEnd = null;
      if (this.customDateStart) {
        const [cy, cm, cd] = this.customDateStart.split('-').map(Number);
        customStart = new Date(cy, cm - 1, cd).getTime();
      }
      if (this.customDateEnd) {
        const [cy, cm, cd] = this.customDateEnd.split('-').map(Number);
        customEnd = new Date(cy, cm - 1, cd).getTime();
      }
      const groups = { overdue: [], today: [], next7: [], next30: [], custom: [] };
      const q = this.searchQuery.trim().toLowerCase();

      const classify = (item, dueTime) => {
        if (dueTime < todayStart) groups.overdue.push(item);
        else if (dueTime === todayStart) groups.today.push(item);
        else if (dueTime <= next7End) groups.next7.push(item);
        else if (dueTime <= next30End) groups.next30.push(item);
        if (customStart !== null && customEnd !== null && dueTime >= customStart && dueTime <= customEnd) groups.custom.push(item);
      };

      // Regular tasks (parent due dates)
      for (const task of this.tasks) {
        if (task.status === 'finished') continue;
        if (q && !task.title.toLowerCase().includes(q)) continue;
        if (!task.hasDueDate || !task.dueDate) continue;
        const due = new Date(task.dueDate);
        classify(task, new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime());
      }

      // Subtask virtual items
      for (const task of this.tasks) {
        if (task.status === 'finished') continue;
        if (!task.subtasks || !task.subtasks.length) continue;
        for (const st of task.subtasks) {
          if (st.done || !st.dueDate) continue;
          if (q && !st.text.toLowerCase().includes(q) && !task.title.toLowerCase().includes(q)) continue;
          const due = new Date(st.dueDate);
          classify({
            id: 'subtask-' + task.id + '-' + st.id,
            title: task.title + ' - ' + st.text,
            hasDueDate: true,
            dueDate: st.dueDate,
            status: 'not-started',
            createdAt: task.createdAt,
            completedAt: null,
            subtasks: [],
            parentTaskId: task.id,
            subtaskId: st.id
          }, new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime());
        }
      }

      // Virtual repeat task instances
      for (const repeatTask of this.repeatTasks) {
        if (q && !repeatTask.title.toLowerCase().includes(q)) continue;
        const completed = repeatTask.completedDates || [];
        const instances = this.getRepeatInstances(repeatTask, 7);
        for (const inst of instances) {
          const dateStr = this.formatDateForInput(new Date(inst.dueDate));
          if (completed.includes(dateStr)) continue;
          const dueStart = new Date(inst.dueDate);
          dueStart.setHours(0, 0, 0, 0);
          classify(inst, dueStart.getTime());
        }
      }

      for (const key of Object.keys(groups)) {
        groups[key].sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0));
      }

      return groups;
    },

    statusCounts() {
      const counts = { all: this.tasks.length, 'not-started': 0, 'in-progress': 0, 'finished': 0 };
      for (const t of this.tasks) if (counts[t.status] !== undefined) counts[t.status]++;
      return counts;
    },

    subtaskCounts() {
      let notStarted = 0, finished = 0;
      for (const t of this.tasks) {
        if (!t.subtasks) continue;
        for (const st of t.subtasks) {
          if (st.done) finished++;
          else notStarted++;
        }
      }
      for (const rt of this.repeatTasks) {
        const window = this.getRepeatInstanceWindow(rt, 7);
        const done = window.filter(inst => inst.checked).length;
        const pending = window.filter(inst => !inst.checked).length;
        finished += done;
        notStarted += pending;
      }
      return { all: notStarted + finished, 'not-started': notStarted, 'in-progress': 0, finished };
    },

    pageTitle() {
      if (this.page === 'repeat-tasks') return `Repeat Tasks: ${this.filteredItems.length}`;
      const labels = { '': 'All Tasks', 'not-started': 'Not Started Tasks', 'in-progress': 'In Progress Tasks', 'finished': 'Finished Tasks' };
      const label = labels[this.filterStatus] || 'All Tasks';
      return `${label}: ${this.filteredItems.length}`;
    },

    allDashboardEmpty() {
      const g = this.dashboardGroups;
      const lists = [g.overdue, g.today, g.next7, g.next30];
      if (!this.hideCustomList) lists.push(g.custom);
      return lists.every(arr => arr.length === 0);
    },

    previewDates() {
      const form = this.repeatForm;
      if (!form.mode) return [];
      const dates = [];
      for (const next of this.occurrenceGenerator(form, { maxIterations: 20, maxResults: 7 })) {
        dates.push(next);
      }
      return dates;
    }
  },

  methods: {
    getTodayStart() {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    },

    parseInputDate(str) {
      if (!str) return null;
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d).getTime();
    },

    getWeekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },

    getCycleKey(repeatTask, date) {
      if (repeatTask.mode === 'days') {
        return date.getTime();
      } else if (repeatTask.mode === 'week') {
        return date.getFullYear() + '-' + this.getWeekNumber(date);
      } else {
        return date.getFullYear() + '-' + date.getMonth();
      }
    },

    loadSettings() {
      const he = localStorage.getItem('taskyHideEmpty');
      const hc = localStorage.getItem('taskyHideCustom');
      const tip = localStorage.getItem('taskyTrackInProgress');
      const cbd = localStorage.getItem('taskyConfirmBeforeDelete');
      this.hideEmptyLists = he === 'true';
      this.hideCustomList = hc === 'true';
      this.trackInProgress = tip !== 'false';
      this.confirmBeforeDelete = cbd !== 'false';
    },

    saveSettings() {
      localStorage.setItem('taskyHideEmpty', this.hideEmptyLists);
      localStorage.setItem('taskyHideCustom', this.hideCustomList);
      localStorage.setItem('taskyTrackInProgress', this.trackInProgress);
      localStorage.setItem('taskyConfirmBeforeDelete', this.confirmBeforeDelete);
    },

    toggleSetting(key) { this[key] = !this[key]; this.saveSettings(); },

    loadCustomDates() {
      const savedStart = localStorage.getItem('taskyCustomDateStart');
      const savedEnd = localStorage.getItem('taskyCustomDateEnd');
      if (savedStart && savedEnd) {
        this.customDateStart = savedStart;
        this.customDateEnd = savedEnd;
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const future = new Date(today);
        future.setDate(future.getDate() + 30);
        this.customDateStart = this.formatDateForInput(today);
        this.customDateEnd = this.formatDateForInput(future);
        this.saveCustomDates();
      }
    },

    saveCustomDates() {
      localStorage.setItem('taskyCustomDateStart', this.customDateStart || '');
      localStorage.setItem('taskyCustomDateEnd', this.customDateEnd || '');
    },

    async loadTasks() {
      try { this.tasks = await TaskDB.getAll(); } catch (e) { console.error('Failed to load tasks:', e); }
    },

    // --- Quick Add ---
    async quickAdd() {
      const title = this.quickAddText.trim();
      if (!title) return;
      const task = { title, hasDueDate: false, dueDate: null, subtasks: [], status: 'not-started', createdAt: Date.now(), completedAt: null };
      await TaskDB.add(task);
      this.quickAddText = '';
      await this.loadTasks();
    },

    // --- Repeat Tasks ---
    focusRef(name) {
      this.$nextTick(() => {
        const el = this.$refs[name];
        if (el) el.focus();
      });
    },

    openRepeatAddModal() {
      this.repeatTitleError = false;
      this.repeatForm = {
        id: null,
        title: '',
        mode: 'days',
        intervalDays: 1,
        selectedDays: [],
        selectedDates: [],
        endCondition: 'never',
        endCount: 1,
        endDate: ''
      };
      this.showRepeatAddModal = true;
      this.focusRef('repeatTitleInput');
    },

    openRepeatEditModal(item) {
      this.repeatTitleError = false;
      this.repeatForm = JSON.parse(JSON.stringify(item));
      this.showRepeatAddModal = true;
      this.focusRef('repeatTitleInput');
    },

    closeRepeatAddModal() {
      this.showRepeatAddModal = false;
      this.repeatTitleError = false;
    },

    openConfirm(message, callback, type) {
      this.confirmMessage = message;
      this.confirmCallback = callback;
      this.confirmType = type || 'delete';
      this.showConfirmDialog = true;
    },

    closeConfirm(confirmed) {
      this.showConfirmDialog = false;
      if (confirmed && this.confirmCallback) this.confirmCallback();
      this.confirmCallback = null;
      this.confirmMessage = '';
      this.confirmType = 'delete';
    },

    toggleInArray(arr, val) {
      const idx = arr.indexOf(val);
      if (idx === -1) arr.push(val);
      else arr.splice(idx, 1);
    },

    saveRepeatTask() {
      if (!this.repeatForm.title.trim()) {
        this.repeatTitleError = true;
        this.focusRef('repeatTitleInput');
        return;
      }
      if (this.repeatForm.id) {
        const index = this.repeatTasks.findIndex(t => t.id === this.repeatForm.id);
        if (index !== -1) {
          const existing = this.repeatTasks[index];
          const updated = {
            ...JSON.parse(JSON.stringify(this.repeatForm)),
            completedDates: existing.completedDates || []
          };
          this.repeatTasks = this.repeatTasks.map((t, i) => i === index ? updated : t);
        }
      } else {
        const newTask = {
          ...JSON.parse(JSON.stringify(this.repeatForm)),
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
          completedDates: []
        };
        this.repeatTasks.push(newTask);
      }
      this.saveRepeatTasksToDB();
      this.closeRepeatAddModal();
    },

    deleteRepeatTask(item) {
      const doDelete = () => {
        this.repeatTasks = this.repeatTasks.filter(t => t.id !== item.id);
        this.saveRepeatTasksToDB();
      };
      if (this.confirmBeforeDelete) {
        this.openConfirm('Delete "' + item.title + '"?', doDelete);
      } else {
        doDelete();
      }
    },

    saveRepeatTasksToDB() {
      if (window.dbHelper && window.dbHelper.saveRepeatTasks) {
        window.dbHelper.saveRepeatTasks(JSON.parse(JSON.stringify(this.repeatTasks)));
      }
    },

    async loadRepeatTasksFromDB() {
      if (window.dbHelper && window.dbHelper.getRepeatTasks) {
        this.repeatTasks = await window.dbHelper.getRepeatTasks() || [];
      }
    },

    formatFrequency(item) {
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
    },

    formatEndDate(item) {
      if (item.endCondition === 'never') return 'Never';
      if (item.endCondition === 'count') return `After ${item.endCount} time(s)`;
      if (item.endCondition === 'date') return item.endDate ? this.formatDate(item.endDate) : 'No date set';
      return '-';
    },

    openInstanceEditor(item) {
      this.closeCreatedEditor();
      this.instanceEditingId = item.id;
      this.instanceForm = this.getRepeatInstanceWindow(item, 7);
    },

    closeInstanceEditor() {
      this.instanceEditingId = null;
      this.instanceForm = [];
    },

    async toggleInstance(inst) {
      const repeatTask = this.repeatTasks.find(r => r.id === inst.repeatTaskId);
      if (!repeatTask) return;
      if (!repeatTask.completedDates) repeatTask.completedDates = [];
      const idx = repeatTask.completedDates.indexOf(inst.repeatInstanceDate);
      if (idx === -1) {
        repeatTask.completedDates.push(inst.repeatInstanceDate);
      } else {
        repeatTask.completedDates.splice(idx, 1);
      }
      this.saveRepeatTasksToDB();
      const formIdx = this.instanceForm.findIndex(f => f.repeatInstanceDate === inst.repeatInstanceDate);
      if (formIdx !== -1) {
        this.instanceForm[formIdx].checked = idx === -1;
      }
    },

    instanceChipLabel(item) {
      const window = this.getRepeatInstanceWindow(item, 7);
      const done = window.filter(inst => inst.checked).length;
      return `${done} / ${window.length} Done`;
    },

    // --- Inline Edit ---

    getNextOccurrence(form, afterTimestamp) {
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
    },

    *occurrenceGenerator(form, opts = {}) {
      let last = new Date();
      last.setHours(0, 0, 0, 0);
      last.setDate(last.getDate() - 1);
      let cycleCount = 0;
      let lastCycleKey = null;
      const maxIterations = opts.maxIterations || 80;
      let results = 0;
      for (let i = 0; i < maxIterations; i++) {
        const next = this.getNextOccurrence(form, last.getTime());
        if (!next) break;
        if (form.endCondition === 'date' && form.endDate) {
          const end = new Date(form.endDate);
          end.setHours(0, 0, 0, 0);
          if (next > end.getTime()) break;
        }
        const d = new Date(next);
        const cycleKey = this.getCycleKey(form, d);
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
    },

    getRepeatInstances(repeatTask, count, includeCompleted = false) {
      const instances = [];
      const completed = repeatTask.completedDates || [];
      for (const next of this.occurrenceGenerator(repeatTask, { maxIterations: count * 4 })) {
        const d = new Date(next);
        const dateStr = this.formatDateForInput(d);
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
    },

    getRepeatInstanceWindow(repeatTask, uncompletedCount) {
      const instances = [];
      const completed = repeatTask.completedDates || [];
      let uncompletedFound = 0;
      for (const next of this.occurrenceGenerator(repeatTask, { maxIterations: uncompletedCount * 6 })) {
        const d = new Date(next);
        const dateStr = this.formatDateForInput(d);
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
    },

    // --- Inline Edit ---
    startEdit(task, field, event) {
      if (field === 'dueDate' && !task.hasDueDate) return;
      this.editingCell = { id: task.id, field };
      if (field === 'dueDate') {
        this.editValue = task.dueDate ? this.formatDateForInput(new Date(task.dueDate)) : '';
      } else {
        this.editValue = task[field] || '';
      }
      this.$nextTick(() => {
        const el = event ? event.target.closest('td').querySelector('input, select, textarea') : null;
        if (el) el.focus();
      });
    },

    async saveEdit(task, field) {
      if (field === 'dueDate') {
        if (this.editValue) {
          task.dueDate = this.parseInputDate(this.editValue);
          task.hasDueDate = true;
        } else {
          task.dueDate = null;
          task.hasDueDate = false;
        }
      } else {
        task[field] = this.editValue || null;
      }
      this.editingCell = null;
      this.editValue = '';
      await TaskDB.update(task);
      await this.loadTasks();
    },

    cancelEdit() {
      this.editingCell = null;
      this.editValue = '';
    },

    isEditing(id, field) {
      return this.editingCell && this.editingCell.id === id && this.editingCell.field === field;
    },

    toggleSort(column) {
      if (this.sortColumn === column) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDir = 'asc';
      }
    },

    sortClass(column) {
      if (this.sortColumn !== column) return '';
      return this.sortDir === 'asc' ? 'sort-asc' : 'sort-desc';
    },

    // --- Due Chip ---
    openDueEditor(task) {
      if (this.taskHasSubtaskDueDates(task)) return;
      this.subtaskEditingId = null;
      this.dueEditingId = task.id;
      const due = task.dueDate ? new Date(task.dueDate) : null;
      this.dueEditForm = {
        dueDate: due ? this.formatDateForInput(due) : ''
      };
    },

    async closeDueEditor() {
      if (this.dueEditForm) {
        const task = this.tasks.find(t => t.id === this.dueEditingId);
        if (task) await this.saveDueEdit(task);
      }
      this.dueEditingId = null;
      this.dueEditForm = null;
    },

    clearDueDate(task) {
      this.dueEditForm.dueDate = '';
    },

    openCreatedEditor(item) {
      this.closeSubtaskEditor();
      this.closeDueEditor();
      this.closeInstanceEditor();
      this.createdEditingId = item.id;
      this.createdEditValue = item.createdAt ? this.formatDateForInput(new Date(item.createdAt)) : '';
    },

    closeCreatedEditor() { this.createdEditingId = null; this.createdEditValue = ''; },

    async saveCreatedEdit(item) {
      if (this.createdEditValue) {
        item.createdAt = this.parseInputDate(this.createdEditValue);
      }
      this.closeCreatedEditor();
      if (this.page === 'repeat-tasks') {
        this.saveRepeatTasksToDB();
      } else {
        await TaskDB.update(item);
        await this.loadTasks();
      }
    },

    isCreatedEditing(id) { return this.createdEditingId === id; },

    async saveDueEdit(task) {
      if (this.taskHasSubtaskDueDates(task)) {
        task.dueDate = null;
        task.hasDueDate = false;
      } else if (this.dueEditForm.dueDate) {
        task.dueDate = this.parseInputDate(this.dueEditForm.dueDate);
        task.hasDueDate = true;
      } else {
        task.dueDate = null;
        task.hasDueDate = false;
      }
      await TaskDB.update(task);
      await this.loadTasks();
    },

    isDueEditing(id) { return this.dueEditingId === id; },

    dueChipLabel(task) {
      if (this.taskHasSubtaskDueDates(task)) return 'Subtasks';
      if (!task.hasDueDate || !task.dueDate) return 'Not specified';
      return this.formatDate(task.dueDate);
    },

    // --- Subtasks Chip ---
    openSubtaskEditor(task) {
      this.dueEditingId = null;
      this.subtaskEditingId = task.id;
      this.subtaskEditParentTask = task;
      this.subtaskEditForm = task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : [];
      this.newSubtaskText = '';
      this.newSubtaskDueDate = '';
    },

    closeSubtaskEditor() {
      this.subtaskEditingId = null;
      this.subtaskEditParentTask = null;
      this.subtaskEditForm = [];
      this.newSubtaskText = '';
      this.newSubtaskDueDate = '';
    },

    addSubtaskInline() {
      const text = this.newSubtaskText.trim();
      if (!text) return;

      this.subtaskEditForm.push({
        id: Date.now() + Math.random(),
        text: text,
        done: false,
        dueDate: this.newSubtaskDueDate ? this.parseInputDate(this.newSubtaskDueDate) : null
      });

      this.newSubtaskText = '';
      this.newSubtaskDueDate = '';
    },

    removeSubtaskInline(index) { this.subtaskEditForm.splice(index, 1); },

    confirmDeleteAllSubtasks(task) {
      const t = task || this.subtaskEditParentTask;
      if (!t) return;
      const doDelete = () => {
        this.subtaskEditForm = [];
      };
      if (this.confirmBeforeDelete) {
        this.openConfirm('Delete all subtasks for "' + t.title + '"?', doDelete);
      } else {
        doDelete();
      }
    },

    startSubtaskEdit(st) {
      if (this.editingSubtaskId && this.editingSubtaskId !== st.id) {
        this.saveSubtaskEditInline();
      }
      this.editingSubtaskId = st.id;
      this.subtaskEditValue = st.text;
      this.subtaskJustSaved = false;
      this.$nextTick(() => {
        const inputs = this.$refs.subtaskEditInput;
        const el = Array.isArray(inputs) ? inputs[0] : inputs;
        if (el) el.focus();
      });
    },

    saveSubtaskEditInline() {
      const st = this.subtaskEditForm.find(s => s.id === this.editingSubtaskId);
      if (st) {
        const text = this.subtaskEditValue.trim();
        if (text) st.text = text;
      }
      this.editingSubtaskId = null;
      this.subtaskEditValue = '';
    },

    cancelSubtaskEdit() {
      this.editingSubtaskId = null;
      this.subtaskEditValue = '';
    },

    async saveSubtaskEdit(task) {
      const t = task || this.subtaskEditParentTask;
      if (!t) return;
      t.subtasks = this.subtaskEditForm;
      const allDone = t.subtasks.every(s => s.done);
      if (allDone && t.status !== 'finished') {
        t.status = 'finished';
        t.completedAt = Date.now();
      } else if (!allDone) {
        const anyDone = t.subtasks.some(s => s.done);
        if (t.status === 'finished') {
          t.status = anyDone ? 'in-progress' : 'not-started';
          t.completedAt = null;
        } else {
          if (anyDone && t.status === 'not-started') t.status = 'in-progress';
        }
      }
      this.closeSubtaskEditor();
      await TaskDB.update(t);
      await this.loadTasks();
    },

    isSubtaskEditing(id) { return this.subtaskEditingId === id; },

    subtaskChipLabel(task) {
      if (!task.subtasks || task.subtasks.length === 0) return 'No Subtasks';
      const done = task.subtasks.filter(s => s.done).length;
      return `${done} / ${task.subtasks.length} Done`;
    },

    async deleteTask(task) {
      const doDelete = async () => {
        await TaskDB.delete(task.id);
        await this.loadTasks();
      };
      if (this.confirmBeforeDelete) {
        this.openConfirm('Delete "' + task.title + '"?', doDelete);
      } else {
        await doDelete();
      }
    },

    scrollAndHighlight(refName, id) {
      this.highlightedTaskId = id;
      this.$nextTick(() => {
        const rows = this.$refs[refName];
        const row = Array.isArray(rows) ? rows.find(r => r && r.dataset && r.dataset.taskId === String(id)) : null;
        if (row) {
          row.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => { this.highlightedTaskId = null; }, 2000);
        }
      });
    },

    isRepeatInstance(task) {
      return task && String(task.id).startsWith('repeat-');
    },

    goToTask(task) {
      this.filterStatus = '';
      this.searchQuery = '';
      if (this.isRepeatInstance(task)) {
        this.page = 'repeat-tasks';
        this.scrollAndHighlight('repeatRows', task.repeatTaskId);
      } else if (String(task.id).startsWith('subtask-')) {
        this.page = 'tasks';
        this.scrollAndHighlight('taskRows', task.parentTaskId);
      } else {
        this.page = 'tasks';
        this.scrollAndHighlight('taskRows', task.id);
      }
    },

    async toggleSubtask(task, subtaskId) {
      const st = task.subtasks.find(s => s.id === subtaskId);
      if (!st) return;
      st.done = !st.done;
      const allDone = task.subtasks.every(s => s.done);
      if (allDone && task.status !== 'finished') {
        task.status = 'finished';
        task.completedAt = Date.now();
      } else if (!allDone) {
        const anyDone = task.subtasks.some(s => s.done);
        if (anyDone && task.status === 'not-started') task.status = 'in-progress';
        if (!anyDone && task.status === 'finished') {
          task.status = 'not-started';
          task.completedAt = null;
        }
      }
      await TaskDB.update(task);
      await this.loadTasks();
    },

    async changeStatus(task, newStatus) {
      if (!this.trackInProgress) {
        newStatus = task.status === 'finished' ? 'not-started' : 'finished';
      }
      if (newStatus === 'finished' && task.status !== 'finished') {
        task.completedAt = Date.now();
      } else if (newStatus !== 'finished' && task.status === 'finished') { task.completedAt = null; }
      task.status = newStatus;
      await TaskDB.update(task);
      await this.loadTasks();
    },

    async quickFinish(task) {
      if (this.slidingTaskIds[task.id]) return;
      if (String(task.id).startsWith('subtask-')) {
        const parent = this.tasks.find(t => t.id === task.parentTaskId);
        if (!parent) return;
        const st = parent.subtasks.find(s => s.id === task.subtaskId);
        if (!st) return;
        this.slidingTaskIds[task.id] = true;
        setTimeout(async () => {
          st.done = true;
          const allDone = parent.subtasks.every(s => s.done);
          if (allDone && parent.status !== 'finished') {
            parent.status = 'finished';
            parent.completedAt = Date.now();
          }
          await TaskDB.update(parent);
          await this.loadTasks();
          delete this.slidingTaskIds[task.id];
        }, 400);
        return;
      }
      if (String(task.id).startsWith('repeat-')) {
        const repeatTask = this.repeatTasks.find(r => r.id === task.repeatTaskId);
        if (!repeatTask) return;
        this.slidingTaskIds[task.id] = true;
        setTimeout(() => {
          if (!repeatTask.completedDates) repeatTask.completedDates = [];
          if (!repeatTask.completedDates.includes(task.repeatInstanceDate)) {
            repeatTask.completedDates.push(task.repeatInstanceDate);
          }
          this.saveRepeatTasksToDB();
          delete this.slidingTaskIds[task.id];
        }, 400);
        return;
      }
      this.slidingTaskIds[task.id] = true;
      setTimeout(async () => {
        await this.changeStatus(task, 'finished');
        delete this.slidingTaskIds[task.id];
      }, 400);
    },

    formatDate(ts) { return this.fmtDate(ts, { month: 'short', day: 'numeric' }); },
    formatDateFull(ts) { return this.fmtDate(ts, { month: 'short', day: 'numeric', year: 'numeric' }); },
    formatDateTime(ts) { return this.fmtDate(ts, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }, true); },
    fmtDate(ts, opts, withTime) { if (!ts) return '—'; const d = new Date(ts); return withTime ? d.toLocaleString('en-US', opts) : d.toLocaleDateString('en-US', opts); },

    isOverdue(task) { if (this.taskHasSubtaskDueDates(task)) return false; if (!task.hasDueDate || !task.dueDate || task.status === 'finished') return false; return task.dueDate < Date.now(); },
    groupLabel(name) { const labels = { overdue: 'Overdue', today: 'Today', week: 'Due This Week', later: 'Later', noDate: 'No Due Date' }; return labels[name] || name; },
    statusLabel(status) { const labels = { 'not-started': 'Not Started', 'in-progress': 'In Progress', 'finished': 'Finished' }; return labels[status] || status; },

    subtaskProgress(task) { if (!task.subtasks || task.subtasks.length === 0) return null; const done = task.subtasks.filter(s => s.done).length; return `${done}/${task.subtasks.length}`; },

    exportJSON() {
      const data = { app: 'Taskie', version: 1, exportedAt: new Date().toISOString(), tasks: this.tasks.map(t => { const { reminders, ...rest } = t; return rest; }), repeatTasks: this.repeatTasks };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Taskie-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    async importJSON(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.app !== 'Taskie') { alert('Invalid backup file'); event.target.value = ''; return; }
          const doImport = async () => {
            try {
              await TaskDB.clearAll();
              for (const task of data.tasks) { delete task.id; delete task.reminders; await TaskDB.add(task); }
              if (data.repeatTasks) {
                this.repeatTasks = data.repeatTasks.map(rt => ({
                  ...rt,
                  completedDates: rt.completedDates || []
                }));
                this.saveRepeatTasksToDB();
              }
              await this.loadTasks();
              this.page = 'dashboard';
            } catch (err) { alert('Import failed: ' + err.message); }
            event.target.value = '';
          };
          if (this.confirmBeforeDelete) {
            this.openConfirm('This will replace all current tasks. Continue?', doImport, 'import');
          } else {
            await doImport();
          }
        } catch (err) { alert('Import failed: ' + err.message); event.target.value = ''; }
      };
      reader.readAsText(file);
    },

    // testSound() { playChime(); },

    openSettings() { this.page = 'settings'; },
    closeSettings() { this.page = 'dashboard'; },
    closeAllEditors() {
      this.closeSubtaskEditor();
      this.closeDueEditor();
      this.closeCreatedEditor();
      this.closeInstanceEditor();
      this.closeRepeatAddModal();
      this.closeConfirm(false);
    },

    formatDateForInput(date) { const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; },

    taskHasSubtaskDueDates(task) {
      return task.subtasks && task.subtasks.some(s => s.dueDate);
    },

    subtaskDueDateValue(st) {
      return st.dueDate ? this.formatDateForInput(new Date(st.dueDate)) : '';
    },

    updateSubtaskDueDate(st, val) {
      st.dueDate = val ? this.parseInputDate(val) : null;
    },

    focusQuickAdd() {
      if (this.page !== 'tasks') this.page = 'tasks';
      this.$nextTick(() => {
        const el = this.$refs.quickAddInput;
        if (el) el.focus();
      });
    },

    focusRepeatQuickAdd() {
      if (this.page !== 'repeat-tasks') this.page = 'repeat-tasks';
      this.$nextTick(() => {
        this.openRepeatAddModal();
      });
    },

    clearQuickAdd() {
      this.quickAddText = '';
      const el = this.$refs.quickAddInput;
      if (el) el.blur();
    },

    showToast(message) {
      this.toastMessage = message;
      this.toastVisible = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toastVisible = false; }, 2000);
    },

    focusSearch() {
      if (this.page !== 'tasks' && this.page !== 'repeat-tasks') this.page = 'tasks';
      this.$nextTick(() => {
        const el = this.$refs.searchInput;
        if (el) el.focus();
      });
    },

    clearSearch() {
      this.searchQuery = '';
      const el = this.$refs.searchInput;
      if (el) el.blur();
    }
  },

  mounted() {
    this.loadTasks();
    this.loadRepeatTasksFromDB();
    this.loadSettings();
    this.loadCustomDates();
    this._clickOutsideHandler = (e) => {
      if (e.target.closest('.chip-popover') || e.target.closest('.chip')) return;
      this.closeSubtaskEditor();
      this.closeDueEditor();
      this.closeCreatedEditor();
      this.closeInstanceEditor();
      this.editingRepeatCreatedId = null;
    };
    document.addEventListener('click', this._clickOutsideHandler);
    this._keydownHandler = (e) => {
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        this.page = 'dashboard';
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        this.focusQuickAdd();
      }
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        this.focusRepeatQuickAdd();
      }
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        this.focusSearch();
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.showToast('Already Saved');
      }
      if (e.key === 'Escape') {
        if (document.activeElement === this.$refs.searchInput) {
          this.clearSearch();
          return;
        }
        this.closeAllEditors();
      }
    };
    document.addEventListener('keydown', this._keydownHandler);
  },
  beforeUnmount() {
    if (this.reminderInterval) clearInterval(this.reminderInterval);
    if (this._clickOutsideHandler) document.removeEventListener('click', this._clickOutsideHandler);
    if (this._keydownHandler) document.removeEventListener('keydown', this._keydownHandler);
  }
}).mount('#app');

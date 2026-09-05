// Taskie - Main Vue Application
// Icons, date formatting, and recurrence math now live in helpers.js.
// This file only holds the Vue component: state, computed values, and methods that touch that state.

const { createApp } = Vue;

const app = createApp({
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
      moveFinishedToEnd: false,
      currentTheme: 'dark',
      themes: [
        { key: 'dark', name: 'Dark' },
        { key: 'light', name: 'Light' },
        { key: 'ocean', name: 'Ocean' },
        { key: 'forest', name: 'Forest' },
        { key: 'sunset', name: 'Sunset' }
      ],
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
                return dir * formatFrequency(a).localeCompare(formatFrequency(b));
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
        tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.subtasks && t.subtasks.some(st => st.text.toLowerCase().includes(q))));
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
      if (this.moveFinishedToEnd) {
        const unfinished = tasks.filter(t => t.status !== 'finished');
        const finished = tasks.filter(t => t.status === 'finished');
        tasks = unfinished.concat(finished);
      }
      return tasks;
    },

    dashboardGroups() {
      const todayStart = getTodayStart();
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
        const instances = getRepeatInstances(repeatTask, 7);
        for (const inst of instances) {
          const dateStr = formatDateForInput(new Date(inst.dueDate));
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
        const window = getRepeatInstanceWindow(rt, 7);
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
      for (const next of occurrenceGenerator(form, { maxIterations: 20, maxResults: 7 })) {
        dates.push(next);
      }
      return dates;
    }
  },

  methods: {
    // ===== Settings & Local Storage =====
    loadSettings() {
      const he = localStorage.getItem('taskyHideEmpty');
      const hc = localStorage.getItem('taskyHideCustom');
      const tip = localStorage.getItem('taskyTrackInProgress');
      const cbd = localStorage.getItem('taskyConfirmBeforeDelete');
      const theme = localStorage.getItem('taskyTheme');
      this.hideEmptyLists = he === 'true';
      this.hideCustomList = hc === 'true';
      this.trackInProgress = tip !== 'false';
      this.confirmBeforeDelete = cbd !== 'false';
      this.moveFinishedToEnd = localStorage.getItem('taskyMoveFinishedToEnd') === 'true';
      this.currentTheme = theme || 'dark';
      document.documentElement.setAttribute('data-theme', this.currentTheme);
    },

    saveSettings() {
      localStorage.setItem('taskyHideEmpty', this.hideEmptyLists);
      localStorage.setItem('taskyHideCustom', this.hideCustomList);
      localStorage.setItem('taskyTrackInProgress', this.trackInProgress);
      localStorage.setItem('taskyConfirmBeforeDelete', this.confirmBeforeDelete);
      localStorage.setItem('taskyMoveFinishedToEnd', this.moveFinishedToEnd);
      localStorage.setItem('taskyTheme', this.currentTheme);
    },

    toggleSetting(key) { this[key] = !this[key]; this.saveSettings(); },

    setTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      this.saveSettings();
    },

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
        this.customDateStart = formatDateForInput(today);
        this.customDateEnd = formatDateForInput(future);
        this.saveCustomDates();
      }
    },

    saveCustomDates() {
      localStorage.setItem('taskyCustomDateStart', this.customDateStart || '');
      localStorage.setItem('taskyCustomDateEnd', this.customDateEnd || '');
    },

    // ===== Task Loading =====
    async loadTasks() {
      try { this.tasks = await TaskDB.getAll(); } catch (e) { console.error('Failed to load tasks:', e); }
    },

    // ===== Quick Add =====
    async quickAdd() {
      const title = this.quickAddText.trim();
      if (!title) return;
      const task = { title, hasDueDate: false, dueDate: null, subtasks: [], status: 'not-started', createdAt: Date.now(), completedAt: null };
      await TaskDB.add(task);
      this.quickAddText = '';
      await this.loadTasks();
    },

    focusRef(name) {
      this.$nextTick(() => {
        const el = this.$refs[name];
        if (el) el.focus();
      });
    },

    // ===== Repeat Tasks - CRUD =====
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

    // ===== Repeat Task Instances =====
    openInstanceEditor(item) {
      this.closeCreatedEditor();
      this.instanceEditingId = item.id;
      const window = getRepeatInstanceWindow(item, 7);
      const completed = item.completedDates || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      for (const dateStr of completed) {
        if (window.some(w => w.repeatInstanceDate === dateStr)) continue;
        const [y, m, d] = dateStr.split('-').map(Number);
        const dueTime = new Date(y, m - 1, d).getTime();
        if (dueTime >= thirtyDaysAgo.getTime()) {
          window.push({
            id: 'repeat-' + item.id + '-' + dueTime,
            title: item.title,
            hasDueDate: true,
            dueDate: dueTime,
            status: 'finished',
            createdAt: Date.now(),
            completedAt: null,
            repeatTaskId: item.id,
            repeatInstanceDate: dateStr,
            subtasks: [],
            reminders: [],
            checked: true
          });
        }
      }
      window.sort((a, b) => a.dueDate - b.dueDate);
      this.instanceForm = window;
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

    // ===== Confirm Dialog =====
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

    // ===== Inline Edit - Table Cells =====
    startEdit(task, field, event) {
      if (field === 'dueDate' && !task.hasDueDate) return;
      this.editingCell = { id: task.id, field };
      if (field === 'dueDate') {
        this.editValue = task.dueDate ? formatDateForInput(new Date(task.dueDate)) : '';
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
          task.dueDate = parseInputDate(this.editValue);
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

    // ===== Due Date Chip =====
    openDueEditor(task) {
      if (taskHasSubtaskDueDates(task)) return;
      this.subtaskEditingId = null;
      this.dueEditingId = task.id;
      const due = task.dueDate ? new Date(task.dueDate) : null;
      this.dueEditForm = {
        dueDate: due ? formatDateForInput(due) : ''
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

    async saveDueEdit(task) {
      if (taskHasSubtaskDueDates(task)) {
        task.dueDate = null;
        task.hasDueDate = false;
      } else if (this.dueEditForm.dueDate) {
        task.dueDate = parseInputDate(this.dueEditForm.dueDate);
        task.hasDueDate = true;
      } else {
        task.dueDate = null;
        task.hasDueDate = false;
      }
      await TaskDB.update(task);
      await this.loadTasks();
    },

    isDueEditing(id) { return this.dueEditingId === id; },

    // ===== Created Date Editor =====
    openCreatedEditor(item) {
      this.closeSubtaskEditor();
      this.closeDueEditor();
      this.closeInstanceEditor();
      this.createdEditingId = item.id;
      this.createdEditValue = item.createdAt ? formatDateForInput(new Date(item.createdAt)) : '';
    },

    closeCreatedEditor() { this.createdEditingId = null; this.createdEditValue = ''; },

    async saveCreatedEdit(item) {
      if (this.createdEditValue) {
        item.createdAt = parseInputDate(this.createdEditValue);
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

    // ===== Subtasks Editor =====
    openSubtaskEditor(task) {
      this.dueEditingId = null;
      this.subtaskEditingId = task.id;
      this.subtaskEditParentTask = task;
      this.subtaskEditForm = task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : [];
      for (const st of this.subtaskEditForm) {
        st.dueDateInput = st.dueDate ? formatDateForInput(new Date(st.dueDate)) : '';
      }
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
      this.$nextTick(() => {
        this.subtaskEditForm.push({
          id: Date.now() + Math.random(),
          text: text,
          done: false,
          dueDate: this.newSubtaskDueDate ? parseInputDate(this.newSubtaskDueDate) : null
        });
        this.newSubtaskText = '';
        this.newSubtaskDueDate = '';
      });
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

    updateSubtaskDueDate(st, val) {
      st.dueDate = val ? parseInputDate(val) : null;
      st.dueDateInput = val || '';
    },

    // ===== Task Actions =====
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

    goToTask(task) {
      this.filterStatus = '';
      this.searchQuery = '';
      if (isRepeatInstance(task)) {
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

    // ===== Import / Export =====
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

    // ===== Navigation & UI State =====
    openSettings() { this.page = 'settings'; },
    closeSettings() { this.page = 'dashboard'; },

    navigateTo(page) {
      this.searchQuery = '';
      this.page = page;
    },
    closeAllEditors() {
      this.closeSubtaskEditor();
      this.closeDueEditor();
      this.closeCreatedEditor();
      this.closeInstanceEditor();
      this.closeRepeatAddModal();
      this.closeConfirm(false);
    },

    focusQuickAdd() {
      this.searchQuery = '';
      if (this.page !== 'tasks') this.navigateTo('tasks');
      this.$nextTick(() => {
        const el = this.$refs.quickAddInput;
        if (el) el.focus();
      });
    },

    focusRepeatQuickAdd() {
      this.searchQuery = '';
      if (this.page !== 'repeat-tasks') this.navigateTo('repeat-tasks');
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
        this.navigateTo('dashboard');
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
});

// Expose helper functions used directly in the HTML template (Vue doesn't
// fall back to plain global scope for bare identifiers in templates).
app.config.globalProperties.formatDate = formatDate;
app.config.globalProperties.formatDateFull = formatDateFull;
app.config.globalProperties.isOverdue = isOverdue;
app.config.globalProperties.statusLabel = statusLabel;
app.config.globalProperties.taskHasSubtaskDueDates = taskHasSubtaskDueDates;
app.config.globalProperties.subtaskDueDateValue = subtaskDueDateValue;
app.config.globalProperties.isRepeatInstance = isRepeatInstance;
app.config.globalProperties.dueChipLabel = dueChipLabel;
app.config.globalProperties.subtaskChipLabel = subtaskChipLabel;
app.config.globalProperties.instanceChipLabel = instanceChipLabel;
app.config.globalProperties.formatFrequency = formatFrequency;
app.config.globalProperties.formatEndDate = formatEndDate;

app.mount('#app');

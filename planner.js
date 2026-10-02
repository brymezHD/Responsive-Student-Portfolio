// Academic planner: tasks live in an array; render() rebuilds the list from it.
(() => {
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const due = document.getElementById('task-due');
  const error = document.getElementById('task-error');
  const list = document.getElementById('task-list');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('task-count');
  const KEY = 'portfolio-tasks';

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch { /* storage unavailable */ } }

  let tasks = load(); // each task: { id, text, due, done }
  let nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;

  function showError(message) {
    error.textContent = message;
    error.hidden = !message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function addTask(text, dueDate) { tasks.push({ id: nextId++, text, due: dueDate, done: false }); }

  // Rebuild the list from the array (textContent keeps user input safe).
  function render() {
    list.replaceChildren();
    tasks.forEach((t) => {
      const li = document.createElement('li');
      li.className = t.done ? 'done' : '';
      const box = document.createElement('input');
      box.type = 'checkbox'; box.id = 'task-' + t.id; box.checked = t.done; box.dataset.id = t.id;
      const label = document.createElement('label');
      label.htmlFor = box.id; label.textContent = t.text;
      li.append(box, label);
      if (t.due) {
        const d = document.createElement('span');
        d.className = 'due';
        d.textContent = 'Due ' + new Date(t.due + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
        li.append(d);
      }
      const del = document.createElement('button');
      del.type = 'button'; del.className = 'del'; del.dataset.id = t.id; del.textContent = 'Delete';
      del.setAttribute('aria-label', 'Delete task: ' + t.text);
      li.append(del);
      list.append(li);
    });
    const left = tasks.filter((t) => !t.done).length;
    empty.hidden = tasks.length > 0; // empty-state message
    count.textContent = tasks.length ? `${left} of ${tasks.length} tasks still to do` : '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { showError('Enter a task before adding it.'); input.focus(); return; }
    if (tasks.some((t) => t.text.toLowerCase() === text.toLowerCase())) {
      showError('That task is already on your list.'); input.focus(); return;
    }
    showError('');
    addTask(text, due.value);
    save(); render(); form.reset(); input.focus();
  });

  // Mark complete / incomplete (event delegation on the list)
  list.addEventListener('change', (e) => {
    const t = tasks.find((x) => x.id === Number(e.target.dataset.id));
    if (!t) return;
    t.done = e.target.checked;
    save(); render();
    document.getElementById('task-' + t.id).focus(); // keep keyboard focus after re-render
  });

  // Delete
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.del');
    if (!btn) return;
    tasks = tasks.filter((x) => x.id !== Number(btn.dataset.id));
    save(); render(); input.focus();
  });

  input.addEventListener('input', () => showError(''));
  render();
})();

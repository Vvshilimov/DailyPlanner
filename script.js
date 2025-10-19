const form = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('desc');
const titleError = document.getElementById('titleError');
const tasksGrid = document.getElementById('tasksGrid');
const emptyState = document.getElementById('emptyState');

const generateId = (() => {
  let id = Date.now();
  return () => (++id).toString(36);
})();

function updateEmptyState() {
  const has = tasksGrid.children.length > 0;
  tasksGrid.style.display = has ? 'grid' : 'none';
  emptyState.style.display = has ? 'none' : 'block';
}

function createTaskCard({id, title, desc, createdAt}) {
  const card = document.createElement('article');
  card.className = 'task-card';
  card.dataset.id = id;

  const head = document.createElement('div');
  head.className = 'task-head';

  const titleEl = document.createElement('h3');
  titleEl.className = 'task-title';
  titleEl.textContent = title;

  const metaWrap = document.createElement('div');
  metaWrap.className = 'task-meta';

  const time = document.createElement('div');
  time.className = 'badge';
  time.textContent = new Date(createdAt).toLocaleString();
  metaWrap.appendChild(time);

  head.appendChild(titleEl);
  head.appendChild(metaWrap);
  card.appendChild(head);

  if (desc && desc.trim() !== '') {
    const descEl = document.createElement('p');
    descEl.className = 'task-desc';
    descEl.textContent = desc;
    card.appendChild(descEl);
  }

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'btn-delete';
  delBtn.textContent = 'Удалить';
  actions.appendChild(delBtn);

  card.appendChild(actions);
  return card;
}

function addTaskToUI(title, desc) {
  const task = {
    id: generateId(),
    title: title.trim(),
    desc: desc ? desc.trim() : '',
    createdAt: Date.now()
  };
  const card = createTaskCard(task);
  tasksGrid.insertAdjacentElement('afterbegin', card);
  updateEmptyState();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  titleError.style.display = 'none';
  const title = titleInput.value;
  const desc = descInput.value;

  if (!title || title.trim() === '') {
    titleError.style.display = 'block';
    titleInput.focus();
    return;
  }

  addTaskToUI(title, desc);
  form.reset();
  titleInput.focus();
});

titleInput.addEventListener('input', () => {
  if (titleInput.value.trim() !== '') titleError.style.display = 'none';
});

tasksGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-delete');
  if (!btn) return;
  const card = btn.closest('.task-card');
  card.remove();
  updateEmptyState();
});

updateEmptyState();

form.addEventListener('keydown', (e) => {
  if ((e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('addBtn').click();
  }
});

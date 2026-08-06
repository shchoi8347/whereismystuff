const EMOJIS = {
  default: '📦',
  tree: '🎄', xmas: '🎄', christmas: '🎄',
  light: '💡', lights: '💡',
  tool: '🔧', screwdriver: '🔧', wrench: '🔧', hammer: '🔨',
  book: '📚', books: '📚',
  key: '🔑', keys: '🔑',
  phone: '📱', charger: '🔌',
  shoes: '👟', jacket: '🧥', coat: '🧥',
  passport: '🛂', document: '📄', documents: '📄',
  cable: '🔌', cables: '🔌',
  camera: '📷', glasses: '👓',
  bike: '🚲', box: '📦', bag: '👜',
  cup: '☕', mug: '☕',
};

function getEmoji(thing) {
  const lower = thing.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return EMOJIS.default;
}

function loadItems() {
  return JSON.parse(localStorage.getItem('stuff') || '[]');
}

function saveItems(items) {
  localStorage.setItem('stuff', JSON.stringify(items));
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function render(filter = '') {
  const items = loadItems();
  const listEl = document.getElementById('list');
  const statsEl = document.getElementById('stats');

  const filtered = filter
    ? items.filter(i =>
        i.thing.toLowerCase().includes(filter) ||
        i.place.toLowerCase().includes(filter)
      )
    : items;

  statsEl.innerHTML = filter
    ? `<strong>${filtered.length}</strong> result${filtered.length !== 1 ? 's' : ''} for "<strong>${filter}</strong>" — <strong>${items.length}</strong> total items`
    : `<strong>${items.length}</strong> item${items.length !== 1 ? 's' : ''} tracked`;

  if (filtered.length === 0) {
    listEl.innerHTML = items.length === 0
      ? `<div class="empty"><span>📦</span>Nothing here yet.<br>Add your first item above!</div>`
      : `<div class="empty"><span>🔍</span>No items match "<strong>${filter}</strong>"</div>`;
    return;
  }

  listEl.innerHTML = '';
  [...filtered].reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div class="item-icon">${getEmoji(item.thing)}</div>
      <div class="item-info">
        <div class="item-thing">${item.thing}</div>
        <div class="item-place">${item.place}</div>
      </div>
      <div class="item-date">${formatDate(item.ts)}</div>
      <button class="btn-delete" data-id="${item.id}" title="Remove">✕</button>
    `;
    listEl.appendChild(div);
  });
}

function addItem() {
  const thing = document.getElementById('thing').value.trim();
  const place = document.getElementById('place').value.trim();
  if (!thing || !place) return;

  const items = loadItems();
  items.push({ id: Date.now(), thing, place, ts: Date.now() });
  saveItems(items);

  document.getElementById('thing').value = '';
  document.getElementById('place').value = '';
  document.getElementById('thing').focus();
  render(document.getElementById('search').value.toLowerCase());
}

document.getElementById('btn-add').addEventListener('click', addItem);

document.getElementById('place').addEventListener('keydown', e => {
  if (e.key === 'Enter') addItem();
});

document.getElementById('thing').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('place').focus();
});

document.getElementById('search').addEventListener('input', e => {
  render(e.target.value.toLowerCase().trim());
});

document.getElementById('list').addEventListener('click', e => {
  const btn = e.target.closest('.btn-delete');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const items = loadItems().filter(i => i.id !== id);
  saveItems(items);
  render(document.getElementById('search').value.toLowerCase());
});

render();


const store = new Store();

// Стартовые товары, чтобы таблица не была пустой при открытии
store.add({ name: 'Лыжи', price: 50000, qty: 2 });
store.add({ name: 'Шлем', price: 8000, qty: 3 });
store.add({ name: 'Сноуборд', price: 90000, qty: 1 });

const tableBody = document.querySelector('#productTable tbody');
const totalEl = document.querySelector('#total');
const form = document.querySelector('#addForm');

const nameInput = document.querySelector('#name');
const priceInput = document.querySelector('#price');
const qtyInput = document.querySelector('#qty');

const nameError = document.querySelector('#nameError');
const priceError = document.querySelector('#priceError');
const qtyError = document.querySelector('#qtyError');

function formatMoney(n) {
  return n.toLocaleString('ru-RU') + ' ₸';
}

// Перерисовывает таблицу и итог по текущему состоянию store.
// Вызывается после любого изменения (add / remove / qty change) — страница не перезагружается.
function render() {
  tableBody.innerHTML = '';

  store.items.forEach((item) => {
    const row = document.createElement('tr');
    row.dataset.name = item.name;
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${formatMoney(item.price)}</td>
      <td><div class="qty-cell">
        <button type="button" class="qty-btn" data-action="dec">−</button>
        <span class="qty-value">${item.qty}</span>
        <button type="button" class="qty-btn" data-action="inc">+</button>
      </div></td>
      <td>${formatMoney(item.price * item.qty)}</td>
      <td><button type="button" class="remove-btn" data-action="remove">Удалить</button></td>
    `;
    tableBody.appendChild(row);
  });

  totalEl.textContent = formatMoney(store.total);
}

function clearErrors() {
  nameError.textContent = '';
  priceError.textContent = '';
  qtyError.textContent = '';
}

// Валидация в DOM: ошибки выводятся рядом с полем, без alert()
function validate(name, price, qty) {
  let valid = true;

  if (!name.trim()) {
    nameError.textContent = 'Введите название товара';
    valid = false;
  }
  if (!Number.isFinite(price) || price <= 0) {
    priceError.textContent = 'Цена должна быть больше нуля';
    valid = false;
  }
  if (!Number.isInteger(qty) || qty <= 0) {
    qtyError.textContent = 'Количество должно быть целым числом больше нуля';
    valid = false;
  }

  return valid;
}

// Один делегированный обработчик на форму — реагирует на отправку (добавление товара)
form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  const name = nameInput.value;
  const price = Number(priceInput.value);
  const qty = Number(qtyInput.value);

  if (!validate(name, price, qty)) {
    return;
  }

  if (store.find(name)) {
    nameError.textContent = 'Товар с таким названием уже есть';
    return;
  }

  store.add({ name: name.trim(), price, qty });
  form.reset();
  render();
});

// Один делегированный обработчик на таблицу — реагирует на клики по кнопкам
// внутри любой строки (удалить / +/− количество), не вешаем обработчик на каждую кнопку
tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const row = button.closest('tr');
  const name = row.dataset.name;
  const item = store.find(name);
  if (!item) return;

  const action = button.dataset.action;

  if (action === 'remove') {
    store.remove(name);
  } else if (action === 'inc') {
    store.updateQty(name, item.qty + 1);
  } else if (action === 'dec' && item.qty > 1) {
    store.updateQty(name, item.qty - 1);
  }

  render();
});

render();

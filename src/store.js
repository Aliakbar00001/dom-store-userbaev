class Store {
  #items = [];

  add(item) {
    if (!item || typeof item.name !== 'string' || !item.name.trim()) {
      throw new TypeError('item must have a non-empty string name');
    }
    this.#items.push(item);
    return this;
  }

  remove(name) {
    this.#items = this.#items.filter((item) => item.name !== name);
    return this;
  }

  find(name) {
    return this.#items.find((item) => item.name === name);
  }

  updateQty(name, qty) {
    const item = this.find(name);
    if (!item) {
      throw new Error(`Item "${name}" not found`);
    }
    if (!Number.isFinite(qty) || qty < 0) {
      throw new RangeError('qty must be a non-negative number');
    }
    item.qty = qty;
    return this;
  }

  get items() {
    return [...this.#items];
  }

  get total() {
    return this.#items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}

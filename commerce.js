/* Local concept-store checkout. Only product quantities are persisted. */
(() => {
  'use strict';
  const dialog = document.getElementById('commerce-dialog');
  const title = document.getElementById('commerce-title');
  const form = document.getElementById('checkout-form');
  const bagButton = document.getElementById('open-bag');
  const notice = document.getElementById('bag-notice');
  const bagItems = document.getElementById('bag-items');
  const views = ['bag', 'checkout', 'success'];
  const money = amount => '£' + amount.toFixed(2);
  const storageKey = 'oces-eros-cart-v1';
  let bag = {};
  let noticeTimer;
  let orderTimer;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      Object.keys(products).forEach(id => { if (Number.isInteger(saved[id]) && saved[id] > 0) bag[id] = Math.min(99, saved[id]); });
    }
  } catch { /* The store also works when local storage is unavailable. */ }
  const entries = () => Object.entries(bag).filter(([id, quantity]) => products[id] && quantity > 0);
  const count = () => entries().reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = () => entries().reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  function resetSubmit() { const submit = document.getElementById('place-order'); submit.disabled = false; const arrow = el('span', '', '↗'); arrow.setAttribute('aria-hidden', 'true'); submit.replaceChildren(document.createTextNode('Place demo order'), arrow); }
  function imageFor(id) { return document.querySelector(`.product-image[data-product="${id}"] img`).src; }
  function saveBag() { try { localStorage.setItem(storageKey, JSON.stringify(bag)); } catch {} }
  function syncBag() {
    document.getElementById('bag-count').textContent = count();
    bagButton.setAttribute('aria-label', `Shopping bag, ${count()} ${count() === 1 ? 'item' : 'items'}`);
    bagItems.replaceChildren();
    if (!count()) {
      const empty = el('div', 'bag-empty'); empty.append(el('h3', '', 'A little space for a ritual.'), el('p', '', 'Your bag is empty. Explore the EROS collection to find your first edition.')); bagItems.append(empty);
    }
    entries().forEach(([id, quantity]) => {
      const product = products[id];
      const row = el('article', 'bag-item');
      const image = el('img', 'bag-item-image'); image.src = imageFor(id); image.alt = product.alt;
      const copy = el('div', 'bag-item-copy'); copy.append(el('p', 'product-type', product.type), el('h3', '', product.title), el('p', 'bag-unit-price', money(product.price) + ' each'));
      const controls = el('div', 'bag-item-controls');
      const stepper = el('div', 'quantity-stepper');
      const decrease = el('button', '', '−'); decrease.type = 'button'; decrease.dataset.change = id; decrease.dataset.delta = '-1'; decrease.setAttribute('aria-label', 'Decrease quantity of ' + product.title);
      const amount = el('span', '', String(quantity)); amount.setAttribute('aria-label', 'Quantity ' + quantity);
      const increase = el('button', '', '+'); increase.type = 'button'; increase.dataset.change = id; increase.dataset.delta = '1'; increase.disabled = quantity >= 99; increase.setAttribute('aria-label', 'Increase quantity of ' + product.title);
      stepper.append(decrease, amount, increase);
      const remove = el('button', 'remove-item', 'Remove'); remove.type = 'button'; remove.dataset.remove = id; remove.setAttribute('aria-label', 'Remove ' + product.title);
      controls.append(stepper, remove); copy.append(controls); row.append(image, copy, el('strong', 'bag-line-price', money(product.price * quantity))); bagItems.append(row);
    });
    document.getElementById('bag-subtotal').textContent = money(total());
    document.getElementById('bag-summary').hidden = !count();
    document.getElementById('begin-checkout').disabled = !count();
    saveBag();
  }
  function setView(view) {
    views.forEach(name => document.getElementById(name + '-view').hidden = name !== view);
    dialog.classList.toggle('is-checkout', view === 'checkout'); dialog.classList.toggle('is-success', view === 'success');
    title.textContent = { bag: 'Your bag.', checkout: 'Check out.', success: 'Thank you.' }[view];
    document.getElementById('close-commerce').setAttribute('aria-label', view === 'checkout' ? 'Close checkout' : view === 'success' ? 'Close order confirmation' : 'Close shopping bag');
    dialog.scrollTop = 0;
  }
  function openBag() { clearTimeout(noticeTimer); notice.classList.remove('visible'); syncBag(); setView('bag'); if (!dialog.open) dialog.showModal(); }
  function announce(id) {
    clearTimeout(noticeTimer); notice.replaceChildren(el('span', '', products[id].title.replace(/\.$/, '') + ' added to your bag.'));
    const view = el('button', '', 'View bag →'); view.type = 'button'; view.addEventListener('click', openBag); notice.append(view); notice.classList.add('visible');
    noticeTimer = setTimeout(() => notice.classList.remove('visible'), 4500);
  }
  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    if (!add || !products[add.dataset.add]) return;
    const id = add.dataset.add;
    if ((bag[id] || 0) >= 99) { openBag(); return; }
    bag[id] = (bag[id] || 0) + 1; syncBag();
    if (productDialog.open) productDialog.close();
    announce(id);
  });
  bagButton.addEventListener('click', openBag);
  document.getElementById('close-commerce').addEventListener('click', () => dialog.close());
  document.getElementById('continue-shopping').addEventListener('click', () => dialog.close());
  document.getElementById('finish-order').addEventListener('click', () => dialog.close());
  bagItems.addEventListener('click', event => {
    const control = event.target.closest('[data-change],[data-remove]'); if (!control) return;
    const id = control.dataset.change || control.dataset.remove;
    if (!products[id]) return;
    if (control.dataset.remove) delete bag[id];
    else { const quantity = (bag[id] || 0) + Number(control.dataset.delta); if (quantity <= 0) delete bag[id]; else bag[id] = Math.min(99, quantity); }
    const action = control.dataset.delta;
    syncBag();
    const replacement = action ? bagItems.querySelector(`[data-change="${id}"][data-delta="${action}"]`) : null;
    (replacement && !replacement.disabled ? replacement : document.getElementById('continue-shopping')).focus();
  });
  function clearPayment() { ['cardName', 'cardNumber', 'expiry', 'cvc'].forEach(name => { form.elements[name].value = ''; form.elements[name].setCustomValidity(''); }); document.getElementById('payment-error').textContent = ''; }
  function reviewOrder() {
    const list = document.getElementById('checkout-items'); list.replaceChildren();
    entries().forEach(([id, quantity]) => { const line = el('p', 'checkout-line'); line.append(el('span', '', `${products[id].title} × ${quantity}`), el('span', '', money(products[id].price * quantity))); list.append(line); });
    document.getElementById('checkout-total').textContent = money(total());
  }
  document.getElementById('begin-checkout').addEventListener('click', () => { if (!count()) return; reviewOrder(); setView('checkout'); title.tabIndex = -1; title.focus(); });
  document.getElementById('back-to-bag').addEventListener('click', () => { clearPayment(); setView('bag'); document.getElementById('begin-checkout').focus(); });
  form.addEventListener('input', event => { if (event.target.setCustomValidity) event.target.setCustomValidity(''); document.getElementById('payment-error').textContent = ''; });
  function cardIsValid(value) {
    if (!/^[\d\s-]+$/.test(value)) return false;
    const digits = value.replace(/[\s-]/g, ''); if (!/^\d{13,19}$/.test(digits) || /^(\d)\1+$/.test(digits)) return false;
    let sum = 0; let double = false;
    for (let index = digits.length - 1; index >= 0; index--) { let digit = Number(digits[index]); if (double) { digit *= 2; if (digit > 9) digit -= 9; } sum += digit; double = !double; }
    return sum % 10 === 0;
  }
  function expiryIsValid(value) {
    const match = value.match(/^\s*(\d{2})\s*\/\s*(\d{2})\s*$/); if (!match) return false;
    const month = Number(match[1]); const year = 2000 + Number(match[2]); const now = new Date();
    return month >= 1 && month <= 12 && (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1));
  }
  function invalid(field, message) { field.setCustomValidity(message); document.getElementById('payment-error').textContent = message; field.reportValidity(); }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!count() || orderTimer) return;
    for (const name of ['fullName', 'address', 'city', 'postcode', 'cardName']) { if (!form.elements[name].value.trim()) { invalid(form.elements[name], 'Please complete this field.'); return; } }
    if (!cardIsValid(form.elements.cardNumber.value)) { invalid(form.elements.cardNumber, 'Enter a valid card number. For this demo, use 4242 4242 4242 4242.'); return; }
    if (!expiryIsValid(form.elements.expiry.value)) { invalid(form.elements.expiry, 'Enter a current or future expiry date as MM / YY.'); return; }
    if (!/^\d{3,4}$/.test(form.elements.cvc.value)) { invalid(form.elements.cvc, 'Enter a 3 or 4 digit security code.'); return; }
    const orderCount = count(); const orderTotal = total();
    const submit = document.getElementById('place-order'); submit.disabled = true; submit.textContent = 'Placing your demo order…';
    orderTimer = setTimeout(() => {
      orderTimer = null;
      if (!dialog.open) return;
      document.getElementById('order-reference').textContent = 'DEMO ORDER · EROS-2095-' + String(Date.now()).slice(-6);
      document.getElementById('order-summary').textContent = `${orderCount} ${orderCount === 1 ? 'edition' : 'editions'} · ${money(orderTotal)}`;
      form.reset(); clearPayment(); bag = {}; syncBag(); setView('success'); document.getElementById('success-view').focus({ preventScroll: true });
      resetSubmit();
    }, 650);
  });
  dialog.addEventListener('close', () => { clearTimeout(orderTimer); orderTimer = null; form.reset(); clearPayment(); resetSubmit(); bagButton.focus(); });
  dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
  syncBag();
})();

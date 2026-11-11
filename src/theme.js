if (typeof MutationObserver === 'function' && typeof document.querySelectorAll === 'function') {
  const pinClass = 'cursorbrains-reference-pin';

  globalThis.__cursorBrainsReferenceObserver?.disconnect();
  for (const button of document.querySelectorAll(`.${pinClass}`)) {
    button.closest('.action-item')?.remove();
  }

  function pinReferences() {
    const event = new KeyboardEvent('keydown', {
      key: 'F18',
      code: 'F18',
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    try {
      Object.defineProperty(event, 'keyCode', { configurable: true, get: () => 129 });
      Object.defineProperty(event, 'which', { configurable: true, get: () => 129 });
    } catch { /* the event already exposes keyCode */ }
    const target = document.querySelector('.monaco-workbench') || document.body;
    target.dispatchEvent(event);
  }

  function addPinButton(actionBar) {
    if (actionBar.querySelector(`.${pinClass}`)) return;

    const closeButton = actionBar.querySelector('[aria-label="Close"]');
    if (!closeButton) return;

    const item = document.createElement('li');
    item.className = 'action-item';
    item.setAttribute('role', 'presentation');

    const button = document.createElement('a');
    button.className = `action-label codicon codicon-pinned ${pinClass}`;
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', 'Pin References to View');
    button.setAttribute('title', 'Pin References to View');
    button.tabIndex = 0;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      pinReferences();
    });

    item.appendChild(button);
    closeButton.closest('.action-item')?.before(item);
  }

  const refreshPinButtons = () => {
    for (const actionBar of document.querySelectorAll('.reference-zone-widget .peekview-actions')) {
      addPinButton(actionBar);
    }
  };

  refreshPinButtons();
  const observer = new MutationObserver(refreshPinButtons);
  observer.observe(document.body, { childList: true, subtree: true });
  globalThis.__cursorBrainsReferenceObserver = observer;
}

if (globalThis.__cursorBrainsPeekOutsidePointerDown) {
  document.removeEventListener('pointerdown', globalThis.__cursorBrainsPeekOutsidePointerDown, true);
}

globalThis.__cursorBrainsPeekOutsidePointerDown = (event) => {
  const peeks = document.querySelectorAll(
    '.reference-zone-widget, .zone-widget.dirty-diff .peekview-widget',
  );

  for (const peek of peeks) {
    if (peek.contains(event.target)) continue;
    peek.querySelector('.codicon-close')?.closest('a, button, .action-label')?.click();
  }
};

document.addEventListener('pointerdown', globalThis.__cursorBrainsPeekOutsidePointerDown, true);

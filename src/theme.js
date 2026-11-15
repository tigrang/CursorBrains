if (typeof MutationObserver === 'function' && typeof document.querySelector === 'function') {
  const projectAccentProperty = '--cursorbrains-project-accent';
  let appliedProjectIdentity;

  globalThis.__cursorBrainsProjectObserver?.disconnect();

  function projectIdentity() {
    const projectTitle = document.querySelector('.part.titlebar .window-title-text');
    return (
      projectTitle?.getAttribute('aria-label')
      || projectTitle?.textContent
      || document.title
      || 'Cursor'
    ).trim() || 'Cursor';
  }

  function projectHue(identity) {
    // FNV-1a keeps the same project color across reloads without stored state.
    let hash = 0x811c9dc5;
    for (const character of identity) {
      hash ^= character.codePointAt(0);
      hash = Math.imul(hash, 0x01000193);
    }
    return ((hash >>> 0) % 360 + 55) % 360;
  }

  function refreshProjectAccent() {
    const workbench = document.querySelector('.monaco-workbench');
    if (!workbench) return;

    const identity = projectIdentity();
    if (identity === appliedProjectIdentity) return;

    workbench.style.setProperty(
      projectAccentProperty,
      `oklch(68% 0.14 ${projectHue(identity)})`,
    );
    appliedProjectIdentity = identity;
  }

  refreshProjectAccent();
  const projectObserver = new MutationObserver(refreshProjectAccent);
  projectObserver.observe(document.querySelector('.part.titlebar') || document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['aria-label'],
  });
  globalThis.__cursorBrainsProjectObserver = projectObserver;
}

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
      Object.defineProperty(event, 'keyCode', {configurable: true, get: () => 129});
      Object.defineProperty(event, 'which', {configurable: true, get: () => 129});
    } catch { /* the event already exposes keyCode */
    }
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
  observer.observe(document.body, {childList: true, subtree: true});
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

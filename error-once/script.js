const failureKeyPrefix = 'webrpa-error-once-failed-';
const triggerNames = ['a', 'b'];

export function triggerOnce(storage, triggerName) {
  const failureKey = `${failureKeyPrefix}${triggerName}`;
  if (storage.getItem(failureKey) === '1') return 'success';
  storage.setItem(failureKey, '1');
  return 'error';
}

if (typeof document !== 'undefined') {
  if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
    triggerNames.forEach((name) => sessionStorage.removeItem(`${failureKeyPrefix}${name}`));
  }

  document.getElementById('action-button').addEventListener('click', () => {
    document.getElementById('action-status').textContent = 'Regular action completed successfully.';
  });

  document.getElementById('reset-simulation')?.addEventListener('click', () => {
    triggerNames.forEach((name) => sessionStorage.removeItem(`${failureKeyPrefix}${name}`));
    document.getElementById('action-status').textContent = 'Simulation reset. Both buttons will trigger an error again.';
  });

  function registerTrigger(id, name) {
    document.getElementById(id)?.addEventListener('click', () => {
      if (triggerOnce(sessionStorage, name) === 'error') {
        document.getElementById('error-source').textContent = `TRIGGER ${name.toUpperCase()}`;
        document.getElementById('simulation-page').hidden = true;
        document.getElementById('error-page').hidden = false;
      } else {
        const status = document.getElementById('simulation-success');
        status.textContent = `Trigger ${name.toUpperCase()} completed successfully. Its one-time error has already occurred.`;
        status.hidden = false;
      }
    });
  }

  registerTrigger('trigger-error', 'a');
  registerTrigger('trigger-error-b', 'b');
}

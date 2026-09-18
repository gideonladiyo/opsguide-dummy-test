const failureKey = 'webrpa-error-once-failed';

export function triggerOnce(storage) {
  if (storage.getItem(failureKey) === '1') return 'success';
  storage.setItem(failureKey, '1');
  return 'error';
}

if (typeof document !== 'undefined') {
  if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
    sessionStorage.removeItem(failureKey);
  }

  document.getElementById('action-button').addEventListener('click', () => {
    document.getElementById('action-status').textContent = 'Regular action completed successfully.';
  });

  document.getElementById('reset-simulation')?.addEventListener('click', () => {
    sessionStorage.removeItem(failureKey);
    document.getElementById('action-status').textContent = 'Simulation reset. The next click will trigger an error again.';
  });

  document.getElementById('trigger-error')?.addEventListener('click', () => {
    if (triggerOnce(sessionStorage) === 'error') {
      document.getElementById('simulation-page').hidden = true;
      document.getElementById('error-page').hidden = false;
    } else {
      document.getElementById('simulation-success').hidden = false;
    }
  });
}

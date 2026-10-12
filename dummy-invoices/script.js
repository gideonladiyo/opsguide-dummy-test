const REDIRECT_TARGETS = ['receipt', 'download', 'billing', 'invoice'];
const MAX_DELAY_SECONDS = 60;

function isValidDelay(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

function clampDelay(n) {
  return Math.min(n, MAX_DELAY_SECONDS);
}

function isValidRedirect(name) {
  return REDIRECT_TARGETS.includes(name);
}

function parseParams(search) {
  const params = new URLSearchParams(search);
  const rawDelay = params.get('delay');
  const delay = isValidDelay(rawDelay) ? clampDelay(Number(rawDelay)) : 0;
  const redirect = params.get('redirect');
  return { delay, redirect: isValidRedirect(redirect) ? redirect : null };
}

function resolveRedirectUrl(hubBase, name) {
  if (!isValidRedirect(name)) return null;
  return new URL(name + '/', new URL(hubBase, window.location.href)).href;
}

function formatCountdown(seconds) {
  return seconds === 1
    ? 'Downloading in 1 second…'
    : 'Downloading in ' + seconds + ' seconds…';
}

function startCountdown(anchor, status, seconds, onDone) {
  let remaining = seconds;
  status.hidden = false;
  status.textContent = formatCountdown(remaining);
  const timer = setInterval(function () {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(timer);
      status.textContent = 'Downloading…';
      anchor.click();
      if (onDone) onDone();
      return;
    }
    status.textContent = formatCountdown(remaining);
  }, 1000);
  return timer;
}

function init() {
  const anchor = document.getElementById('download-invoice');
  const status = document.getElementById('download-status');
  if (!anchor || !status) return;

  const { delay, redirect } = parseParams(window.location.search);
  const hubBase = document.body.getAttribute('data-hub') || './';

  if (redirect) {
    anchor.addEventListener('click', function () {
      const target = resolveRedirectUrl(hubBase, redirect);
      if (target) setTimeout(function () { window.location.assign(target); }, 0);
    });
  }

  if (delay > 0) {
    anchor.hidden = true;
    startCountdown(anchor, status, delay, function () {
      anchor.hidden = false;
    });
  }
}

if (typeof document !== 'undefined') init();

export { parseParams, resolveRedirectUrl, formatCountdown, isValidRedirect };

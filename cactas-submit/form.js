// Shared behaviour for cactas-submit fixture pages. Static only, no data is stored.
// Every page reaches a result page whose URL tells which button sent the form:
//   thanks/?page=<slug>&btn=<id of the clicked element>&label=<its text>
(() => {
  const body = document.body;
  const root = body.dataset.root || '../';
  const pageSlug = body.dataset.page || '';

  const labelOf = (el) => {
    if (!el) return '';
    if (el.tagName === 'INPUT') return el.value || el.alt || '';
    return el.textContent || '';
  };

  const go = (path, params) => { location.href = `${root}${path}?${new URLSearchParams(params)}`; };

  function wireForm(form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const submitter = event.submitter
        || (form.dataset.via && document.getElementById(form.dataset.via))
        || null;
      delete form.dataset.via;

      if (submitter && submitter.dataset.action === 'back') {
        location.href = submitter.dataset.href;
        return;
      }

      const params = { page: pageSlug, btn: submitter ? submitter.id || '(no-id)' : '(none)', label: labelOf(submitter) };
      const kind = form.dataset.kind || 'contact';
      if (kind === 'search') return go('search/', params);
      if (kind === 'newsletter') return go('newsletter/', params);

      const status = form.querySelector('.status');
      if (!form.checkValidity()) {
        if (status) status.textContent = '必須項目を入力してください。';
        form.reportValidity();
        return;
      }
      if (status) status.textContent = '';
      if (form.dataset.next) {
        location.href = `${form.dataset.next}?${new URLSearchParams(params)}`;
        return;
      }
      go('thanks/', params);
    });
  }

  // a00-drift: button label and element type come from the URL.
  if (body.dataset.drift) {
    const query = new URLSearchParams(location.search);
    const label = query.get('label') ?? '送信する';
    const type = query.get('type') ?? 'button';
    const actions = document.getElementById('actions');
    let el;
    if (type === 'input') {
      el = document.createElement('input');
      el.type = 'submit';
      el.value = label;
    } else if (type === 'anchor') {
      el = document.createElement('a');
      el.href = '#';
      el.className = 'btn';
      el.setAttribute('role', 'button');
      el.dataset.submit = 'contact-form';
      el.textContent = label;
    } else {
      el = document.createElement('button');
      if (type !== 'notype') el.type = 'submit';
      el.textContent = label;
    }
    el.id = 'submit-button';
    actions.append(el);
  }

  // b04/b05: button inserted into the DOM after a delay.
  document.querySelectorAll('template[data-delay]').forEach((tpl) => {
    setTimeout(() => tpl.replaceWith(tpl.content.cloneNode(true)), Number(tpl.dataset.delay));
  });

  // b03: overlay that blocks clicks for a while.
  document.querySelectorAll('[data-remove-after]').forEach((el) => {
    setTimeout(() => el.remove(), Number(el.dataset.removeAfter));
  });

  // b02: cookie modal closed by its own button.
  document.querySelectorAll('[data-dismiss]').forEach((button) => {
    button.addEventListener('click', () => document.querySelector(button.dataset.dismiss)?.remove());
  });

  // b06/b07: agreement checkbox reveals or enables the submit button.
  document.querySelectorAll('input[data-reveal], input[data-enable]').forEach((checkbox) => {
    const sync = () => {
      if (checkbox.dataset.reveal) document.querySelector(checkbox.dataset.reveal).hidden = !checkbox.checked;
      if (checkbox.dataset.enable) document.querySelector(checkbox.dataset.enable).disabled = !checkbox.checked;
    };
    checkbox.addEventListener('change', sync);
    sync();
  });

  // a12 (and a00 type=anchor): link that submits the form through JS.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-submit]');
    if (!link) return;
    event.preventDefault();
    const form = document.getElementById(link.dataset.submit);
    form.dataset.via = link.id;
    form.requestSubmit();
  });

  // b11: form rendered inside an open shadow root.
  customElements.define('cactas-shadow-form', class extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.append(document.getElementById(this.getAttribute('template')).content.cloneNode(true));
      shadow.querySelectorAll('form').forEach(wireForm);
    }
  });

  document.querySelectorAll('form').forEach(wireForm);

  // Result pages: echo the query so the run screenshot shows which button was used.
  const resultQuery = new URLSearchParams(location.search);
  document.querySelectorAll('[data-param]').forEach((el) => {
    el.textContent = resultQuery.get(el.dataset.param) || '-';
  });
  const verdict = document.getElementById('verdict');
  if (verdict) {
    const ok = resultQuery.get('btn') === 'submit-button';
    verdict.textContent = ok ? 'OK: 送信ボタン (#submit-button)' : `NG: 想定外の要素 (${resultQuery.get('btn') || '-'})`;
    verdict.className = ok ? 'verdict ok' : 'verdict ng';
  }

  // c01 and result pages: show (and log on Vercel) the IP that reached the site.
  const ipTarget = document.getElementById('client-ip');
  if (ipTarget) {
    const query = new URLSearchParams(location.search);
    const params = new URLSearchParams({
      page: query.get('page') || pageSlug,
      event: body.dataset.event || 'view',
      btn: query.get('btn') || '',
    });
    fetch(`/api/cactas-whoami?${params}`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) => { ipTarget.textContent = data.ip || '不明'; })
      .catch(() => { ipTarget.textContent = '取得できませんでした'; });
  }
})();

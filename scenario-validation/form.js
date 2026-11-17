// Client-side only: validates required fields and shows a completion panel.
// No API call — these pages are fixtures for scenario generation/validation tests.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  const thanks = document.querySelector('#thanks');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = '必須項目を入力してください。';
      form.reportValidity();
      return;
    }
    status.textContent = '';
    form.hidden = true;
    thanks.hidden = false;
  });
});

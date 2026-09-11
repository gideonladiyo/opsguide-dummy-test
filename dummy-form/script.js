/**
 * Hikidasu Contact Form Script
 * Handles 2-step confirmation and submits data to Vercel API Route (/api/submit)
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const formStep1 = document.getElementById('form-step-1');
  const formStep2 = document.getElementById('form-step-2');
  const formStep3 = document.getElementById('form-step-3');

  const stepInd1 = document.getElementById('step-indicator-1');
  const stepInd2 = document.getElementById('step-indicator-2');
  const stepInd3 = document.getElementById('step-indicator-3');

  const inputName = document.getElementById('input-name');
  const inputEmail = document.getElementById('input-email');
  const inputDescription = document.getElementById('input-description');

  const previewName = document.getElementById('preview-name');
  const previewEmail = document.getElementById('preview-email');
  const previewDescription = document.getElementById('preview-description');

  const groupName = document.getElementById('group-name');
  const groupEmail = document.getElementById('group-email');
  const groupDescription = document.getElementById('group-description');

  const btnConfirm = document.getElementById('btn-confirm');
  const btnBack = document.getElementById('btn-back');
  const btnSubmit = document.getElementById('btn-submit');
  const btnReset = document.getElementById('btn-reset');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnText = document.getElementById('btn-text');

  const alertBox = document.getElementById('alert-box');

  // Input Realtime Clear Error
  [inputName, inputEmail, inputDescription].forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
      hideAlert();
    });
  });

  // Validate Email Regex
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Validate Form Step 1
  function validateForm() {
    let isValid = true;

    // Validate Name
    const nameVal = inputName.value.trim();
    if (!nameVal) {
      groupName.classList.add('has-error');
      isValid = false;
    } else {
      groupName.classList.remove('has-error');
    }

    // Validate Email
    const emailVal = inputEmail.value.trim();
    if (!emailVal || !isValidEmail(emailVal)) {
      groupEmail.classList.add('has-error');
      isValid = false;
    } else {
      groupEmail.classList.remove('has-error');
    }

    // Validate Description
    const descVal = inputDescription.value.trim();
    if (!descVal) {
      groupDescription.classList.add('has-error');
      isValid = false;
    } else {
      groupDescription.classList.remove('has-error');
    }

    return isValid;
  }

  // Show Alert Message
  function showAlert(msg, type = 'error') {
    alertBox.className = `alert-box alert-${type}`;
    alertBox.innerHTML = type === 'error' 
      ? `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`
      : `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    alertBox.classList.remove('hidden');
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    alertBox.classList.add('hidden');
  }

  // Step Switcher
  function goToStep(stepNumber) {
    hideAlert();
    formStep1.classList.add('hidden');
    formStep2.classList.add('hidden');
    formStep3.classList.add('hidden');

    stepInd1.classList.remove('active');
    stepInd2.classList.remove('active');
    stepInd3.classList.remove('active');

    if (stepNumber === 1) {
      formStep1.classList.remove('hidden');
      stepInd1.classList.add('active');
    } else if (stepNumber === 2) {
      formStep2.classList.remove('hidden');
      stepInd1.classList.add('active');
      stepInd2.classList.add('active');
    } else if (stepNumber === 3) {
      formStep3.classList.remove('hidden');
      stepInd1.classList.add('active');
      stepInd2.classList.add('active');
      stepInd3.classList.add('active');
    }
  }

  // Confirm Button Action (Step 1 -> Step 2)
  btnConfirm.addEventListener('click', () => {
    if (!validateForm()) {
      showAlert('Please complete all required fields correctly before proceeding.');
      return;
    }

    // Populate preview
    previewName.textContent = inputName.value.trim();
    previewEmail.textContent = inputEmail.value.trim();
    previewDescription.textContent = inputDescription.value.trim();

    goToStep(2);
  });

  // Back Button Action (Step 2 -> Step 1)
  btnBack.addEventListener('click', () => {
    goToStep(1);
  });

  // Submit Button Action (Step 2 -> Step 3)
  btnSubmit.addEventListener('click', async () => {
    const formData = {
      name: inputName.value.trim(),
      email: inputEmail.value.trim(),
      description: inputDescription.value.trim(),
      timestamp: new Date().toISOString()
    };

    // UI Loading state
    btnSubmit.disabled = true;
    btnBack.disabled = true;
    btnSpinner.classList.remove('hidden');
    btnText.textContent = ' Sending...';
    hideAlert();

    try {
      // Send request strictly to Vercel Serverless Function (/api/submit)
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        goToStep(3);
      } else {
        const errMsg = data.error || 'Failed to submit form data. Please try again.';
        showAlert(errMsg);
      }
    } catch (err) {
      console.error('Submission error:', err);
      showAlert('Connection error. Please try again.');
    } finally {
      btnSubmit.disabled = false;
      btnBack.disabled = false;
      btnSpinner.classList.add('hidden');
      btnText.innerHTML = '<i class="fa-solid fa-lock"></i> Submit';
    }
  });

  // Reset Form (Step 3 -> Step 1)
  btnReset.addEventListener('click', () => {
    inputName.value = '';
    inputEmail.value = '';
    inputDescription.value = '';
    goToStep(1);
  });
});

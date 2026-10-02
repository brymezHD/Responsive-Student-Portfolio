// Contact form validation. Each rule returns an error message, or '' if the value is valid.
(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const rules = {
    name: (v) => (v ? '' : 'Enter your name.'),
    email: (v) => !v ? 'Enter your email address.'
      : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address, like name@example.com.',
    phone: (v) => !v ? 'Enter your phone number.'
      : !/^\d+$/.test(v) ? 'Use digits only, with no spaces, plus signs or dashes.'
      : (v.length < 7 || v.length > 15) ? 'Phone number must be 7 to 15 digits.' : '',
    message: (v) => !v ? 'Write a message.' : v.length < 10 ? 'Message must be at least 10 characters.' : ''
  };

  function showFieldError(field, message) {
    document.getElementById(field + '-error').textContent = message;
    form.elements[field].setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function setStatus(type, text) {
    status.className = 'msg ' + type;
    status.setAttribute('role', type === 'error' ? 'alert' : 'status');
    status.textContent = text;
    status.focus();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // never let an invalid form submit
    let firstInvalid = null;
    Object.keys(rules).forEach((field) => {
      const message = rules[field](form.elements[field].value.trim());
      showFieldError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      setStatus('error', 'Your message was not sent. Fix the highlighted fields and try again.');
      form.elements[firstInvalid].focus();
      return;
    }
    // Simulated send: connect a form service (e.g. Formspree) here to deliver real messages.
    const name = form.elements.name.value.trim();
    form.reset();
    setStatus('success', `Message sent. Thanks, ${name}. I'll reply soon.`);
  });

  // Clear a field's error as soon as the user corrects it
  form.addEventListener('input', (e) => {
    const f = e.target.name;
    if (rules[f] && e.target.getAttribute('aria-invalid') === 'true') showFieldError(f, rules[f](e.target.value.trim()));
  });
})();

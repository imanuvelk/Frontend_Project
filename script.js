// Basic interactive behavior for the portfolio

document.addEventListener('DOMContentLoaded', () => {
  /* Header nav toggle for mobile */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');

  navToggle.addEventListener('click', () => {
    const visible = nav.getAttribute('data-visible') === 'true';
    nav.setAttribute('data-visible', String(!visible));
    navToggle.setAttribute('aria-expanded', String(!visible));
  });

  /* smooth scrolling for internal links */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior: 'smooth', block:'start'});
        // close nav on mobile
        if (window.innerWidth <= 760 && nav.getAttribute('data-visible') === 'true') {
          nav.setAttribute('data-visible', 'false');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    })
  });

  /* Animated skill bars when section visible */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillsSection = document.getElementById('skills');

  const skillsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach(el => {
          const fill = el.dataset.fill || 0;
          el.style.width = fill + '%';
        });
        skillsObserver.disconnect();
      }
    });
  }, {threshold: 0.3});
  if (skillsSection) skillsObserver.observe(skillsSection);

  /* Project modal logic */
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const openBtns = document.querySelectorAll('.open-project');
  const closeBtns = modal.querySelectorAll('.modal-close');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const title = btn.dataset.title;
      const desc = btn.dataset.desc;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modal.setAttribute('aria-hidden','false');
      // set focus inside modal
      const firstAction = modal.querySelector('.modal-actions .btn');
      if (firstAction) firstAction.focus();
    });
  });

  closeBtns.forEach(b => b.addEventListener('click', () => {
    modal.setAttribute('aria-hidden','true');
  }));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.setAttribute('aria-hidden','true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      modal.setAttribute('aria-hidden','true');
    }
  });

  /* Project filtering */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projectCards.forEach(card => {
        if (f === 'all' || card.dataset.type === f) {
          card.style.display = '';
          // subtle reflow animation
          card.style.transform = 'translateY(0) scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* Contact form - store messages to localStorage and show feedback */
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  const saveLocalBtn = document.getElementById('save-local');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Please complete all fields.';
      feedback.style.color = '#ffb4b4';
      return;
    }

    // mimic sending — store in localStorage as "sentMessages"
    const messages = JSON.parse(localStorage.getItem('sentMessages') || '[]');
    messages.push({name, email, message, ts: Date.now()});
    localStorage.setItem('sentMessages', JSON.stringify(messages));
    feedback.textContent = 'Message saved locally — (no backend). You can download your resume or contact via email.';
    feedback.style.color = '';
    form.reset();
  });

  saveLocalBtn.addEventListener('click', () => {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name && !email && !message) {
      feedback.textContent = 'Fill at least one field to save locally.';
      feedback.style.color = '#ffb4b4';
      return;
    }
    const draft = {name, email, message, ts: Date.now()};
    localStorage.setItem('contactDraft', JSON.stringify(draft));
    feedback.textContent = 'Draft saved locally.';
  });

  /* footer year */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* simple keyboard accessibility: open project card when pressing Enter on card */
  projectCards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const btn = card.querySelector('.open-project');
        if (btn) btn.click();
      }
    });
  });
});

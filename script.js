(() => {
  const navbar = document.querySelector('[data-navbar]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const cursor = document.querySelector('.cursor');
  const caseInput = document.querySelector('[data-case-input]');

  const setNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  setNavbar();
  window.addEventListener('scroll', setNavbar, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('in-view'));
  }

  const tabs = document.querySelector('[data-tabs]');
  if (tabs) {
    const buttons = tabs.querySelectorAll('[data-tab]');
    const panels = tabs.querySelectorAll('[data-panel]');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.tab;
        buttons.forEach(btn => {
          const active = btn === button;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-selected', String(active));
        });
        panels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === id));
      });
    });
  }

  const faq = document.querySelector('[data-faq]');
  if (faq) {
    faq.querySelectorAll('.faq-button').forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isOpen = item.classList.toggle('open');
        button.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (counter) => {
    const end = Number(counter.dataset.count || 0);
    const duration = 1200;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * end);
      counter.textContent = value.toLocaleString('es-MX');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  document.querySelectorAll('[data-case-cta]').forEach(link => {
    link.addEventListener('click', () => {
      if (caseInput) caseInput.value = link.dataset.caseCta;
      const select = document.querySelector('#necesidad');
      if (!select) return;
      const map = {
        'Entrar a retail': 'Entrar o crecer en autoservicio',
        'Reducir agotados': 'Reducir agotados o inventario fantasma',
        'Mejorar exhibición': 'Mejorar exhibición y frentes',
        'Monitoreo con app': 'Monitorear ejecución con app y KPI',
        'Cambio de agencia': 'Cambiar de agencia de promotoría'
      };
      const value = map[link.dataset.caseCta];
      if (value) select.value = value;
    });
  });

  const form = document.querySelector('[data-lead-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = Object.fromEntries(new FormData(form).entries());
      sessionStorage.setItem('gc2030Lead', JSON.stringify({ ...formData, createdAt: new Date().toISOString() }));
      window.location.href = 'gracias.html';
    });
  }



  document.querySelectorAll('.value-card, .stat-item, .logo-proof-card').forEach(card => {
    card.addEventListener('mousemove', (event) => {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
      card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (event) => {
      cursor.classList.add('active');
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll('a,button,input,textarea,select').forEach(item => {
      item.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      item.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
  }
})();

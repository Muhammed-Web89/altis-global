/**
 * Altis Global — Main JS
 * Navigation, animations, interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Initialize i18n ── */
  I18N.init();

  /* ── Navbar scroll behavior ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('transparent');
      } else {
        navbar.classList.remove('scrolled');
        navbar.classList.add('transparent');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Language Switcher ── */
  const langBtn      = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = langDropdown.classList.toggle('open');
      langBtn.classList.toggle('open', isOpen);
    });
    document.addEventListener('click', () => {
      langDropdown.classList.remove('open');
      langBtn.classList.remove('open');
    });
    langDropdown.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', () => {
        I18N.setLanguage(opt.dataset.lang);
        langDropdown.classList.remove('open');
        langBtn.classList.remove('open');
      });
    });
  }

  /* ── Hero background parallax ── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.3;
      heroBg.style.transform = `translateY(${offset}px) scale(1)`;
    }, { passive: true });
  }

  /* ── Scroll reveal animations ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Counter animation ── */
  function animateCounter(el, target, duration = 1800) {
    let start = null;
    const num = parseInt(target);
    const isPlus = target.includes('+');
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(ease * num);
      el.textContent = current + (isPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.dataset.count;
        if (target) animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Contact form submission ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name    = contactForm.querySelector('#name')?.value || '';
      const phone   = contactForm.querySelector('#phone')?.value || '';
      const country = contactForm.querySelector('#country')?.value || '';
      const message = contactForm.querySelector('#message')?.value || '';
      const lang    = I18N.currentLang;

      const text = `Salam! Altis Global web saytından məktub gəldi:\n\n` +
        `👤 Ad: ${name}\n📞 Telefon: ${phone}\n🌍 Ülke/Mamlakat: ${country}\n💬 Mesaj: ${message}\n🌐 Dil: ${lang.toUpperCase()}`;
      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/905369700989?text=${encoded}`, '_blank');
    });
  }

  /* ── Project filter (projects page) ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-city]');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const city = btn.dataset.filter;
        projectCards.forEach(card => {
          const show = city === 'all' || card.dataset.city === city;
          card.style.display = show ? '' : 'none';
          if (show) {
            card.style.animation = 'fadeInUp 0.4s ease both';
          }
        });
      });
    });
  }

  /* ── Gallery thumbnails (project detail) ── */
  const galleryMain   = document.getElementById('galleryMain');
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  if (galleryMain && galleryThumbs.length) {
    galleryThumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        galleryThumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        galleryMain.querySelector('img').src = thumb.querySelector('img').src;
      });
    });
    galleryThumbs[0]?.classList.add('active');
  }

  /* ── Testimonial auto-scroll (mobile) ── */
  // No-op for now — grid layout handles it

  /* ── WhatsApp float tooltip ── */
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    const msg = encodeURIComponent(I18N.t('contact.whatsapp_msg') || 'Merhaba, Altis Global sitesinden yazıyorum.');
    waFloat.href = `https://wa.me/905369700989?text=${msg}`;
    document.addEventListener('langChanged', () => {
      const newMsg = encodeURIComponent(I18N.t('contact.whatsapp_msg') || '');
      waFloat.href = `https://wa.me/905369700989?text=${newMsg}`;
    });
  }

});

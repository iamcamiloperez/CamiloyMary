/* ======================================================
   A. CONSTANTES   DATOS DE LA BODA
   (Edita aqu  todos los textos, fechas y enlaces)
====================================================== */
const WEDDING = {
  /* Imagen marco de rosas (esquinas) */
  frameSrc: './assets/rosas.png',

  /* Novios */
  groom: 'Camilo',
  bride:  'Maritza',

  /* Fecha de la boda (formato: a o, mes-1, d a, hora, min) */
  weddingDateISO: '2026-11-14T17:00:00', // A o-Mes-D a T Hora:Min
  weddingDateDisplay: 'Sábado, 14 de noviembre de 2026',

  /* Ceremonia */
  ceremony: {
    place:   'Nombre de la Iglesia / Capilla',
    address: 'Dirección de la ceremonia, Bogotá',
    date:    'Sábado, 14 de febrero de 2026',
    time:    '3:00 p.m.',
    mapLink: 'LINK_MAPA_CEREMONIA',
  },

  /* Recepci n */
  reception: {
    place:   'Nombre del salón / hacienda',
    address: 'Dirección de la recepción, Bogotá',
    date:    'Sábado, 14 de febrero de 2026',
    time:    '5:00 p.m. – 2:00 a.m.',
    mapLink: 'LINK_MAPA_RECEPCION',
  },

  /* Confirmaci n */
  rsvp: {
    deadline:  '31 de enero de 2026',
    formLink:  'LINK_FORMULARIO_ASISTENCIA',
    message:   'Por favor confirma tu asistencia antes del %deadline%. En el formulario encontrarás información útil sobre transporte, alimentación, bebidas y hospedaje.',
  },

  /* Recomendaciones */
  recommendations: [
    { icon: '🕒', text: 'Llega temprano para que no te pierdas ningún momento. La ceremonia da inicio puntualmente.' },
    { icon: '📸', text: 'Disfruta cada instante con todos los sentidos. Eso es exactamente lo que esperamos de ti.' },
    { icon: '✅', text: 'Confirma tu asistencia con tiempo — nos ayuda a organizarlo todo con amor y precisión.' },
    { icon: '🚗', text: 'En el formulario de confirmación encontrarás información detallada sobre transporte, alimentación, bebidas y hospedaje.' },
    { icon: '📵', text: 'La ceremonia es un momento íntimo. Te pedimos mantener el celular en silencio y disfrutar el presente.' },
    { icon: '🌸', text: 'Por favor evita el color blanco en tu atuendo, reservémoslo para la novia.' },
  ],

  /* Dress code */
  dresscode: {
    main: 'El estilo de la celebración es formal-elegante. Queremos que te sientas cómodo/a y hermoso/a.',
    note: '🚫 Por favor evita el color blanco. Te pedimos también evitar tacones muy altos si la ceremonia es al aire libre.',
    items: [
      { icon: '🤵', title: 'Caballeros',   desc: 'Traje formal o smoking. Corbata o pajarita recomendada.',        swatches: ['#1a2a4a','#3a3a3a','#5c4a38','#4a6f8a'] },
      { icon: '👗', title: 'Damas',         desc: 'Vestido largo o midi formal. Colores suaves y elegantes.',       swatches: ['#d4798a','#7b9db8','#7a8c5c','#b08d57','#c9b8d0'] },
      { icon: '👦', title: 'Niños',          desc: 'Formal acorde a su edad. Cómodo para que puedan disfrutar.',    swatches: ['#4a6f8a','#7a8c5c','#b08d57'] },
      { icon: '💃', title: 'Jovencitas',    desc: 'Vestido elegante. Evitar el blanco. ¡Diviértete con el color!', swatches: ['#d4798a','#7b9db8','#c9b8d0','#7a8c5c'] },
    ],
  },

  /* QRs / Recuerdos */
  qrs: {
    intro: 'Hemos preparado espacios especiales para que compartas este día con nosotros, incluso desde lejos.',
    items: [
      { icon: '🎵', title: 'Jam – Playlist',  desc: 'Agrega canciones a nuestra lista. ¡Cuéntanos cuál es tu favorita!', link: 'LINK_JAM_PLAYLIST' },
      { icon: '📷', title: 'Álbum compartido', desc: 'Sube tus fotos del día. Todos podrán verlas y descargarlas.',        link: 'LINK_ALBUM_FOTOS' },
      { icon: '💌', title: 'Buzón de deseos',  desc: 'Déjanos un mensaje, un consejo o simplemente tu cariño.',             link: 'LINK_BUZON_DESEOS' },
    ],
  },

  /* Footer */
  footer: {
    dateText: 'Bogotá, Colombia · 14.02.2026',
    contacts: [
      { icon: '📞', label: 'Camilo',  value: '+57 300 000 0000', link: 'tel:+573000000000' },
      { icon: '📞', label: 'Maritza', value: '+57 300 000 0001', link: 'tel:+573000000001' },
      { icon: '✉',  label: 'Email',   value: 'boda@ejemplo.com',  link: 'mailto:boda@ejemplo.com' },
    ],
  },

  /* Audio (ruta al archivo de m sica) */
  audioSrc: null, // 'RUTA_A_TU_CANCION.mp3'
};

/* ======================================================
   B. INICIALIZACI N   POBLAR CONTENIDO DIN MICO
====================================================== */
(function init() {
  // Nombres
  document.getElementById('name-groom').textContent = WEDDING.groom;
  document.getElementById('name-bride').textContent  = WEDDING.bride;

  // Fecha display
  document.getElementById('wedding-date-display').textContent = WEDDING.weddingDateDisplay;

  // Invitado desde URL ?guest=Nombre
  const urlParams   = new URLSearchParams(window.location.search);
  const guestName   = urlParams.get('guest') || urlParams.get('invitado') || '';
  const greetingEl  = document.getElementById('guest-greeting');
  if (guestName) {
    greetingEl.textContent = `Querido/a ${decodeURIComponent(guestName)},`;
  } else {
    greetingEl.textContent = 'Con todo nuestro amor,';
  }

  // Ceremonia
  document.getElementById('ceremony-place').textContent   = WEDDING.ceremony.place;
  document.getElementById('ceremony-address').textContent = WEDDING.ceremony.address;
  document.getElementById('ceremony-date').textContent    = WEDDING.ceremony.date;
  document.getElementById('ceremony-time').textContent    = WEDDING.ceremony.time;
  document.querySelectorAll('a[href="LINK_MAPA_CEREMONIA"]').forEach(a => a.href = WEDDING.ceremony.mapLink);

  // Recepci n
  document.getElementById('reception-place').textContent   = WEDDING.reception.place;
  document.getElementById('reception-address').textContent = WEDDING.reception.address;
  document.getElementById('reception-date').textContent    = WEDDING.reception.date;
  document.getElementById('reception-time').textContent    = WEDDING.reception.time;
  document.querySelectorAll('a[href="LINK_MAPA_RECEPCION"]').forEach(a => a.href = WEDDING.reception.mapLink);

  // RSVP
  document.getElementById('rsvp-deadline').textContent = WEDDING.rsvp.deadline;
  document.querySelector('#asistencia .section-body').innerHTML =
    WEDDING.rsvp.message.replace('%deadline%', `<strong>${WEDDING.rsvp.deadline}</strong>`);
  document.querySelectorAll('a[href="LINK_FORMULARIO_ASISTENCIA"]').forEach(a => a.href = WEDDING.rsvp.formLink);

  // Recomendaciones
  const recList = document.getElementById('rec-list');
  WEDDING.recommendations.forEach((r, i) => {
    const li = document.createElement('li');
    li.className = 'rec-item';
    li.innerHTML = `<span class="rec-num">${String(i+1).padStart(2,'0')}</span><p class="rec-text"><span style="margin-right:.4rem">${r.icon}</span>${r.text}</p>`;
    recList.appendChild(li);
  });

  // Dress code
  document.getElementById('dresscode-main').textContent = WEDDING.dresscode.main;
  document.getElementById('dresscode-note').textContent  = WEDDING.dresscode.note;
  const dressGrid = document.getElementById('dress-grid');
  WEDDING.dresscode.items.forEach(item => {
    const swatchHTML = item.swatches.map(c => `<div class="color-swatch" style="background:${c}" title="${c}"></div>`).join('');
    const div = document.createElement('div');
    div.className = 'dress-item';
    div.innerHTML = `
      <span class="dress-icon">${item.icon}</span>
      <span class="dress-title">${item.title}</span>
      <span class="dress-desc">${item.desc}</span>
      <div class="color-palette">${swatchHTML}</div>`;
    dressGrid.appendChild(div);
  });

  // QRs
  document.getElementById('qr-intro').textContent = WEDDING.qrs.intro;
  const qrGrid = document.getElementById('qr-grid');
  WEDDING.qrs.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'qr-card';
    div.setAttribute('role', 'link');
    div.setAttribute('tabindex', '0');
    div.innerHTML = `
      <div class="qr-placeholder">${item.icon}</div>
      <span class="qr-title">${item.title}</span>
      <span class="qr-desc">${item.desc}</span>`;
    div.addEventListener('click', () => { if(item.link && item.link !== 'LINK_JAM_PLAYLIST' && item.link !== 'LINK_ALBUM_FOTOS' && item.link !== 'LINK_BUZON_DESEOS') window.open(item.link,'_blank'); });
    qrGrid.appendChild(div);
  });

  // Footer
  document.getElementById('footer-date-text').textContent = WEDDING.footer.dateText;
  const contactsEl = document.getElementById('footer-contacts');
  WEDDING.footer.contacts.forEach(c => {
    const a = document.createElement('a');
    a.href      = c.link;
    a.className = 'footer-contact';
    a.innerHTML = `<span>${c.icon}</span><span>${c.label}: ${c.value}</span>`;
    contactsEl.appendChild(a);
  });

  // Audio
  if (WEDDING.audioSrc) {
    const audio = new Audio(WEDDING.audioSrc);
    audio.loop   = true;
    let playing  = false;
    const btn    = document.getElementById('audio-toggle');
    btn.addEventListener('click', () => {
      if (playing) { audio.pause(); btn.textContent = '🎵'; }
      else         { audio.play();  btn.textContent = '🔇'; }
      playing = !playing;
    });
  }
})();

/* ======================================================
   C. COUNTDOWN
====================================================== */
function updateCountdown() {
  const target = new Date(WEDDING.weddingDateISO).getTime();
  const now    = Date.now();
  const diff   = Math.max(0, target - now);

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ======================================================
   D. NAVEGACI N POR SECCIONES
     CSS scroll-snap (scroll-snap-align: start en .section)
     maneja el avance automático sección a sección.
     Los dots usan goToSection/scrollIntoView.
====================================================== */
const sections   = Array.from(document.querySelectorAll('.section'));
const totalSects = sections.length;
let current      = 0;

function goToSection(idx) {
  if (idx < 0 || idx >= totalSects) return;
  current = idx;
  sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateDots();
}

function detectCurrent() {
  const mid = window.scrollY + window.innerHeight / 2;
  sections.forEach((s, i) => {
    if (mid >= s.offsetTop && mid < s.offsetTop + s.offsetHeight) current = i;
  });
}

/* ======================================================
   E. DOTS DE NAVEGACI N LATERAL
====================================================== */
const dotsContainer = document.getElementById('section-dots');
sections.forEach((s, i) => {
  const btn = document.createElement('button');
  btn.className  = 'section-dot' + (i === 0 ? ' active' : '');
  btn.title      = s.dataset.label || `Sección ${i+1}`;
  btn.setAttribute('aria-label', s.dataset.label || `Ir a sección ${i+1}`);
  btn.addEventListener('click', () => goToSection(i));
  dotsContainer.appendChild(btn);
});

function updateDots() {
  document.querySelectorAll('.section-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

/* Observador de intersecci n para actualizar dots y fade-in */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = sections.indexOf(entry.target);
      if (idx !== -1) { current = idx; updateDots(); }
      // Fade-in de hijos
      entry.target.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

/* ======================================================
   F. BARRA DE PROGRESO DE SCROLL
====================================================== */
const scrollEl = document.documentElement; // scroll vive aqu  con scroll-snap en body

function onScroll() {
  const scrollTop = scrollEl.scrollTop || document.body.scrollTop || window.scrollY;
  const docHeight = scrollEl.scrollHeight - scrollEl.clientHeight;
  const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.getElementById('scroll-progress').style.width = progress + '%';
  document.getElementById('nav').classList.toggle('scrolled', scrollTop > 20);
}

window.addEventListener('scroll', onScroll, { passive: true });
document.body.addEventListener('scroll', onScroll, { passive: true });

/* ======================================================
   G. MEN  HAMBURGUESA
====================================================== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ======================================================
   H. PRIMERA SECCI N   activar fade-in sin scroll
====================================================== */
document.querySelectorAll('#save-the-date .fade-in').forEach(el => el.classList.add('visible'));

/* ======================================================
   J. FADE-IN DE IM GENES AL CARGAR
====================================================== */
document.querySelectorAll('.section-img').forEach(img => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load',  () => img.classList.add('loaded'));
    img.addEventListener('error', () => img.closest('.section-img-wrap')
      ?.querySelector('.section-img-placeholder')?.style.setProperty('display','flex'));
  }
});

/* ======================================================
   K. ROSE CORNERS – definidas en el HTML por sección
====================================================== */
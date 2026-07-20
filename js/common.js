/* ======================================================
   COMMON – Comportamientos transversales de la UI
   ──────────────────────────────────────────────────────
   Navegación entre secciones, dots laterales, barra de
   progreso de scroll, menú hamburguesa y carga de imágenes.
   No depende de config.js.
====================================================== */


/* ─────────────────────────────────────────────────────
   1. NAVEGACIÓN ENTRE SECCIONES
───────────────────────────────────────────────────── */
const sections   = Array.from(document.querySelectorAll('.section'));
const totalSects = sections.length;
let current      = 0;

function goToSection(idx) {
	if (idx < 0 || idx >= totalSects) {
		return;
	}
	current = idx;
	sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
	updateDots();
}

function detectCurrent() {
	const mid = window.scrollY + window.innerHeight / 2;
	sections.forEach(function(s, i) {
		if (mid >= s.offsetTop && mid < s.offsetTop + s.offsetHeight) {
			current = i;
		}
	});
}


/* ─────────────────────────────────────────────────────
   2. DOTS DE NAVEGACIÓN LATERAL
───────────────────────────────────────────────────── */
const dotsContainer = document.getElementById('section-dots');

sections.forEach(function(s, i) {
	const btn = document.createElement('button');
	btn.className = 'section-dot' + (i === 0 ? ' active' : '');
	btn.title     = s.dataset.label || ('Sección ' + (i + 1));
	btn.setAttribute('aria-label', s.dataset.label || ('Ir a sección ' + (i + 1)));
	btn.addEventListener('click', function() {
		goToSection(i);
	});
	dotsContainer.appendChild(btn);
});

function updateDots() {
	document.querySelectorAll('.section-dot').forEach(function(dot, i) {
		dot.classList.toggle('active', i === current);
	});
}

/* Observer: actualiza dots y activa fade-in al entrar en pantalla */
const sectionObserver = new IntersectionObserver(function(entries) {
	entries.forEach(function(entry) {
		if (!entry.isIntersecting) {
			return;
		}
		const idx = sections.indexOf(entry.target);
		if (idx !== -1) {
			current = idx;
			updateDots();
		}
		entry.target.querySelectorAll('.fade-in').forEach(function(el) {
			el.classList.add('visible');
		});
	});
}, { threshold: 0.4 });

sections.forEach(function(s) {
	sectionObserver.observe(s);
});


/* ─────────────────────────────────────────────────────
   3. BARRA DE PROGRESO DE SCROLL
───────────────────────────────────────────────────── */
const scrollProgressEl = document.getElementById('scroll-progress');
const navEl            = document.getElementById('nav');

function onScroll() {
	const scrollEl  = document.documentElement;
	const scrollTop = scrollEl.scrollTop || document.body.scrollTop || window.scrollY;
	const docHeight = scrollEl.scrollHeight - scrollEl.clientHeight;
	const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
	scrollProgressEl.style.width = progress + '%';
	navEl.classList.toggle('scrolled', scrollTop > 20);
}

window.addEventListener('scroll', onScroll, { passive: true });
document.body.addEventListener('scroll', onScroll, { passive: true });


/* ─────────────────────────────────────────────────────
   4. MENÚ HAMBURGUESA (móvil)
───────────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', function() {
	const open = hamburger.classList.toggle('open');
	mobileMenu.classList.toggle('open', open);
	hamburger.setAttribute('aria-expanded', String(open));
});

mobileMenu.querySelectorAll('a').forEach(function(a) {
	a.addEventListener('click', function() {
		hamburger.classList.remove('open');
		mobileMenu.classList.remove('open');
		hamburger.setAttribute('aria-expanded', 'false');
	});
});


/* ─────────────────────────────────────────────────────
   5. PRIMERA SECCIÓN: activar fade-in sin esperar scroll
───────────────────────────────────────────────────── */
document.querySelectorAll('#save-the-date .fade-in').forEach(function(el) {
	el.classList.add('visible');
});


/* ─────────────────────────────────────────────────────
   6. FADE-IN DE IMÁGENES AL CARGAR
───────────────────────────────────────────────────── */
document.querySelectorAll('.section-img').forEach(function(img) {
	if (img.complete) {
		img.classList.add('loaded');
	} else {
		img.addEventListener('load', function() {
			img.classList.add('loaded');
		});
		img.addEventListener('error', function() {
			const wrap = img.closest('.section-img-wrap');
			if (wrap) {
				const placeholder = wrap.querySelector('.section-img-placeholder');
				if (placeholder) {
					placeholder.style.setProperty('display', 'flex');
				}
			}
		});
	}
});

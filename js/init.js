/* ======================================================
   INICIALIZACIÓN – Poblar DOM desde config.js
   ──────────────────────────────────────────────────────
   Lee la constante WEDDING (config.js) y el invitado
   (js/guest.js → guests.json) e inyecta en el HTML todos
   los textos, links y listas. El HTML solo trae el
   esqueleto: no lleva textos propios.

   Marcas que entiende en el HTML:
   • data-t="ruta.en.WEDDING"    → pone ese texto en el elemento
   • data-href="ruta.en.WEDDING" → pone ese valor como href
   Rutas especiales (no existen en WEDDING, se calculan):
   couple, groomInitial, brideInitial, footerSignature.

   Depende de: config.js y js/guest.js (deben cargarse antes)
====================================================== */

(function init() {

	const PLACEHOLDER_LINK_PREFIX = 'LINK_';
	const DEADLINE_TOKEN          = /%deadline%/g;
	const NAME_TOKEN              = /%name%/g;
	const BOLD_MARK               = '**';
	const NEW_LINE                = '\n';

	const DERIVED = {
		couple:          WEDDING.groom + ' & ' + WEDDING.bride,
		groomInitial:    WEDDING.groom.charAt(0),
		brideInitial:    WEDDING.bride.charAt(0),
		footerSignature: WEDDING.groom + ' · & · ' + WEDDING.bride,
	};

	/* ── Utilidades de texto ─────────────────────────── */

	function getPath(path) {
		let value = DERIVED[path];
		if (value === undefined) {
			value = path.split('.').reduce(function(obj, key) {
				return obj === undefined || obj === null ? undefined : obj[key];
			}, WEDDING);
		}
		return value;
	}

	// Un texto puede ser string o { single, plural[, anonymous] } según el invitado.
	// "anonymous" se usa cuando no hay nombre (la URL no trae código).
	function pick(value, guest) {
		let text = value;
		if (value !== null && typeof value === 'object') {
			if (!guest.name && value.anonymous !== undefined) {
				text = value.anonymous;
			} else {
				text = guest.single !== false ? value.single : value.plural;
			}
		}
		return text === undefined || text === null
			? ''
			: String(text).replace(DEADLINE_TOKEN, WEDDING.rsvp.deadline).replace(NAME_TOKEN, guest.name || '');
	}

	// Escribe el texto con saltos de línea ('\n') y negrita (**...**), sin innerHTML.
	function fillRich(el, text) {
		el.textContent = '';
		text.split(NEW_LINE).forEach(function(line, lineIndex) {
			if (lineIndex > 0) {
				el.appendChild(document.createElement('br'));
			}
			line.split(BOLD_MARK).forEach(function(part, partIndex) {
				if (part === '') {
					return;
				}
				if (partIndex % 2 === 1) {
					const strong = document.createElement('strong');
					strong.textContent = part;
					el.appendChild(strong);
				} else {
					el.appendChild(document.createTextNode(part));
				}
			});
		});
	}

	function createEl(tag, className, text) {
		const el = document.createElement(tag);
		if (className) {
			el.className = className;
		}
		if (text !== undefined) {
			el.textContent = text;
		}
		return el;
	}

	/* ── Partes que no dependen del invitado (se hacen una vez) ── */

	function buildStatic() {
		const weddingDate = new Date(WEDDING.weddingDateISO);

		document.getElementById('wedding-date-display').textContent = WEDDING.weddingDateDisplay;
		document.getElementById('date-day').textContent   = weddingDate.getDate();
		document.getElementById('date-month').textContent = 'de ' + weddingDate.toLocaleDateString('es-CO', { month: 'long' });
		document.getElementById('date-year').textContent  = '— ' + weddingDate.getFullYear() + ' —';
		document.getElementById('date-location').textContent = WEDDING.weddingLocation;

		document.querySelectorAll('[data-href]').forEach(function(a) {
			a.href = getPath(a.dataset.href);
		});

		buildNav();
	}

	// Menú de escritorio, menú móvil y etiquetas de los puntos laterales.
	// Debe correr antes de js/common.js, que engancha los eventos a estos elementos.
	function buildNav() {
		const navLinks   = document.getElementById('nav-links');
		const mobileMenu = document.getElementById('mobile-menu');

		WEDDING.nav.forEach(function(item) {
			const li = document.createElement('li');
			const a  = createEl('a', '', item.label);
			a.href = '#' + item.id;
			li.appendChild(a);
			navLinks.appendChild(li);

			const m = createEl('a', '', item.icon + ' ' + (item.mobileLabel || item.label));
			m.href = '#' + item.id;
			mobileMenu.appendChild(m);

			document.getElementById(item.id).dataset.label = item.label;
		});
	}

	/* ── Partes que dependen del invitado (se rehacen al resolver guests.json) ── */

	function renderGreeting(guest) {
		const greetEl = document.getElementById('guest-greeting');
		greetEl.textContent = '';
		if (guest.name) {
			greetEl.appendChild(createEl('span', 'guest-name', guest.name + ','));
		} else {
			greetEl.textContent = pick(WEDDING.hero.greetingFallback, guest);
		}
	}

	function renderRecommendations(guest) {
		const recList = document.getElementById('rec-list');
		recList.textContent = '';
		WEDDING.recommendations.items.forEach(function(item, i) {
			const li = createEl('li', 'rec-item');
			const p  = createEl('p', 'rec-text');
			const icon = createEl('span', '', item.icon);
			icon.style.marginRight = '.4rem';
			p.appendChild(icon);
			p.appendChild(document.createTextNode(pick(item.text, guest)));
			li.appendChild(createEl('span', 'rec-num', String(i + 1).padStart(2, '0')));
			li.appendChild(p);
			recList.appendChild(li);
		});
	}

	function renderDressCode(guest) {
		const dressGrid = document.getElementById('dress-grid');
		dressGrid.textContent = '';
		WEDDING.dresscode.items.forEach(function(item) {
			const div = createEl('div', 'dress-item');
			div.appendChild(createEl('span', 'dress-icon', item.icon));
			div.appendChild(createEl('span', 'dress-title', pick(item.title, guest)));
			div.appendChild(createEl('span', 'dress-desc', pick(item.desc, guest)));

			if (item.swatches && item.swatches.length) {
				const palette = createEl('div', 'color-palette');
				item.swatches.forEach(function(color) {
					const swatch = createEl('div', 'color-swatch');
					swatch.style.background = color;
					swatch.title = color;
					palette.appendChild(swatch);
				});
				div.appendChild(palette);
			}

			dressGrid.appendChild(div);
		});
	}

	function renderQrs(guest) {
		const qrGrid = document.getElementById('qr-grid');
		qrGrid.textContent = '';
		WEDDING.qrs.items.forEach(function(item) {
			const div = createEl('div', 'qr-card');
			div.setAttribute('role', 'link');
			div.setAttribute('tabindex', '0');
			div.appendChild(createEl('div', 'qr-placeholder', item.icon));
			div.appendChild(createEl('span', 'qr-title', pick(item.title, guest)));
			div.appendChild(createEl('span', 'qr-desc', pick(item.desc, guest)));
			div.addEventListener('click', function() {
				if (item.link && item.link.indexOf(PLACEHOLDER_LINK_PREFIX) !== 0) {
					window.open(item.link, '_blank');
				}
			});
			qrGrid.appendChild(div);
		});
	}

	function renderGuest(guest) {
		document.querySelectorAll('[data-t]').forEach(function(el) {
			fillRich(el, pick(getPath(el.dataset.t), guest));
		});
		renderGreeting(guest);
		renderRecommendations(guest);
		renderDressCode(guest);
		renderQrs(guest);
	}

	/* ── Arranque ────────────────────────────────────── */

	buildStatic();

	// Se pinta de inmediato con la versión genérica (sin nombre, singular) para
	// que la página nunca se vea con huecos si guests.json tarda en cargar
	// (internet lento) o falla; se repinta al resolver el código ?codigo=XXXX.
	renderGuest({ name: '', single: true });
	getGuestData().then(renderGuest);

	/* ── Audio de fondo ──────────────────────────────── */
	if (WEDDING.audioSrc) {
		const audio  = new Audio(WEDDING.audioSrc);
		audio.loop   = true;
		let playing  = false;
		let pausedByVisibility = false;
		const btn    = document.getElementById('audio-toggle');

		// La portada "toca para abrir" llama a esto desde un click real del
		// usuario, que es lo que permite al navegador reproducir con sonido.
		window.startWeddingAudio = function() {
			audio.play().then(function() {
				playing = true;
				btn.textContent = '🔇';
			}).catch(function() {});
		};

		btn.addEventListener('click', function() {
			if (playing) {
				audio.pause();
				btn.textContent = '🎵';
			} else {
				audio.play();
				btn.textContent = '🔇';
			}
			playing = !playing;
		});

		document.addEventListener('visibilitychange', function() {
			if (document.hidden) {
				if (playing) {
					audio.pause();
					pausedByVisibility = true;
				}
			} else if (pausedByVisibility) {
				pausedByVisibility = false;
				audio.play();
			}
		});
	}

})();

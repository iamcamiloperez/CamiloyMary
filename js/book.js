/* ======================================================
   LIBRO – pasar páginas (solo invitacion-libro.html)
   ──────────────────────────────────────────────────────
   El libro abierto es una doble página con el lomo al
   centro. Cada .leaf ocupa la mitad derecha: su frente es
   una página derecha y su reverso, al voltearla, la página
   izquierda siguiente.

   "k" es la página enfocada:
     0      tapa (libro cerrado)
     impar  página derecha  (frente de una hoja / contratapa)
     par    página izquierda (reverso de una hoja)
   Hojas volteadas para mostrar k: 0 si k = 0, si no 1 + ⌊k/2⌋.

   Móvil: se ve una página y la "cámara" se corre al lado
   enfocado. Siguiente desde una página derecha = pasar la
   hoja (y la cámara acompaña a la izquierda); desde una
   izquierda = solo recorrer hacia la derecha.
   Escritorio: se ve la doble página y se avanza de a una
   doble página (k siempre impar, o 0).

   Depende de: config.js, js/guest.js y js/init.js
====================================================== */

(function book() {

	const TURN_MS         = 1400;   // igual a --turn-time en css/book.css
	const PAN_MS          = 1000;   // recorrido de la cámara sin pasar hoja
	const STAGGER_MS      = 280;    // entre hojas al saltar varias páginas
	const PREP_MS         = 50;     // tiempo para preparar la capa 3D antes de girar
	const REVEAL_AT       = 0.5;    // fracción del giro en que aparece el contenido
	const PEEK_IDLE_MS    = 3500;   // espera antes de "asomar" la página
	const PEEK_REPEAT_MS  = 6500;
	const SWIPE_MIN_PX    = 50;
	const EDGE_ZONE       = 0.3;    // fracción del ancho visible que cuenta como "borde"
	const DUST_COUNT      = 16;
	const DUST_LIFE_MS    = 2200;
	const SCROLL_SLACK_PX = 12;
	const AUTO_BASE_MS    = 7000;   // pase automático: tiempo fijo por página…
	const AUTO_WORD_MS    = 320;    // …más este tiempo por palabra visible (≈ lectura pausada)
	const AUTO_MIN_MS     = 10000;
	const AUTO_MAX_MS     = 32000;
	const AUTO_STEP_MIN_MS = 6000;  // mínimo entre bajadas automáticas en páginas largas
	const AUTO_SCROLL_FRACTION = 0.85;
	const GUTTER_PX       = 10;     // margen a cada lado en móvil (deja asomar la página vecina)
	const MOBILE_MAX_W    = 480;
	const DESKTOP_PAGE_W  = 440;
	const DESKTOP_W_RATIO = 0.44;
	const DESKTOP_H_RATIO = 0.88;
	const DESKTOP_MAX_H   = 780;
	const INTERACTIVE     = 'a, button, input, select, textarea, [role="link"], .bookmark';
	const PAGE_NUM_OPEN   = '— ';
	const PAGE_NUM_CLOSE  = ' —';
	const PAGE_NUM_JOIN   = ' · ';

	const stage       = document.getElementById('book-stage');
	const bookEl      = document.getElementById('book');
	const hud         = document.getElementById('book-hud');
	const leaves      = Array.from(bookEl.querySelectorAll('.leaf'));
	const backCover   = bookEl.querySelector('.back-cover');
	const coverEl     = document.getElementById('cover-screen');
	const pageNumEl   = document.getElementById('page-num');
	const swipeHintEl = document.getElementById('swipe-hint');
	const bookmark    = document.getElementById('bookmark');
	const turnNextEl  = document.getElementById('turn-next');
	const desktopMq   = window.matchMedia('(min-width: 900px)');
	const reduced     = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Caras en orden de lectura: tapa, p1 (frente hoja 1), p2 (reverso hoja 1)… contratapa
	const faces = [leaves[0].querySelector('.leaf-front')];
	leaves.slice(1).forEach(function(leaf) {
		faces.push(leaf.querySelector('.leaf-front'), leaf.querySelector('.leaf-back'));
	});
	faces.push(backCover);
	const LAST      = faces.length - 1;
	const guardFace = leaves[0].querySelector('.leaf-back');

	let k             = 0;
	let pageW         = 0;
	let busy          = false;
	let peekTimer     = null;
	let autoTimer     = null;
	let audioStarted  = false;
	let suppressClick = false;
	let pointerStart  = null;

	/* ── Numeración de capítulos: "Capítulo I", "Capítulo II"… ── */

	const ROMAN = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];

	function toRoman(num) {
		let rest   = num;
		let result = '';
		ROMAN.forEach(function(pair) {
			while (rest >= pair[0]) {
				result += pair[1];
				rest   -= pair[0];
			}
		});
		return result;
	}

	document.querySelectorAll('[data-chapter]').forEach(function(el, i) {
		el.textContent = WEDDING.book.chapterWord + ' ' + toRoman(i + 1);
	});

	/* ── Modelo ──────────────────────────────────────── */

	function isDesktop() {
		return desktopMq.matches;
	}

	function turnedFor(page) {
		return page === 0 ? 0 : 1 + Math.floor(page / 2);
	}

	function isLeftPage(page) {
		return page > 0 && page % 2 === 0;
	}

	// En escritorio solo existen la tapa y las páginas derechas (una por doble página)
	function normalize(page) {
		let p = Math.max(0, Math.min(LAST, page));
		if (isDesktop() && isLeftPage(p)) {
			p = Math.min(LAST, p + 1);
		}
		return p;
	}

	function visibleFaces(page) {
		const list = [faces[page]];
		if (isDesktop() && page > 0) {
			// A la izquierda de p1 está la guarda (reverso de la tapa), no la tapa
			list.push(page === 1 ? guardFace : faces[page - 1]);
		}
		return list;
	}

	/* ── Medidas y cámara (en píxeles enteros para que el texto no se vea borroso) ── */

	function layout() {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		let pageH;
		if (isDesktop()) {
			pageW = Math.round(Math.min(DESKTOP_PAGE_W, vw * DESKTOP_W_RATIO));
			pageH = Math.round(Math.min(vh * DESKTOP_H_RATIO, DESKTOP_MAX_H));
		} else {
			pageW = Math.min(vw - GUTTER_PX * 2, MOBILE_MAX_W);
			pageH = vh - GUTTER_PX * 2;
		}
		bookEl.style.setProperty('--page-w', pageW + 'px');
		bookEl.style.setProperty('--page-h', pageH + 'px');
		bookEl.style.left = Math.round((vw - pageW * 2) / 2) + 'px';
		bookEl.style.top  = Math.round((vh - pageH) / 2) + 'px';
		hud.style.top     = bookEl.style.top;
		hud.style.height  = pageH + 'px';
		placeCamera(k, 0);
	}

	// Dónde mirar: una página centrada (móvil y tapa) o la doble página (escritorio abierto)
	function placeCamera(page, durationMs) {
		const vw       = window.innerWidth;
		const half     = Math.round(pageW / 2);
		const showBoth = isDesktop() && page > 0;
		let camX       = -half;
		if (showBoth) {
			camX = 0;
		} else if (isLeftPage(page)) {
			camX = half;
		}
		bookEl.style.setProperty('--cam-time', durationMs + 'ms');
		bookEl.style.setProperty('--cam-x', camX + 'px');

		const hudW = showBoth ? pageW * 2 : pageW;
		hud.style.width = hudW + 'px';
		hud.style.left  = Math.round((vw - hudW) / 2) + 'px';
	}

	/* ── Estado visible ──────────────────────────────── */

	function stackLeaves() {
		const total = leaves.length;
		leaves.forEach(function(leaf, i) {
			if (!leaf.classList.contains('turning')) {
				leaf.style.zIndex = leaf.classList.contains('turned') ? i + 2 : total * 2 - i;
			}
		});
	}

	function updateUI() {
		const turned  = turnedFor(k);
		const visible = visibleFaces(k);

		stage.classList.toggle('is-cover', k === 0);
		stage.classList.toggle('is-first', k === 1);
		stage.classList.toggle('is-end', k === LAST);
		document.body.classList.toggle('book-closed', k === 0);
		bookEl.style.setProperty('--s', String((leaves.length - turned) / leaves.length));
		bookEl.style.setProperty('--r', String(turned / leaves.length));

		leaves.forEach(function(leaf, i) {
			leaf.classList.toggle('on-left', i === turned - 1);
		});

		faces.forEach(function(face) {
			const shown = visible.indexOf(face) !== -1;
			face.inert = !shown;
			face.classList.toggle('focused', shown);
		});

		let label = '';
		if (k > 0 && k < LAST) {
			label = isDesktop() && k > 1 ? (k - 1) + PAGE_NUM_JOIN + k : String(k);
			label = PAGE_NUM_OPEN + label + PAGE_NUM_CLOSE;
		}
		pageNumEl.textContent = label;
		bookmark.classList.remove('open');
	}

	function revealPage() {
		visibleFaces(k).forEach(function(face) {
			face.querySelectorAll('.fade-in').forEach(function(el) {
				el.classList.add('visible');
			});
		});
		updateSwipeHint();
	}

	// "desliza ↓" solo si la página enfocada no cabe completa y aún no llegó al final
	function updateSwipeHint() {
		const scroller = faces[k].querySelector('.page-scroll');
		let show       = false;
		if (scroller) {
			const overflow = scroller.scrollHeight - scroller.clientHeight;
			show = overflow > SCROLL_SLACK_PX && scroller.scrollTop < overflow - SCROLL_SLACK_PX;
		}
		swipeHintEl.classList.toggle('show', show);
	}

	faces.forEach(function(face) {
		const scroller = face.querySelector('.page-scroll');
		if (scroller) {
			scroller.addEventListener('scroll', updateSwipeHint, { passive: true });
		}
	});

	/* ── Pasar hojas ─────────────────────────────────── */

	// Prepara el 3D de una hoja antes de girarla (ver "Nitidez" en css/book.css)
	function prepLeaf(leaf) {
		if (leaf) {
			leaf.classList.add('prep');
		}
	}

	// Deja pasar un par de cuadros para que el navegador rasterice la capa 3D
	// antes de empezar a moverla. Con setTimeout (y no requestAnimationFrame)
	// para que el ritmo no dependa de que la pestaña esté en primer plano.
	function nextFrames(callback) {
		window.setTimeout(callback, PREP_MS);
	}

	function turnLeaf(index, forward) {
		const leaf = leaves[index];
		prepLeaf(leaf);
		leaf.style.zIndex = String(leaves.length * 3);
		nextFrames(function() {
			leaf.classList.add('turning');
			leaf.classList.toggle('turned', forward);
			if (forward) {
				spawnFairyDust();
			}
		});
		window.setTimeout(function() {
			leaf.classList.remove('turning', 'prep');
			stackLeaves();
		}, PREP_MS + TURN_MS);
	}

	function goTo(target) {
		const next = normalize(target);
		if (busy || next === k) {
			return;
		}

		busy = true;
		stage.classList.add('is-busy');
		stopPeek();
		stopAuto();

		const fromTurned = turnedFor(k);
		const toTurned   = turnedFor(next);
		const forward    = toTurned > fromTurned;
		const steps      = Math.abs(toTurned - fromTurned);
		const turnSpan   = steps > 0 ? TURN_MS + (steps - 1) * STAGGER_MS : 0;
		const duration   = steps > 0 ? turnSpan : PAN_MS;

		for (let s = 0; s < steps; s++) {
			const index = forward ? fromTurned + s : fromTurned - 1 - s;
			window.setTimeout(function() {
				turnLeaf(index, forward);
			}, s * STAGGER_MS);
		}

		k = next;
		// La cámara arranca junto con el giro y dura lo mismo: la vista acompaña a la hoja
		nextFrames(function() {
			placeCamera(k, duration);
		});
		updateUI();

		const revealDelay = PREP_MS + (steps > 0 ? (steps - 1) * STAGGER_MS + TURN_MS * REVEAL_AT : PAN_MS * REVEAL_AT);
		window.setTimeout(revealPage, revealDelay);
		window.setTimeout(function() {
			busy = false;
			stage.classList.remove('is-busy');
			updateSwipeHint();
			schedulePeek();
			scheduleAuto();
		}, PREP_MS + duration + 30);
	}

	function step(direction) {
		const size = isDesktop() ? 2 : 1;
		let target = k + direction * size;
		if (isDesktop() && k === 0 && direction > 0) {
			target = 1;
		}
		if (isDesktop() && k === 1 && direction < 0) {
			target = 0;
		}
		goTo(target);
	}

	function nextPage() {
		startAudioOnce();
		step(1);
	}

	function prevPage() {
		step(-1);
	}

	// La música solo puede arrancar desde un gesto real del usuario (abrir la tapa)
	function startAudioOnce() {
		if (!audioStarted && window.startWeddingAudio) {
			audioStarted = true;
			window.startWeddingAudio();
		}
	}

	// La hoja que giraría con "siguiente" o "anterior" desde la página actual
	function candidateLeaves() {
		const turned = turnedFor(k);
		const list   = [];
		const goesForward = isDesktop() || k === 0 || !isLeftPage(k);
		const goesBack    = isDesktop() || isLeftPage(k);
		if (goesForward && turned < leaves.length) {
			list.push(leaves[turned]);
		}
		if (goesBack && turned > 0) {
			list.push(leaves[turned - 1]);
		}
		return list;
	}

	/* ── La página se "asoma" cuando nadie la toca ───── */

	function stopPeek() {
		window.clearTimeout(peekTimer);
		bookEl.classList.remove('cam-peek');
		leaves.forEach(function(leaf) {
			leaf.classList.remove('peek');
		});
	}

	function doPeek() {
		if (!busy) {
			const target = isLeftPage(k) && !isDesktop() ? bookEl : leaves[turnedFor(k)];
			const cls    = target === bookEl ? 'cam-peek' : 'peek';
			if (target) {
				target.classList.add(cls);
				target.addEventListener('animationend', function() {
					target.classList.remove(cls);
				}, { once: true });
			}
		}
		peekTimer = window.setTimeout(doPeek, PEEK_REPEAT_MS);
	}

	function schedulePeek() {
		stopPeek();
		if (!reduced && k < LAST) {
			peekTimer = window.setTimeout(doPeek, PEEK_IDLE_MS);
		}
	}

	/* ── Pase automático si nadie pasa la página ──────
	   Espera un tiempo según cuánto texto se ve; en páginas
	   largas primero baja de a una pantalla y al llegar al
	   final pasa la hoja. Cualquier toque, tecla o rueda del
	   ratón reinicia la espera. No arranca en la tapa (la
	   música necesita el gesto de abrirla) y para al final. */

	function scrollersInView() {
		return visibleFaces(k).slice().reverse().map(function(face) {
			return face.querySelector('.page-scroll');
		}).filter(Boolean);
	}

	function pendingScroller() {
		return scrollersInView().find(function(scroller) {
			return scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop > SCROLL_SLACK_PX;
		});
	}

	function readingTime() {
		const words = visibleFaces(k).reduce(function(total, face) {
			const text = face.innerText.trim();
			return total + (text ? text.split(/\s+/).length : 0);
		}, 0);
		return Math.min(AUTO_MAX_MS, Math.max(AUTO_MIN_MS, AUTO_BASE_MS + words * AUTO_WORD_MS));
	}

	// Si la página se lee en varias pantallas, el tiempo se reparte entre ellas
	function autoDelay() {
		const screens = scrollersInView().reduce(function(total, scroller) {
			return total + Math.max(1, Math.ceil(scroller.scrollHeight / scroller.clientHeight)) - 1;
		}, 1);
		return Math.max(AUTO_STEP_MIN_MS, Math.round(readingTime() / screens));
	}

	// La barrita del botón "pasa la página" se llena mientras corre la espera
	function showAutoProgress(ms) {
		turnNextEl.classList.remove('auto-run');
		if (ms > 0) {
			turnNextEl.style.setProperty('--auto-ms', ms + 'ms');
			void turnNextEl.offsetWidth;
			turnNextEl.classList.add('auto-run');
		}
	}

	function stopAuto() {
		window.clearTimeout(autoTimer);
		showAutoProgress(0);
	}

	function scheduleAuto() {
		stopAuto();
		if (k > 0 && k < LAST && !document.hidden) {
			const ms = autoDelay();
			autoTimer = window.setTimeout(doAuto, ms);
			showAutoProgress(ms);
		}
	}

	function doAuto() {
		const scroller = pendingScroller();
		if (busy || bookmark.classList.contains('open')) {
			scheduleAuto();
		} else if (scroller) {
			scroller.scrollBy({ top: Math.round(scroller.clientHeight * AUTO_SCROLL_FRACTION), behavior: reduced ? 'auto' : 'smooth' });
			scheduleAuto();
		} else {
			stopAuto();
			step(1);
		}
	}

	['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function(type) {
		document.addEventListener(type, function() {
			if (k > 0) {
				scheduleAuto();
			}
		}, { passive: true });
	});

	document.addEventListener('visibilitychange', scheduleAuto);

	/* ── Polvo de hada al pasar la hoja ──────────────── */

	function spawnFairyDust() {
		if (reduced) {
			return;
		}
		for (let i = 0; i < DUST_COUNT; i++) {
			const dust = document.createElement('span');
			dust.className = 'fairy-dust';
			dust.style.left = (40 + Math.random() * 40) + '%';
			dust.style.top  = (5 + Math.random() * 90) + '%';
			dust.style.setProperty('--dx', (-140 + Math.random() * 110) + 'px');
			dust.style.setProperty('--dy', (10 + Math.random() * 90) + 'px');
			dust.style.setProperty('--size', (2 + Math.random() * 4) + 'px');
			dust.style.animationDelay = Math.round(Math.random() * 600) + 'ms';
			bookEl.appendChild(dust);
			window.setTimeout(function() {
				dust.remove();
			}, DUST_LIFE_MS);
		}
	}

	/* ── Entradas: toques, deslizar, teclado, índice ─── */

	stage.addEventListener('click', function(e) {
		if (suppressClick || e.target.closest(INTERACTIVE)) {
			return;
		}
		schedulePeek();
		if (k === 0) {
			nextPage();
			return;
		}
		const rect = hud.getBoundingClientRect();
		if (e.clientX < rect.left + rect.width * EDGE_ZONE) {
			prevPage();
		} else if (e.clientX > rect.right - rect.width * EDGE_ZONE) {
			nextPage();
		}
	});

	// Al tocar, se prepara ya la hoja que podría girar: cuando llega el click
	// (≈100 ms después) la capa 3D ya está lista y el giro sale nítido.
	stage.addEventListener('pointerdown', function(e) {
		pointerStart = e.isPrimary ? { x: e.clientX, y: e.clientY } : null;
		if (!busy) {
			candidateLeaves().forEach(prepLeaf);
		}
	});

	stage.addEventListener('pointercancel', function() {
		pointerStart = null;
	});

	stage.addEventListener('pointerup', function(e) {
		if (!pointerStart) {
			return;
		}
		const dx = e.clientX - pointerStart.x;
		const dy = e.clientY - pointerStart.y;
		pointerStart = null;
		if (Math.abs(dx) > SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * 1.3) {
			suppressClick = true;
			window.setTimeout(function() {
				suppressClick = false;
			}, 400);
			if (dx < 0) {
				nextPage();
			} else {
				prevPage();
			}
		}
	});

	document.addEventListener('keydown', function(e) {
		if (e.key === 'ArrowRight' || e.key === 'PageDown') {
			nextPage();
		} else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
			prevPage();
		} else if (e.key === 'Escape') {
			bookmark.classList.remove('open');
		}
	});

	coverEl.addEventListener('keydown', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			nextPage();
		}
	});

	turnNextEl.addEventListener('click', nextPage);
	document.getElementById('turn-prev').addEventListener('click', prevPage);
	document.getElementById('book-restart').addEventListener('click', function() {
		goTo(1);
	});

	bookEl.addEventListener('click', function(e) {
		if (e.target.classList.contains('dog-ear')) {
			nextPage();
		}
	});

	const bookmarkToggle = document.getElementById('bookmark-toggle');
	bookmarkToggle.addEventListener('click', function() {
		const open = bookmark.classList.toggle('open');
		bookmarkToggle.setAttribute('aria-expanded', String(open));
	});

	document.getElementById('nav-links').addEventListener('click', function(e) {
		const link = e.target.closest('a');
		if (link) {
			e.preventDefault();
			const target = document.getElementById(link.getAttribute('href').slice(1));
			const page   = faces.findIndex(function(face) {
				return face.contains(target);
			});
			if (page !== -1) {
				goTo(page);
			}
		}
	});

	// Oreja en las páginas derechas (frentes de las hojas de contenido)
	leaves.slice(1).forEach(function(leaf) {
		const ear = document.createElement('span');
		ear.className = 'dog-ear';
		ear.setAttribute('aria-hidden', 'true');
		leaf.querySelector('.leaf-front').appendChild(ear);
	});

	/* ── Nombre del invitado en la tapa (?code= / ?codigo=) ── */

	const coverGuestEl = document.getElementById('cover-guest');
	getGuestData().then(function(guest) {
		coverGuestEl.textContent = guest.name || '';
	});

	/* ── Arranque y cambios de tamaño ────────────────── */

	function onResize() {
		const normalized = normalize(k);
		if (normalized !== k && !busy) {
			// Al pasar de móvil a escritorio en una página izquierda: saltar a su doble página
			k = normalized;
			leaves.forEach(function(leaf, i) {
				leaf.classList.toggle('turned', i < turnedFor(k));
			});
			stackLeaves();
			updateUI();
			revealPage();
		}
		layout();
		updateUI();
		updateSwipeHint();
	}

	stackLeaves();
	layout();
	updateUI();
	schedulePeek();
	window.addEventListener('resize', onResize);
	desktopMq.addEventListener('change', onResize);

})();

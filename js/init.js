/* ======================================================
   INICIALIZACIÓN – Poblar DOM desde config.js
   ──────────────────────────────────────────────────────
   Lee la constante WEDDING (definida en config.js) e
   inyecta todos los textos, links y listas en el HTML.
   Depende de: config.js (debe cargarse antes)
====================================================== */

(function init() {

	/* ── Nombres de los novios ───────────────────────── */
	document.getElementById('name-groom').textContent = WEDDING.groom;
	document.getElementById('name-bride').textContent  = WEDDING.bride;

	/* ── Fecha de la boda ────────────────────────────── */
	document.getElementById('wedding-date-display').textContent = WEDDING.weddingDateDisplay;

	/* ── Saludo personalizado por código de invitado: ?codigo=XXXX (ver guests.json) ── */
	const greetEl = document.getElementById('guest-greeting');
	// Texto genérico de inmediato para que no se vea vacío si guests.json
	// tarda en cargar (internet lento) o falla; se reemplaza al resolver.
	greetEl.textContent = 'Con todo nuestro amor,';
	getGuestName().then(function (guestName) {
		greetEl.textContent = guestName
			? 'Querido/a ' + guestName + ','
			: 'Con todo nuestro amor,';
	});

	/* ── Ceremonia ───────────────────────────────────── */
	document.getElementById('ceremony-place').textContent   = WEDDING.ceremony.place;
	document.getElementById('ceremony-address').textContent = WEDDING.ceremony.address;
	document.getElementById('ceremony-date').textContent    = WEDDING.ceremony.date;
	document.getElementById('ceremony-time').textContent    = WEDDING.ceremony.time;
	document.querySelectorAll('a[href="LINK_MAPA_CEREMONIA"]').forEach(function(a) {
		a.href = WEDDING.ceremony.mapLink;
	});

	/* ── Recepción ───────────────────────────────────── */
	document.getElementById('reception-place').textContent   = WEDDING.reception.place;
	document.getElementById('reception-address').textContent = WEDDING.reception.address;
	document.getElementById('reception-date').textContent    = WEDDING.reception.date;
	document.getElementById('reception-time').textContent    = WEDDING.reception.time;
	document.querySelectorAll('a[href="LINK_MAPA_RECEPCION"]').forEach(function(a) {
		a.href = WEDDING.reception.mapLink;
	});

	/* ── Confirmación de asistencia (RSVP) ───────────── */
	document.getElementById('rsvp-deadline').textContent = WEDDING.rsvp.deadline;
	document.querySelector('#asistencia .section-body').innerHTML =
		WEDDING.rsvp.message.replace('%deadline%', '<strong>' + WEDDING.rsvp.deadline + '</strong>');
	document.querySelectorAll('a[href="LINK_FORMULARIO_ASISTENCIA"]').forEach(function(a) {
		a.href = WEDDING.rsvp.formLink;
	});

	/* ── Recomendaciones ─────────────────────────────── */
	const recList = document.getElementById('rec-list');
	WEDDING.recommendations.forEach(function(item, i) {
		const li = document.createElement('li');
		li.className = 'rec-item';
		li.innerHTML =
			'<span class="rec-num">' + String(i + 1).padStart(2, '0') + '</span>' +
			'<p class="rec-text"><span style="margin-right:.4rem">' + item.icon + '</span>' + item.text + '</p>';
		recList.appendChild(li);
	});

	/* ── Dress code ──────────────────────────────────── */
	document.getElementById('dresscode-main').textContent = WEDDING.dresscode.main;
	document.getElementById('dresscode-note').textContent = WEDDING.dresscode.note;
	const dressGrid = document.getElementById('dress-grid');
	WEDDING.dresscode.items.forEach(function(item) {
		const swatchHTML = item.swatches.map(function(color) {
			return '<div class="color-swatch" style="background:' + color + '" title="' + color + '"></div>';
		}).join('');
		const div = document.createElement('div');
		div.className = 'dress-item';
		div.innerHTML =
			'<span class="dress-icon">'  + item.icon  + '</span>' +
			'<span class="dress-title">' + item.title + '</span>' +
			'<span class="dress-desc">'  + item.desc  + '</span>' +
			'<div class="color-palette">' + swatchHTML + '</div>';
		dressGrid.appendChild(div);
	});

	/* ── QRs / Recuerdos ─────────────────────────────── */
	document.getElementById('qr-intro').textContent = WEDDING.qrs.intro;
	const qrGrid = document.getElementById('qr-grid');
	WEDDING.qrs.items.forEach(function(item) {
		const PLACEHOLDER_LINKS = ['LINK_JAM_PLAYLIST', 'LINK_ALBUM_FOTOS', 'LINK_BUZON_DESEOS'];
		const div = document.createElement('div');
		div.className = 'qr-card';
		div.setAttribute('role', 'link');
		div.setAttribute('tabindex', '0');
		div.innerHTML =
			'<div class="qr-placeholder">' + item.icon  + '</div>' +
			'<span class="qr-title">'      + item.title + '</span>' +
			'<span class="qr-desc">'       + item.desc  + '</span>';
		div.addEventListener('click', function() {
			if (item.link && !PLACEHOLDER_LINKS.includes(item.link)) {
				window.open(item.link, '_blank');
			}
		});
		qrGrid.appendChild(div);
	});

	/* ── Footer ──────────────────────────────────────── */
	document.getElementById('footer-date-text').textContent = WEDDING.footer.dateText;
	const contactsEl = document.getElementById('footer-contacts');
	WEDDING.footer.contacts.forEach(function(c) {
		const a = document.createElement('a');
		a.href      = c.link;
		a.className = 'footer-contact';
		a.innerHTML = '<span>' + c.icon + '</span><span>' + c.label + ': ' + c.value + '</span>';
		contactsEl.appendChild(a);
	});

	/* ── Audio de fondo ──────────────────────────────── */
	if (WEDDING.audioSrc) {
		const audio  = new Audio(WEDDING.audioSrc);
		audio.loop   = true;
		let playing  = false;
		const btn    = document.getElementById('audio-toggle');
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
	}

})();

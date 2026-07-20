/* ======================================================
   CÓDIGOS DE INVITADOS
   ──────────────────────────────────────────────────────
   Resuelve el parámetro ?codigo=XXXX (o ?code=XXXX) de la
   URL contra guests.json y devuelve el nombre del invitado.
   Para agregar o cambiar invitados, edita solo guests.json
   (no hace falta tocar este archivo).

   Nota: requiere servir el sitio con un servidor local o
   real (npx serve ., Live Server, o el hosting final) —
   fetch() no puede leer guests.json si abres el HTML
   directamente con file://.
====================================================== */

function getGuestName() {
	const params = new URLSearchParams(window.location.search);
	const code   = (params.get('codigo') || params.get('code') || '').trim();

	if (!code) {
		return Promise.resolve('');
	}

	return fetch('guests.json', { cache: 'no-store' })
		.then(function (res) { return res.json(); })
		.then(function (guests) { return guests[code] || ''; })
		.catch(function (err) {
			console.error('No se pudo leer guests.json:', err);
			return '';
		});
}

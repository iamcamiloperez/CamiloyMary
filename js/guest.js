/* ======================================================
   CÓDIGOS DE INVITADOS
   ──────────────────────────────────────────────────────
   Resuelve el parámetro ?codigo=XXXX (o ?code=XXXX) de la
   URL contra guests.json y devuelve los datos del invitado:
   { name, single }. "single" indica si se invitó a una
   sola persona (tú/guarda) o a una pareja/grupo (ustedes/
   guarden). Para agregar o cambiar invitados, edita solo
   guests.json (no hace falta tocar este archivo).

   Nota: requiere servir el sitio con un servidor local o
   real (npx serve ., Live Server, o el hosting final) —
   fetch() no puede leer guests.json si abres el HTML
   directamente con file://.
====================================================== */

function getGuestData() {
	const params = new URLSearchParams(window.location.search);
	const code   = (params.get('codigo') || params.get('code') || '').trim();
	const empty  = { name: '', single: true };

	if (!code) {
		return Promise.resolve(empty);
	}

	return fetch('guests.json', { cache: 'no-store' })
		.then(function (res) { return res.json(); })
		.then(function (guests) {
			const guest = guests[code];
			return guest ? { name: guest.name, single: guest.single } : empty;
		})
		.catch(function (err) {
			console.error('No se pudo leer guests.json:', err);
			return empty;
		});
}

function getGuestName() {
	return getGuestData().then(function (guest) { return guest.name; });
}

/* ======================================================
   CUENTA REGRESIVA
   Depende de: config.js → WEDDING.weddingDateISO
====================================================== */

function updateCountdown() {
	const target = new Date(WEDDING.weddingDateISO).getTime();
	const now    = Date.now();
	const diff   = Math.max(0, target - now);

	const days  = Math.floor(diff / 86400000);
	const hours = Math.floor((diff % 86400000) / 3600000);
	const mins  = Math.floor((diff % 3600000)  / 60000);
	const secs  = Math.floor((diff % 60000)    / 1000);

	document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
	document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
	document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
	document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

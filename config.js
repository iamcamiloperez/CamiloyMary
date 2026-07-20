/* ======================================================
   CONFIGURACIÓN DE LA BODA
   ──────────────────────────────────────────────────────
   Este es el ÚNICO archivo que necesitas editar para
   personalizar la invitación: nombres, fechas, lugares,
   links, textos, colores de paleta y audio.

   No es necesario tocar index.html, CSS ni otros scripts.
====================================================== */

const WEDDING = {

	/* ──────────────────────────────────────────────────
	   NOVIOS
	────────────────────────────────────────────────── */
	groom: 'Camilo',
	bride:  'Maritza',

	/* ──────────────────────────────────────────────────
	   FECHA DE LA BODA
	   weddingDateISO     → formato ISO 8601 (para el countdown)
	                        Año-Mes-DíaTHora:Min  ej. 2026-11-14T17:00:00
	   weddingDateDisplay → texto visible en la invitación
	────────────────────────────────────────────────── */
	weddingDateISO:     '2026-11-14T17:00:00',
	weddingDateDisplay: 'Sábado, 14 de noviembre de 2026',

	/* ──────────────────────────────────────────────────
	   CEREMONIA
	────────────────────────────────────────────────── */
	ceremony: {
		place:   'Nombre de la Iglesia / Capilla',
		address: 'Dirección de la ceremonia, Bogotá',
		date:    'Sábado, 14 de noviembre de 2026',
		time:    '3:00 p.m.',
		mapLink: 'LINK_MAPA_CEREMONIA',
	},

	/* ──────────────────────────────────────────────────
	   RECEPCIÓN
	────────────────────────────────────────────────── */
	reception: {
		place:   'Nombre del salón / hacienda',
		address: 'Dirección de la recepción, Bogotá',
		date:    'Sábado, 14 de noviembre de 2026',
		time:    '5:00 p.m. – 2:00 a.m.',
		mapLink: 'LINK_MAPA_RECEPCION',
	},

	/* ──────────────────────────────────────────────────
	   CONFIRMACIÓN DE ASISTENCIA
	   En el texto usa %deadline% como marcador de posición.
	────────────────────────────────────────────────── */
	rsvp: {
		deadline: '31 de enero de 2026',
		formLink: 'LINK_FORMULARIO_ASISTENCIA',
		message:  'Por favor confirma tu asistencia antes del %deadline%. En el formulario encontrarás información útil sobre transporte, alimentación, bebidas y hospedaje.',
	},

	/* ──────────────────────────────────────────────────
	   RECOMENDACIONES
	   Agrega, elimina o reordena los items según necesites.
	────────────────────────────────────────────────── */
	recommendations: [
		{ icon: '🕒', text: 'Llega temprano para que no te pierdas ningún momento. La ceremonia da inicio puntualmente.' },
		{ icon: '📸', text: 'Disfruta cada instante con todos los sentidos. Eso es exactamente lo que esperamos de ti.' },
		{ icon: '✅', text: 'Confirma tu asistencia con tiempo — nos ayuda a organizarlo todo con amor y precisión.' },
		{ icon: '🚗', text: 'En el formulario de confirmación encontrarás información detallada sobre transporte, alimentación, bebidas y hospedaje.' },
		{ icon: '📵', text: 'La ceremonia es un momento íntimo. Te pedimos mantener el celular en silencio y disfrutar el presente.' },
		{ icon: '🌸', text: 'Por favor evita el color blanco en tu atuendo, reservémoslo para la novia.' },
	],

	/* ──────────────────────────────────────────────────
	   DRESS CODE
	   swatches: array de colores HEX sugeridos para cada grupo.
	────────────────────────────────────────────────── */
	dresscode: {
		main: 'El estilo de la celebración es formal-elegante. Queremos que te sientas cómodo/a y hermoso/a.',
		note: '🚫 Por favor evita el color blanco. Te pedimos también evitar tacones muy altos si la ceremonia es al aire libre.',
		items: [
			{
				icon:     '🤵',
				title:    'Caballeros',
				desc:     'Traje formal o smoking. Corbata o pajarita recomendada.',
				swatches: ['#1a2a4a', '#3a3a3a', '#5c4a38', '#4a6f8a'],
			},
			{
				icon:     '👗',
				title:    'Damas',
				desc:     'Vestido largo o midi formal. Colores suaves y elegantes.',
				swatches: ['#d4798a', '#7b9db8', '#7a8c5c', '#b08d57', '#c9b8d0'],
			},
			{
				icon:     '👦',
				title:    'Niños',
				desc:     'Formal acorde a su edad. Cómodo para que puedan disfrutar.',
				swatches: ['#4a6f8a', '#7a8c5c', '#b08d57'],
			},
			{
				icon:     '💃',
				title:    'Jovencitas',
				desc:     'Vestido elegante. Evitar el blanco. ¡Diviértete con el color!',
				swatches: ['#d4798a', '#7b9db8', '#c9b8d0', '#7a8c5c'],
			},
		],
	},

	/* ──────────────────────────────────────────────────
	   RECUERDOS / QRs
	   link: reemplaza los valores placeholder por los links reales.
	────────────────────────────────────────────────── */
	qrs: {
		intro: 'Hemos preparado espacios especiales para que compartas este día con nosotros, incluso desde lejos.',
		items: [
			{
				icon:  '🎵',
				title: 'Jam – Playlist',
				desc:  'Agrega canciones a nuestra lista. ¡Cuéntanos cuál es tu favorita!',
				link:  'LINK_JAM_PLAYLIST',
			},
			{
				icon:  '📷',
				title: 'Álbum compartido',
				desc:  'Sube tus fotos del día. Todos podrán verlas y descargarlas.',
				link:  'LINK_ALBUM_FOTOS',
			},
			{
				icon:  '💌',
				title: 'Buzón de deseos',
				desc:  'Déjanos un mensaje, un consejo o simplemente tu cariño.',
				link:  'LINK_BUZON_DESEOS',
			},
		],
	},

	/* ──────────────────────────────────────────────────
	   FOOTER
	────────────────────────────────────────────────── */
	footer: {
		dateText: 'Bogotá, Colombia · 14.11.2026',
		contacts: [
			{ icon: '📞', label: 'Camilo',  value: '+57 300 000 0000', link: 'tel:+573000000000' },
			{ icon: '📞', label: 'Maritza', value: '+57 300 000 0001', link: 'tel:+573000000001' },
			{ icon: '✉',  label: 'Email',   value: 'boda@ejemplo.com',  link: 'mailto:boda@ejemplo.com' },
		],
	},

	/* ──────────────────────────────────────────────────
	   AUDIO DE FONDO
	   Descomenta y reemplaza la ruta para habilitar la música.
	   Formatos soportados: mp3, ogg, wav.
	────────────────────────────────────────────────── */
	audioSrc: null,
	// audioSrc: 'assets/cancion.mp3',
};

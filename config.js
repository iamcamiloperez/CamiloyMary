/* ======================================================
   CONFIGURACIÓN DE LA BODA
   ──────────────────────────────────────────────────────
   Este es el ÚNICO archivo que necesitas editar para
   personalizar la invitación: nombres, fechas, lugares,
   links, TODOS los textos y el audio.

   No es necesario tocar los HTML, CSS ni otros scripts.
   (Para cambiar la paleta de colores: css/variables.css
   y el bloque <style> de cada HTML. Para agregar o
   cambiar invitados: guests.json.)

   ── Cómo se escriben los textos ────────────────────────
   • Un texto normal es un string:      'Hola'
   • Un texto que cambia según a quién se invita es un
     objeto con dos versiones (ver guests.json, campo
     "single"):
         { single: 'Confirma tu asistencia',
           plural: 'Confirmen su asistencia' }
     single → una sola persona (tú) · plural → pareja o
     grupo (ustedes). Si el invitado no trae código en la
     URL (?codigo=XXXX) se usa la versión single.
   • '\n' dentro de un texto = salto de línea.
   • **texto** = negrita.
   • %deadline% = se reemplaza por rsvp.deadline.
   • %name% = nombre del invitado. Un texto que lo usa puede traer
     una tercera versión, anonymous, para cuando no hay código.
====================================================== */

const WEDDING = {

	/* ──────────────────────────────────────────────────
	   NOVIOS
	   Se usan también para las iniciales del monograma, el
	   nombre de la portada, del menú y del footer.
	────────────────────────────────────────────────── */
	groom: 'Camilo',
	bride:  'Maritza',

	/* ──────────────────────────────────────────────────
	   FECHA Y LUGAR DE LA BODA
	   weddingDateISO     → formato ISO 8601. Alimenta la cuenta
	                        regresiva y el día/mes/año grandes.
	                        Año-Mes-DíaTHora:Min  ej. 2026-11-14T17:00:00
	   weddingDateDisplay → fecha completa (lectores de pantalla)
	   weddingLocation    → ciudad/lugar que va bajo la fecha
	────────────────────────────────────────────────── */
	weddingDateISO:     '2026-11-14T15:00:00',
	weddingDateDisplay: 'Sábado, 14 de noviembre de 2026',
	weddingLocation:    'Tibasosa, Boyacá',

	/* ──────────────────────────────────────────────────
	   AUDIO DE FONDO
	   Ruta del archivo (mp3, ogg, wav) o null para no tener música.
	────────────────────────────────────────────────── */
	audioSrc: 'assets/background.mp3',

	/* ──────────────────────────────────────────────────
	   PORTADA "TOCA PARA ABRIR"
	────────────────────────────────────────────────── */
	cover: {
		tap: 'Toca para abrir',
	},

	/* ──────────────────────────────────────────────────
	   MODO LIBRO (solo invitacion-libro.html)
	   coverFor → frase de la tapa; debajo va el nombre del invitado
	              (?code=XXXX / ?codigo=XXXX, ver guests.json)
	────────────────────────────────────────────────── */
	/* %name% = nombre del invitado. Los textos que lo usan traen
	   además una versión "anonymous" para cuando la URL no trae código. */
	book: {
		coverFor: {
			single: 'Una historia escrita con amor',
			plural: 'Una historia escrita con amor',
		},
		next:        'pasa la página',
		prev:        'volver',
		index:       'Índice',
		swipeHint:   'desliza ↓',

		/* Página 1 – Prólogo */
		prologue:       'Prólogo',
		onceUpon:       'Érase una vez…',
		prologueOpen:   '…una boda con fecha, lugar y final feliz asegurado.',
		prologueCouple: 'Sus protagonistas:',
		prologueGuest: {
			single:    'Y en ella, un lugar guardado para ti, **%name%**.',
			plural:    'Y en ella, un lugar guardado para ustedes, **%name%**.',
			anonymous: 'Y en ella, un lugar guardado para ti.',
		},
		dateLead:      'El gran día',
		countdownLead: 'Faltan…',

		/* Capítulos: título (la nota/epígrafe es el 'label' de cada sección) */
		chapterWord: 'Capítulo',
		chapters: {
			ceremonia:       'Ceremonia',
			recepcion:       'Recepción',
			asistencia:      'Asistencia',
			recomendaciones: 'Recomendaciones',
			dresscode:       'Dress Code',
			qrs:             'Recuerdos',
		},
		/* Frase con la que el narrador abre cada capítulo */
		leads: {
			ceremonia:       'El instante en que el tiempo se detiene.',
			recepcion:       'La noche será larga y feliz.',
			asistencia: {
				single: '¿Estarás en esta historia?',
				plural: '¿Estarán en esta historia?',
			},
			recomendaciones: 'Consejos para un final feliz.',
			dresscode:       'El vestuario también cuenta.',
			qrs:             'Esta historia se escribe entre todos.',
		},

		/* p8 (Fin) y contratapa */
		happyEnding: '…y vivieron felices para siempre',
		theEnd:      'Fin',
		epilogue:    '(o apenas el comienzo)',
		backToStart: 'volver a empezar',
	},

	/* ──────────────────────────────────────────────────
	   MENÚ DE NAVEGACIÓN
	   id          → id de la sección (no cambiar)
	   label       → texto en el menú de escritorio y en los puntos laterales
	   mobileLabel → texto en el menú móvil (opcional, por defecto label)
	   icon        → emoji del menú móvil
	────────────────────────────────────────────────── */
	nav: [
		{ id: 'save-the-date',   label: 'La Fecha',   icon: '💌' },
		{ id: 'ceremonia',       label: 'Ceremonia',  icon: '⛪' },
		{ id: 'recepcion',       label: 'Recepción',  icon: '🥂' },
		{ id: 'asistencia',      label: 'Asistencia', mobileLabel: 'Confirmar Asistencia', icon: '✅' },
		{ id: 'recomendaciones', label: 'Recomend.',  mobileLabel: 'Recomendaciones',      icon: '📋' },
		{ id: 'dresscode',       label: 'Dress Code', icon: '👗' },
		{ id: 'qrs',             label: 'Recuerdos',  icon: '📸' },
	],

	/* ──────────────────────────────────────────────────
	   SECCIÓN 1 – GUARDA LA FECHA (portada de la invitación)
	   greetingFallback → saludo cuando la URL no trae código de
	                      invitado; con código se muestra el nombre.
	────────────────────────────────────────────────── */
	hero: {
		greetingFallback: 'Con todo nuestro amor,',
		script: 'Sí…',
		title:  'Nos casamos.',
		intro: {
			single: 'Ya es oficial…\ny te queremos ahí, celebrando con nosotros.',
			plural: 'Ya es oficial…\ny los queremos ahí, celebrando con nosotros.',
		},
	},

	countdown: {
		days:    'Días',
		hours:   'Horas',
		minutes: 'Minutos',
		seconds: 'Segundos',
	},

	/* ──────────────────────────────────────────────────
	   SECCIÓN 2 – CEREMONIA
	────────────────────────────────────────────────── */
	ceremony: {
		label:   'Aquí es donde decimos «sí»',
		title:   'Ceremonia',
		place:   'Capilla de la Inmaculada',
		address: 'Tibasosa, Boyacá',
		date:    'Sábado, 14 de noviembre de 2026',
		time:    '3:00 p.m.',
		arrival: {
			single: 'Llega 20 minutos antes (sí, en serio)',
			plural: 'Lleguen 20 minutos antes (sí, en serio)',
		},
		doors:    'Las puertas abren a las 2:30 p.m. y nosotros ya estaremos nerviosos.',
		mapLabel: 'Ver en el mapa',
		mapLink:  'https://maps.app.goo.gl/BfYg8MU2chfD7YaQ8',
	},

	/* ──────────────────────────────────────────────────
	   SECCIÓN 3 – RECEPCIÓN
	────────────────────────────────────────────────── */
	reception: {
		label:   'Después del «sí», viene la fiesta',
		title:   'Recepción',
		place:   'Hacienda Bella Luna Campestre',
		address: 'Km 1.5 via Sogamoso - Tibasosa',
		date:    'Sábado, 14 de noviembre de 2026',
		time:    '5:00 p.m. – 11:00 p.m.',
		extraTitle: 'Un espacio para pasarla bien sin excusas',
		extraText: {
			single: 'Te esperamos con la mejor actitud para construir momentos unicos.',
			plural: 'Los esperamos con la mejor actitud para construir momentos unicos.',
		},
		mapLabel: 'Ver en el mapa',
		mapLink:  'https://maps.app.goo.gl/ckTeEarYySX4z8bs5',
	},

	/* ──────────────────────────────────────────────────
	   SECCIÓN 4 – CONFIRMAR ASISTENCIA
	────────────────────────────────────────────────── */
	rsvp: {
		label: 'Tu presencia es el mejor regalo (bueno, casi)',
		title: {
			single: 'Confirma tu\nasistencia',
			plural: 'Confirmen su\nasistencia',
		},
		deadline: '14 de Octubre de 2026',
		message: {
			single: 'Confirma tu asistencia antes del **%deadline%**, así no nos toca adivinar.',
			plural: 'Confirmen su asistencia antes del **%deadline%**, así no nos toca adivinar.',
		},
		buttonLabel: 'Confirmar asistencia',
		formLink:    'LINK_FORMULARIO_ASISTENCIA',
		help: {
			single: 'Si tienes dudas, escríbenos sin pena ↓',
			plural: 'Si tienen dudas, escríbannos sin pena ↓',
		},
	},

	/* ──────────────────────────────────────────────────
	   SECCIÓN 5 – RECOMENDACIONES
	   Agrega, elimina o reordena los items según necesites.
	   El texto de cada item puede ser string u objeto single/plural.
	────────────────────────────────────────────────── */
	recommendations: {
		label: 'Cosas que conviene saber',
		title: 'Recomendaciones',
		items: [
			{ icon: '🕒', text: {
				single: 'Llega temprano: la ceremonia empieza puntual y no queremos que te pierdas ni el primer «sí».',
				plural: 'Lleguen temprano: la ceremonia empieza puntual y no queremos que se pierdan ni el primer «sí».',
			} },
			{ icon: '📸', text: {
				single: 'Vive cada momento con todos los sentidos. Es lo único que te pedimos (bueno, y que bailes).',
				plural: 'Vivan cada momento con todos los sentidos. Es lo único que les pedimos (bueno, y que bailen).',
			} },
			{ icon: '✅', text: {
				single: 'Confirma con tiempo: así lo organizamos todo con amor y con una hoja de Excel que ya da miedo.',
				plural: 'Confirmen con tiempo: así lo organizamos todo con amor y con una hoja de Excel que ya da miedo.',
			} },
			{ icon: '🚗', text: {
				single: 'Si tienes cualquier duda acerca de transporte, comida, bebidas, etc. No dudes en escribirnos.',
				plural: 'Si tienen cualquier duda acerca de transporte, comida, bebidas, etc. No duden en escribirnos',
			} },
			{ icon: '📵', text: 'La ceremonia es un momento íntimo: celular en silencio y a disfrutar el presente. Prometemos que valdrá la pena.' },
			{ icon: '🌸', text: {
				single: 'Evita el blanco: ese día el color ya tiene dueña.',
				plural: 'Eviten el blanco: ese día el color ya tiene dueña.',
			} },
		],
	},

	/* ──────────────────────────────────────────────────
	   SECCIÓN 6 – DRESS CODE
	   swatches: array de colores HEX sugeridos para cada grupo.
	────────────────────────────────────────────────── */
	dresscode: {
		label: {
			single: 'Elegante, pero que puedas bailar',
			plural: 'Elegantes, pero que puedan bailar',
		},
		title: 'Dress Code',
		main: {
			single: 'Formal-elegante, pero cómodo: queremos que te veas increíble y que aguantes bailando toda la noche.',
			plural: 'Formal-elegante, pero cómodo: queremos que se vean increíbles y que aguanten bailando toda la noche.',
		},
		note: '🚫 Nada de blanco, por favor. Y si la ceremonia es al aire libre, ojo con los tacones muy altos: el pasto no perdona.',
		items: [
			{
				icon:  '🤵',
				title: 'Caballeros',
				desc: {
					single: 'Traje formal sin chaleco. Tú eliges, pero que se note el esfuerzo.',
					plural: 'Traje formal sin chaleco. Ustedes eligen, pero que se note el esfuerzo.',
				},
				swatches: ['#1a2a4a', '#3a3a3a', '#5c4a38', '#4a6f8a'],
			},
			{
				icon:     '👗',
				title:    'Damas',
				desc:     'Vestido largo o midi formal, en colores suaves y elegantes. Que brille, pero sin opacar a la novia.',
				swatches: ['#d4798a', '#7b9db8', '#7a8c5c', '#b08d57', '#c9b8d0'],
			}
		],
	},

	/* ──────────────────────────────────────────────────
	   SECCIÓN 7 – RECUERDOS / QRs
	   link: reemplaza los valores placeholder (LINK_...) por los links reales.
	────────────────────────────────────────────────── */
	qrs: {
		label: 'Que lo de ese día no se quede en el olvido',
		title: 'Recuerdos',
		intro: {
			single: 'Preparamos unos rinconcitos para que compartas este día con nosotros, incluso si te toca verlo desde lejos.',
			plural: 'Preparamos unos rinconcitos para que compartan este día con nosotros, incluso si les toca verlo desde lejos.',
		},
		items: [
			{
				icon:  '🎵',
				title: 'Jam – Playlist',
				desc: {
					single: 'Agrega tus canciones a la lista. Cuéntanos cuál es tu favorita… y prepárate para bailarla.',
					plural: 'Agreguen sus canciones a la lista. Cuéntennos cuál es su favorita… y prepárense para bailarla.',
				},
				link: 'LINK_JAM_PLAYLIST',
			},
			{
				icon:  '📷',
				title: 'Álbum compartido',
				desc: {
					single: 'Sube tus fotos del día. Todos podremos verlas y descargarlas (hasta las que salieron movidas).',
					plural: 'Suban sus fotos del día. Todos podremos verlas y descargarlas (hasta las que salieron movidas).',
				},
				link: 'LINK_ALBUM_FOTOS',
			},
			{
				icon:  '💌',
				title: 'Buzón de deseos',
				desc: {
					single: 'Déjanos un mensaje, un consejo o simplemente tu cariño. Prometemos leerlo todo.',
					plural: 'Déjennos un mensaje, un consejo o simplemente su cariño. Prometemos leerlo todo.',
				},
				link: 'LINK_BUZON_DESEOS',
			},
		],
	},
};

// JUEGO: Foto -> nombre, posición, dorsal
// Asegúrate de haber guardado las imágenes en /images/ con los nombres indicados arriba.

const players = [
  { name: "Álvaro Valles", position: "Portero", number: 1, photo: "images/01_alvaro_valles.jpg" },
  { name: "Adrián San Miguel", position: "Portero", number: 13, photo: "images/13_adrian.jpg" },
  { name: "Pau López", position: "Portero", number: 25, photo: "images/25_pau_lopez.jpg" },

  { name: "Héctor Bellerín", position: "Lateral derecho", number: 2, photo: "images/02_bellerin.jpg" },
  { name: "Diego Llorente", position: "Defensa central (diestro)", number: 3, photo: "images/03_llorente.jpg" },
  { name: "Natan", position: "Defensa central (zurdo)", number: 4, photo: "images/04_natan.jpg" },
  { name: "Marc Bartra", position: "Defensa central (líbero/centrales)", number: 5, photo: "images/05_bartra.jpg" },
  { name: "Ricardo Rodríguez", position: "Lateral izquierdo", number: 12, photo: "images/12_ricardo_rodriguez.jpg" },
  { name: "Valentín Gómez", position: "Defensa central (juvenil/proyección)", number: 16, photo: "images/16_valentin_gomez.jpg" },
  { name: "Junior Firpo", position: "Lateral izquierdo", number: 23, photo: "images/23_junior_firpo.jpg" },
  { name: "Ángel Ortiz", position: "Lateral derecho / carrilero", number: 40, photo: "images/40_angel_ortiz.jpg" },

  { name: "Sergi Altimira", position: "Mediocentro / medio centro", number: 6, photo: "images/06_sergi_altimira.jpg" },
  { name: "Sofyan Amrabat", position: "Mediocentro defensivo (pivote)", number: 14, photo: "images/14_s_amrabat.jpg" },
  { name: "N. Deossa", position: "Medio centro / caja a caja", number: 18, photo: "images/18_n_deossa.jpg" },
  { name: "Giovani Lo Celso", position: "Mediapunta / creador", number: 20, photo: "images/20_lo_celso.jpg" },
  { name: "Marc Roca", position: "Mediocentro defensivo / organizador", number: 21, photo: "images/21_marc_roca.jpg" },
  { name: "Pablo Fornals", position: "Mediocentro / interior", number: 8, photo: "images/08_pablo_fornals.jpg" },
  { name: "Isco Alarcón", position: "Mediapunta / creador", number: 22, photo: "images/22_isco.jpg" },


  { name: "Antony", position: "Extremo derecho", number: 7, photo: "images/07_antony.jpg" },
  { name: "Chimy Ávila", position: "Delantero centro (9)", number: 9, photo: "images/09_chimy_avila.jpg" },
  { name: "Ez Abde", position: "Extremo izquierdo / regateador", number: 10, photo: "images/10_ez_abde.jpg" },
  { name: "Cédric Bakambu", position: "Delantero centro (finalizador)", number: 11, photo: "images/11_bakambu.jpg" },
  { name: "Rodrigo Riquelme", position: "Extremo izquierdo / mediapunta", number: 17, photo: "images/17_riquelme.jpg" },
  { name: "Cucho Hernández", position: "Delantero / segunda punta", number: 19, photo: "images/19_cucho.jpg" },
  { name: "Aitor Ruibal", position: "Extremo derecho / carrilero", number: 24, photo: "images/24_aitor_ruibal.jpg" },
  { name: "Pablo García", position: "Extremo derecho / banda", number: 52, photo: "images/52_pablo_garcia.jpg" }
];

// estado
let currentIndex = -1;
let currentPlayer = null;
let score = 0;
let hintLevel = 0; // 0 = ninguna, 1 = dorsal, 2 = posición, 3 = iniciales

// elementos DOM
const photoEl = document.getElementById("player-photo");
const nameInput = document.getElementById("input-name");
const posInput = document.getElementById("input-position");
const numInput = document.getElementById("input-number");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const hintArea = document.getElementById("hint-area");

function pickRandom() {
  currentIndex = Math.floor(Math.random() * players.length);
  currentPlayer = players[currentIndex];
  photoEl.src = currentPlayer.photo;
  photoEl.alt = `Foto de ${currentPlayer.name}`;
  // limpia inputs y feedback
  nameInput.value = "";
  posInput.value = "";
  numInput.value = "";
  feedbackEl.textContent = "";
  hintLevel = 0;
  hintArea.textContent = "Pistas: — (pulsa Pista)";
}

function normalize(text){
  return text.trim().toLowerCase()
    .replace(/\u00f1/g,'n') // ñ -> n for forgiving match
    .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u')
    .replace(/[^a-z0-9\s]/g,''); // quitar signos
}

document.getElementById("check-btn").addEventListener("click", ()=>{
  if(!currentPlayer) return;
  const nameVal = normalize(nameInput.value);
  const posVal = normalize(posInput.value);
  const numVal = numInput.value.trim();

  let okName = normalize(currentPlayer.name).includes(nameVal) || nameVal.includes(normalize(currentPlayer.name));
  // más permisivo: acepta apellido o nombre parcial si coincide suficientemente
  if(nameVal.length < 3) okName = false; // evitar respuestas vacías
  // posición y número exactos (pero permitimos palabras claves)
  const targetPos = normalize(currentPlayer.position);
  const posMatch = targetPos.includes(posVal) || posVal.includes(targetPos);
  const numMatch = (numVal !== "") && (numVal === String(currentPlayer.number));

  let correct = okName && posMatch && numMatch;

  if(correct){
    feedbackEl.textContent = `¡Correcto! Era ${currentPlayer.name} — ${currentPlayer.position} — #${currentPlayer.number}`;
    score++;
    scoreEl.textContent = score;
    // pequeña pausa y cambia
    setTimeout(pickRandom, 1200);
  } else {
    // mostrar qué falla
    let msgs = [];
    if(!okName) msgs.push("Nombre incorrecto");
    if(!posMatch) msgs.push("Posición incorrecta");
    if(!numMatch) msgs.push("Dorsal incorrecto");
    feedbackEl.textContent = msgs.join(". ") + ".";
  }
});

document.getElementById("hint-btn").addEventListener("click", ()=>{
  if(!currentPlayer) return;
  hintLevel = Math.min(3, hintLevel + 1);
  if(hintLevel === 1){
    hintArea.textContent = `Pistas: Dorsal → ${currentPlayer.number}`;
  } else if(hintLevel === 2){
    hintArea.textContent = `Pistas: Dorsal → ${currentPlayer.number} · Posición → ${currentPlayer.position}`;
  } else if(hintLevel === 3){
    // iniciales (por ejemplo, "Álvaro Valles" -> "A.V.")
    const initials = currentPlayer.name.split(/\s+/).map(w => w[0] ? w[0].toUpperCase() : '').join('.');
    hintArea.textContent = `Pistas: ${currentPlayer.number} · ${currentPlayer.position} · Iniciales → ${initials}`;
  }
});

document.getElementById("skip-btn").addEventListener("click", ()=>{
  feedbackEl.textContent = `Se saltó: ${currentPlayer.name} — ${currentPlayer.position} — #${currentPlayer.number}`;
  setTimeout(pickRandom, 800);
});

// inicializa el juego
pickRandom();

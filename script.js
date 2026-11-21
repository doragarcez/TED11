const elGrade = document.getElementById("grade");
const elJogadas = document.getElementById("jogadas");
const elTempo = document.getElementById("tempo");
const elFim = document.getElementById("fim");
const elJogadasFinal = document.getElementById("jogadas-final");
const elTempoFinal = document.getElementById("tempo-final");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnNovo = document.getElementById("btn-novo");

const FIGURAS = ["🐍", "🧱", "🐦", "🌸", "🍓", "🎀", "🦄", "💖"];
const TEMPO_DESVIRAR = 900;             

let cartas;                            
let viradas;                            
let bloqueado;                          
let jogadas, paresAchados;
let inicio, relogio;                   

function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

function formatarTempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return m + ":" + (s < 10 ? "0" : "") + s;
}

function atualizarTempo() {
  const segundos = Math.floor((Date.now() - inicio) / 1000);
  elTempo.textContent = formatarTempo(segundos);
}

function criarCarta(figura) {
  const carta = document.createElement("button");
  carta.type = "button";
  carta.className = "carta";
  carta.dataset.figura = figura;
  carta.setAttribute("aria-label", "Carta virada para baixo");

  carta.innerHTML =
    '<span class="carta-interior">' +
      '<span class="face costas" aria-hidden="true">?</span>' +
      '<span class="face frente" aria-hidden="true">' + figura + '</span>' +
    '</span>';

  carta.addEventListener("click", function () { virar(carta); });
  return carta;
}

function iniciar() {
  clearInterval(relogio);
  relogio = null;
  inicio = null;
  viradas = [];
  bloqueado = false;
  jogadas = 0;
  paresAchados = 0;

  elJogadas.textContent = jogadas;
  elTempo.textContent = "0:00";
  elFim.hidden = true;

  const baralho = embaralhar(FIGURAS.concat(FIGURAS));
  elGrade.innerHTML = "";
  cartas = baralho.map(criarCarta);
  cartas.forEach(function (c) { elGrade.appendChild(c); });
}

function virar(carta) {
  if (bloqueado) return;
  if (carta.classList.contains("virada") || carta.classList.contains("achada")) return;

  if (!relogio) {
    inicio = Date.now();
    relogio = setInterval(atualizarTempo, 250);
  }

  carta.classList.add("virada");
  carta.setAttribute("aria-label", "Carta " + carta.dataset.figura);
  viradas.push(carta);

  if (viradas.length < 2) return;

  jogadas++;
  elJogadas.textContent = jogadas;

  const a = viradas[0];
  const b = viradas[1];

  if (a.dataset.figura === b.dataset.figura) {
    marcarAchadas(a, b);
  } else {
    bloqueado = true;
    setTimeout(function () {
      desvirar(a);
      desvirar(b);
      viradas = [];
      bloqueado = false;
    }, TEMPO_DESVIRAR);
  }
}

function marcarAchadas(a, b) {
  [a, b].forEach(function (c) {
    c.classList.add("achada");
    c.disabled = true;
  });
  viradas = [];
  paresAchados++;

  if (paresAchados === FIGURAS.length) venceu();
}

function desvirar(carta) {
  carta.classList.remove("virada");
  carta.setAttribute("aria-label", "Carta virada para baixo");
}

function venceu() {
  clearInterval(relogio);
  relogio = null;
  atualizarTempo();

  elJogadasFinal.textContent = jogadas;
  elTempoFinal.textContent = elTempo.textContent;

  setTimeout(function () {
    elFim.hidden = false;
    btnReiniciar.focus();
  }, 700);
}

btnReiniciar.addEventListener("click", iniciar);
btnNovo.addEventListener("click", iniciar);

iniciar();
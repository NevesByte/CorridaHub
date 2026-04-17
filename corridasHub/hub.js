console.log("SCRIPT INICIADO");
localStorage.clear();
// ===============================
// CONFIG
// ===============================
const STORAGE_KEY = "corridas";

// ===============================
// DADOS PADRÃO
// ===============================
const corridasPadrao = [
  {
    nome: "Night Run",
    distancia: "5",
    regiao: "centro",
    data: "2026-07-01",
    tipo: "rua",
    categoria: "todos",
    premiacao: "dinheiro",
    descricao: "Evento noturno com iluminação especial."
  },
  {
    nome: "Trail Run",
    distancia: "10",
    regiao: "zona rural",
    data: "2026-06-10",
    tipo: "trilha",
    categoria: "todos",
    premiacao: "sem",
    descricao: "Corrida em meio à natureza."
  },
  {
    nome: "Corrida da Cidade",
    distancia: "5",
    regiao: "centro",
    data: "2026-05-20",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    descricao: "Evento tradicional com percurso de 5km."
  }
];

// ===============================
// RESET LOCALSTORAGE (IMPORTANTE)
// ===============================
function resetarLocalStorage(){
  localStorage.removeItem(STORAGE_KEY);
}

// ===============================
// INICIALIZAR DADOS
// ===============================
function inicializarCorridas(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(corridasPadrao));
}

// ===============================
// PEGAR DADOS
// ===============================
function getCorridas(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// ===============================
// FORMATAR DATA (EXIBIÇÃO)
// ===============================
function formatarData(data){
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ===============================
// TEXTO PREMIAÇÃO
// ===============================
function textoPremiacao(p){
  if(p === "sem") return "Sem premiação";
  if(p === "com") return "Com premiação";
  if(p === "dinheiro") return "Premiação em dinheiro";
  return "";
}

// ===============================
// RENDERIZAR CARDS
// ===============================
function renderCorridas(){
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  const corridas = getCorridas();

  corridas.forEach(c => {

    const card = document.createElement("article");
    card.classList.add("card");

    // DATASET (BASE DO FILTRO)
    card.dataset.nome = c.nome.toLowerCase();
    card.dataset.distancia = c.distancia;
    card.dataset.regiao = c.regiao.toLowerCase();
    card.dataset.data = c.data;
    card.dataset.tipo = c.tipo;
    card.dataset.categoria = c.categoria;
    card.dataset.premiacao = c.premiacao;

    card.innerHTML = `
      <div class="card-image">
        <img src="../img/CORRIDA.png">
        <span class="tag">${c.tipo}</span>
      </div>

      <div class="card-content">
        <h2>${c.nome}</h2>
        <p>${c.descricao}</p>

        <div class="card-info">
          <span>${c.regiao}</span>
          <span>${formatarData(c.data)}</span>
        </div>

        <div class="card-extra">
          <span>${c.distancia}KM</span>
          <span>${textoPremiacao(c.premiacao)}</span>
        </div>

        <button>Ver mais</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// ===============================
// FILTRO
// ===============================
const form = document.querySelector(".form");

form.addEventListener("submit", function(e){
  e.preventDefault();

  const cards = document.querySelectorAll(".card");

  const nome = document.getElementById("nome").value.toLowerCase().trim();
  const distancia = document.getElementById("distancia").value.trim();
  const regiao = document.getElementById("regiao").value.toLowerCase().trim();
  const data = document.getElementById("data").value;
  const tipo = document.getElementById("tipo").value;
  const categoria = document.getElementById("categoria").value;
  const premiacao = document.getElementById("premiacao").value;

  if(!nome && !distancia && !regiao && !data && !tipo && !categoria && !premiacao){
    alert("Nenhum filtro foi selecionado.");
    cards.forEach(card => card.style.display = "block");
    return;
  }

  let encontrou = false;

  cards.forEach(card => {

    const cNome = card.dataset.nome;
    const cDistancia = card.dataset.distancia;
    const cRegiao = card.dataset.regiao;
    const cData = card.dataset.data;
    const cTipo = card.dataset.tipo;
    const cCategoria = card.dataset.categoria;
    const cPremiacao = card.dataset.premiacao;

    let match = true;

    if(nome && !cNome.includes(nome)) match = false;

    if(distancia && cDistancia !== distancia) match = false;

    if(regiao && !cRegiao.includes(regiao)) match = false;

    // ✅ DATA CORRIGIDA
    if(data && cData !== data) match = false;

    if(tipo && cTipo !== tipo) match = false;

    if(categoria && cCategoria !== categoria && cCategoria !== "todos") match = false;

    if(premiacao){
      if(premiacao === "sem" && cPremiacao !== "sem") match = false;
      if(premiacao === "com" && cPremiacao === "sem") match = false;
      if(premiacao === "dinheiro" && cPremiacao !== "dinheiro") match = false;
    }

    if(match){
      card.style.display = "block";
      encontrou = true;
    } else {
      card.style.display = "none";
    }

  });

  if(!encontrou){
    alert("Nenhum registro encontrado.");
  }

});

// ===============================
// EXECUÇÃO
// ===============================

// 🔥 sempre reseta pra evitar dados antigos
resetarLocalStorage();

// 🔥 recria dados atualizados
inicializarCorridas();

// 🔥 renderiza
renderCorridas();
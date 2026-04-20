console.log("SCRIPT INICIADO");
localStorage.clear();
// ===============================
// CONFIG
// ===============================
const STORAGE_KEY = "corridas";

// ===============================
// IMAGENS (URLS)
// ===============================
const IMG_CIRCUITO = "https://www.itapetininga.sp.gov.br/admin/globalarq/noticia/noticia/651_366/16d36b7d050fd0d7d348953e45a27a2c.jpeg";
const IMG_60 = "https://www.itapetininga.sp.gov.br/public/admin/globalarq/noticia/noticia/651_366/7bc0a7f950b44b9a03684077ff733997.jpeg";
const IMG_KIDS = "https://itapetininga.sp.gov.br/admin/globalarq/noticia/noticia/651_366/658a7429da395b4d7beb22f7ac1741ba.jpeg";
const IMG_KAZAMIGAS = "https://www.itapetininga.sp.gov.br/admin/globalarq/noticia/noticia/651_366/c9b7fdd24c09ce7f2775f4c9f291a402.jpeg";
const IMG_SEXTA = IMG_CIRCUITO;
const IMG_ANSPAZ = "https://www.itapetininga.sp.gov.br/admin/globalarq/noticia/noticia/651_366/8c4c582548b2c11e7a614a433f78658a.jpeg";
const IMG_DAGRO = "https://www.itapetininga.sp.gov.br/admin/globalarq/noticia/noticia/651_366/62216d2d62e48e15be0a483ca280d7eb.jpeg";
const IMG_POLICIA_PENAL = "https://www.itapetininga.sp.gov.br/admin/globalarq/noticia/noticia/651_366/fe062267ef8cd2e366babff0781a5099.jpeg";
const IMG_FRANCIOSI = "https://d2hk32cswy6zx7.cloudfront.net/34444422e6fe8a34498efad78ecebec2/v2_745f3a89-fb17-4ab0-a24b-02da2e25be08.jpg";
const IMG_XV = "https://www.itapetininga.sp.gov.br/admin/globalarq/noticia/noticia/651_366/2484b2076fe874b1f8b0c1ffef48185f.jpeg";

// ===============================
// FUNÇÃO PARA VERIFICAR STATUS DA CORRIDA
// ===============================
function getStatusCorrida(dataCorrida) {
  const hoje = new Date();
  const data = new Date(dataCorrida + 'T23:59:59'); // Fim do dia
  return data < hoje ? 'realizada' : 'agendada';
}

// ===============================
// DADOS PADRÃO
// ===============================
const corridasPadrao = [
  {
    nome: "Etapa 01 - Circuito Correr e Caminhar com Saúde",
    distancia: "5",
    regiao: "Polícia Militar",
    data: "2024-03-24",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "correr-caminhar",
    descricao: "Primeira etapa do circuito oficial da Prefeitura de Itapetininga.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "Guarda Civil Municipal, SAMU, Secretaria de Trânsito e Cidadania, Fundo Social de Solidariedade",
    imagem: IMG_CIRCUITO,
    cronometrista: "Tiago Serafim"
  },
  {
    nome: "Etapa 02 - Circuito Correr e Caminhar com Saúde",
    distancia: "5",
    regiao: "Polícia Civil",
    data: "2024-04-21",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "correr-caminhar",
    descricao: "Segunda etapa do circuito oficial.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "Guarda Civil Municipal, SAMU, Secretaria de Trânsito e Cidadania, Fundo Social de Solidariedade",
    imagem: IMG_CIRCUITO,
    cronometrista: "Tiago Serafim"
  },
  {
    nome: "Etapa 03 - Circuito Correr e Caminhar com Saúde",
    distancia: "5",
    regiao: "São João Batista",
    data: "2026-06-30",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "correr-caminhar",
    descricao: "Terceira etapa do circuito oficial (data a confirmar).",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "Guarda Civil Municipal, SAMU, Secretaria de Trânsito e Cidadania, Fundo Social de Solidariedade",
    imagem: IMG_CIRCUITO,
    cronometrista: "Tiago Serafim"
  },
  {
    nome: "Etapa 04 - Circuito Correr e Caminhar com Saúde",
    distancia: "5",
    regiao: "Tiro de Guerra",
    data: "2026-08-25",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "correr-caminhar",
    descricao: "Quarta etapa do circuito oficial.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "Guarda Civil Municipal, SAMU, Secretaria de Trânsito e Cidadania, Fundo Social de Solidariedade",
    imagem: IMG_CIRCUITO,
    cronometrista: "Tiago Serafim"
  },
  {
    nome: "Etapa 05 - Circuito Correr e Caminhar com Saúde",
    distancia: "5",
    regiao: "Local a definir",
    data: "2026-10-20",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "correr-caminhar",
    descricao: "Quinta etapa do circuito oficial.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "Guarda Civil Municipal, SAMU, Secretaria de Trânsito e Cidadania, Fundo Social de Solidariedade",
    imagem: IMG_CIRCUITO,
    cronometrista: "Tiago Serafim"
  },
  {
    nome: "Etapa 06 - Circuito Correr e Caminhar com Saúde",
    distancia: "5",
    regiao: "Local a definir",
    data: "2026-12-08",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "correr-caminhar",
    descricao: "Sexta e última etapa do circuito oficial.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "Guarda Civil Municipal, SAMU, Secretaria de Trânsito e Cidadania, Fundo Social de Solidariedade",
    imagem: IMG_CIRCUITO,
    cronometrista: "Tiago Serafim"
  },
  {
    nome: "Corrida 60+ - Etapa 01",
    distancia: "3",
    regiao: "Paço Municipal",
    data: "2024-04-14",
    tipo: "rua",
    categoria: "60+",
    premiacao: "com",
    programa: "60+",
    descricao: "Corrida especial para participantes acima de 60 anos.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "SAMU, Fundo Social de Solidariedade",
    imagem: IMG_60,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida 60+ - Etapa 02",
    distancia: "3",
    regiao: "Ginásio Ayrton Senna",
    data: "2024-09-15",
    tipo: "rua",
    categoria: "60+",
    premiacao: "com",
    programa: "60+",
    descricao: "Segunda etapa para idosos.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "SAMU, Fundo Social de Solidariedade",
    imagem: IMG_60,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida Kids - Etapa 01",
    distancia: "1",
    regiao: "Ginásio Ayrton Senna",
    data: "2024-03-17",
    tipo: "rua",
    categoria: "criancas",
    premiacao: "com",
    programa: "kids",
    descricao: "Corrida para crianças com percurso adequado.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "SAMU, Fundo Social de Solidariedade",
    imagem: IMG_KIDS,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida Kids - Etapa 02",
    distancia: "1",
    regiao: "Paço Municipal",
    data: "2024-06-23",
    tipo: "rua",
    categoria: "criancas",
    premiacao: "com",
    programa: "kids",
    descricao: "Segunda etapa para crianças.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "SAMU, Fundo Social de Solidariedade",
    imagem: IMG_KIDS,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida Kids - Etapa 03",
    distancia: "1",
    regiao: "Lagoa Chapadinha",
    data: "2024-10-13",
    tipo: "rua",
    categoria: "criancas",
    premiacao: "com",
    programa: "kids",
    descricao: "Terceira etapa para crianças.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "SAMU, Fundo Social de Solidariedade",
    imagem: IMG_KIDS,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida Kids - Etapa 04",
    distancia: "1",
    regiao: "Local a definir",
    data: "2024-12-08",
    tipo: "rua",
    categoria: "criancas",
    premiacao: "com",
    programa: "kids",
    descricao: "Quarta etapa para crianças.",
    organizadores: "Prefeitura Municipal de Itapetininga, Secretaria de Esporte, Lazer e Juventude",
    apoiadores: "SAMU, Fundo Social de Solidariedade",
    imagem: IMG_KIDS,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida Kazamigas / Raveli",
    distancia: "5",
    regiao: "Centro",
    data: "2024-01-28",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "parcerias",
    descricao: "Corrida em parceria com Kazamigas e Raveli.",
    organizadores: "Kazamigas, Raveli",
    apoiadores: "Prefeitura Municipal de Itapetininga",
    imagem: IMG_KAZAMIGAS,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida 'Sexta é Nois'",
    distancia: "5",
    regiao: "Centro",
    data: "2024-02-18",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "parcerias",
    descricao: "Evento noturno 'Sexta é Nois'.",
    organizadores: "Grupos locais",
    apoiadores: "Prefeitura Municipal de Itapetininga",
    imagem: IMG_SEXTA,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida Anspaz / Padre Someti",
    distancia: "5",
    regiao: "Centro",
    data: "2024-03-10",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "parcerias",
    descricao: "Corrida em parceria com Anspaz e Padre Someti.",
    organizadores: "Anspaz, Padre Someti",
    apoiadores: "Prefeitura Municipal de Itapetininga",
    imagem: IMG_ANSPAZ,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida de Aniversário D' Agro",
    distancia: "5",
    regiao: "Centro",
    data: "2024-04-28",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "parcerias",
    descricao: "Corrida comemorativa de aniversário D' Agro.",
    organizadores: "D' Agro",
    apoiadores: "Prefeitura Municipal de Itapetininga",
    imagem: IMG_DAGRO,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida Polícia Penal / Base Escolta",
    distancia: "5",
    regiao: "Centro",
    data: "2024-05-26",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "parcerias",
    descricao: "Corrida em parceria com Polícia Penal.",
    organizadores: "Polícia Penal",
    apoiadores: "Prefeitura Municipal de Itapetininga",
    imagem: IMG_POLICIA_PENAL,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida Franciosi",
    distancia: "5",
    regiao: "Centro",
    data: "2024-08-04",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "parcerias",
    descricao: "Corrida Franciosi.",
    organizadores: "Franciosi",
    apoiadores: "Prefeitura Municipal de Itapetininga",
    imagem: IMG_FRANCIOSI,
    cronometrista: "Tiago Serafim",
    destaques: []
  },
  {
    nome: "Corrida de Aniversário – XV de Novembro",
    distancia: "5",
    regiao: "Centro",
    data: "2024-11-03",
    tipo: "rua",
    categoria: "todos",
    premiacao: "com",
    programa: "parcerias",
    descricao: "Corrida comemorativa do XV de Novembro.",
    organizadores: "EC XV de Novembro",
    apoiadores: "Prefeitura Municipal de Itapetininga",
    imagem: IMG_XV,
    cronometrista: "Tiago Serafim",
    destaques: [
      { categoria: "Masculino 19-29", primeiro: "Tiago Anderson H de Oliveira - 00:22:48" },
      { categoria: "Masculino 40-49", primeiro: "José Luciano da Paz - 00:25:33" }
    ]
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

  corridas.forEach((c, index) => {

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
    card.dataset.programa = c.programa;
    card.dataset.organizadores = c.organizadores.toLowerCase();

    const status = getStatusCorrida(c.data);
    card.dataset.status = status;
    const imageURL = c.imagem || (status === 'realizada'
      ? 'http://placehold.it/600x400?text=Corrida+Realizada'
      : 'http://placehold.it/600x400?text=Pr%C3%B3xima+Corrida');

    card.innerHTML = `
      <div class="card-image">
        <img src="${imageURL}" alt="Imagem da corrida ${c.nome}">
        <span class="tag">${c.tipo}</span>
        <span class="card-status ${status}">${status === 'realizada' ? 'Realizada' : 'Agendada'}</span>
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

        <button onclick="mostrarDetalhes(${index})">Ver mais</button>
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
  const programa = document.getElementById("programa").value;
  const status = document.getElementById("status").value;
  const organizadores = document.getElementById("organizadores").value.toLowerCase().trim();

  if(!nome && !distancia && !regiao && !data && !tipo && !categoria && !premiacao && !programa && !status && !organizadores){
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
    const cPrograma = card.dataset.programa;
    const cStatus = card.dataset.status;
    const cOrganizadores = card.dataset.organizadores;

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

    if(programa && cPrograma !== programa) match = false;

    if(status && cStatus !== status) match = false;

    if(organizadores && !cOrganizadores.includes(organizadores)) match = false;

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
// MOSTRAR DETALHES DA CORRIDA
// ===============================
function mostrarDetalhes(index) {
  const corridas = getCorridas();
  const corrida = corridas[index];
  const status = getStatusCorrida(corrida.data);
  const imageURL = corrida.imagem || (status === 'realizada'
    ? 'http://placehold.it/600x400?text=Corrida+Realizada'
    : 'http://placehold.it/600x400?text=Pr%C3%B3xima+Corrida');
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content">
      <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>

      <div class="modal-hero">
        <img src="${imageURL}" alt="Imagem da corrida ${corrida.nome}" class="modal-hero-image">
        <div class="modal-hero-overlay"></div>
        <div class="modal-hero-content">
          <h1 class="modal-title">${corrida.nome}</h1>
          <div class="modal-badges">
            <span class="badge badge-primary">${corrida.distancia}KM</span>
            <span class="badge badge-secondary">${formatarData(corrida.data)}</span>
            <span class="badge badge-accent">${status === 'realizada' ? 'Realizada' : 'Agendada'}</span>
          </div>
        </div>
      </div>

      <div class="modal-body">
        <div class="modal-description">
          <p>${corrida.descricao}</p>
        </div>

        <div class="modal-grid">
          <div class="info-card">
            <div class="info-card-header">
              <h3>Localização</h3>
            </div>
            <p><strong>Região:</strong> ${corrida.regiao}</p>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <h3>Categoria</h3>
            </div>
            <p><strong>Categoria:</strong> ${corrida.categoria}</p>
            <p><strong>Programa:</strong> ${corrida.programa}</p>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <h3>Premiação</h3>
            </div>
            <p>${textoPremiacao(corrida.premiacao)}</p>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <h3>Organização</h3>
            </div>
            <p><strong>Organizadores:</strong> ${corrida.organizadores}</p>
            <p><strong>Apoiadores:</strong> ${corrida.apoiadores}</p>
            <p><strong>Cronometrista:</strong> ${corrida.cronometrista}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ===============================
// INICIALIZAR
// ===============================
resetarLocalStorage();
inicializarCorridas();
renderCorridas();

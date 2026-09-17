// Menu é gerenciado centralmente em menu.js
// Lógica específica da página index (galeria de corridas recentes)

const STORAGE_KEY = "corridas";
const HUB_URL = "corridasHub/hub.html";

function escapeHTML(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function formatarDataISO(dataISO) {
  if (!dataISO || typeof dataISO !== "string" || !dataISO.includes("-")) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function getCorridasDoStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getCorridasFallback() {
  return [
    {
      nome: "Etapa 01 - Circuito Correr e Caminhar com Saúde",
      data: "2024-03-24",
      descricao: "Primeira etapa do circuito oficial da Prefeitura de Itapetininga.",
      imagem: "img/sobre/grid-fotos/grid-1.webp"
    },
    {
      nome: "Etapa 02 - Circuito Correr e Caminhar com Saúde",
      data: "2024-04-21",
      descricao: "Segunda etapa do circuito oficial.",
      imagem: "img/sobre/grid-fotos/grid-2.JPG"
    },
    {
      nome: "Etapa 03 - Circuito Correr e Caminhar com Saúde",
      data: "2026-06-30",
      descricao: "Terceira etapa do circuito oficial (data a confirmar).",
      imagem: "img/sobre/grid-fotos/grid-3.jpg"
    }
  ];
}

function selecionarCorridasParaGaleria(corridas, limite) {
  const lista = Array.isArray(corridas) ? corridas : [];
  const comImagem = lista.filter((c) => c && c.imagem);
  const base = comImagem.length ? comImagem : lista;
  return base.slice(0, limite);
}

function criarItemGaleria(corrida, index) {
  const nome = (corrida?.nome || "Corrida").toString();
  const dataFmt = formatarDataISO((corrida?.data || "").toString());
  const descricao = (corrida?.descricao || "Veja mais detalhes no Hub.").toString();
  const imagem = (corrida?.imagem || "img/sobre/anonimo.png").toString();

  const item = document.createElement("div");
  item.className = `grid-item${index === 0 ? " big" : ""}`;
  item.tabIndex = 0;

  const descId = `corrida-desc-${index}`;
  item.innerHTML = `
    <img src="${escapeHTML(imagem)}" alt="Imagem da corrida ${escapeHTML(nome)}" loading="lazy">

    <div class="grid-caption" aria-hidden="true">
      <div>
        <div class="grid-caption-title">${escapeHTML(nome)}</div>
        <div class="grid-caption-date">${escapeHTML(dataFmt)}</div>
      </div>
    </div>

    <div class="grid-overlay">
      <div class="grid-overlay-header">
        <div>
          <div class="grid-title">${escapeHTML(nome)}</div>
          <div class="grid-date">${escapeHTML(dataFmt)}</div>
        </div>

        <button class="grid-toggle" type="button" aria-expanded="false" aria-controls="${descId}" aria-label="Mostrar descrição"></button>
      </div>

      <div class="grid-actions">
        <a class="grid-link" href="${escapeHTML(HUB_URL)}">Ir para o Hub</a>
      </div>

      <div class="grid-desc" id="${descId}">${escapeHTML(descricao)}</div>
    </div>
  `;

  const toggle = item.querySelector(".grid-toggle");
  if (toggle) {
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const aberto = item.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
  }

  return item;
}

function initGaleriaCorridasRecentes() {
  const grid = document.getElementById("corridasRecentesGrid");
  if (!grid) return;

  const corridasStorage = getCorridasDoStorage();
  const corridas = corridasStorage.length ? corridasStorage : getCorridasFallback();

  const selecionadas = selecionarCorridasParaGaleria(corridas, 3);
  grid.innerHTML = "";

  selecionadas.forEach((corrida, index) => {
    grid.appendChild(criarItemGaleria(corrida, index));
  });

  const fecharItem = (el) => {
    el.classList.remove("is-active");
    el.classList.remove("is-open");
    const toggle = el.querySelector(".grid-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  };

  grid.addEventListener("click", (event) => {
    const item = event.target.closest(".grid-item");
    if (!item || !grid.contains(item)) return;

    if (event.target.closest(".grid-toggle") || event.target.closest(".grid-link")) return;

    const ativos = grid.querySelectorAll(".grid-item.is-active");
    ativos.forEach((el) => {
      if (el !== item) fecharItem(el);
    });

    const ativoAgora = item.classList.toggle("is-active");
    if (!ativoAgora) fecharItem(item);
  });

  grid.addEventListener("keydown", (event) => {
    const isToggleKey = event.key === "Enter" || event.key === " ";
    if (!isToggleKey) return;

    const item = event.target.closest(".grid-item");
    if (!item || !grid.contains(item)) return;

    if (event.target.closest(".grid-toggle") || event.target.closest(".grid-link")) return;

    event.preventDefault();

    const ativos = grid.querySelectorAll(".grid-item.is-active");
    ativos.forEach((el) => {
      if (el !== item) fecharItem(el);
    });

    const ativoAgora = item.classList.toggle("is-active");
    if (!ativoAgora) fecharItem(item);
  });

  document.addEventListener("click", (event) => {
    if (grid.contains(event.target)) return;
    grid.querySelectorAll(".grid-item.is-active").forEach((el) => fecharItem(el));
  });
}

document.addEventListener("DOMContentLoaded", initGaleriaCorridasRecentes);

const API_URL = "http://98.89.169.30/api/painel";

let paginaAtual = 1;
const tamanhoPagina = 10;

let totalPaginas = 0;
let corridasAtuais = [];
let proximoIdCard = 0;


/*
|--------------------------------------------------------------------------
| ELEMENTOS
|--------------------------------------------------------------------------
*/

const resultados =
    document.getElementById("resultados");

const paginacao =
    document.getElementById("paginacao");

const btnAnterior =
    document.getElementById("btnAnterior");

const btnProxima =
    document.getElementById("btnProxima");

const paginaAtualElement =
    document.getElementById("paginaAtual");

const formBusca =
    document.getElementById("formBusca");


/*
|--------------------------------------------------------------------------
| CARREGAR CORRIDAS
|--------------------------------------------------------------------------
*/

async function carregarCorridas(pagina = 1) {

    mostrarLoading();

    if (window.location.protocol === "file:") {
        mostrarErro(
            "A página foi aberta diretamente como arquivo (file://). O navegador bloqueia chamadas à API nesse modo. Abra o Hub pelo endereço HTTP/HTTPS servido pelo Nginx, que encaminha /api/painel para o backend.",
            false
        );
        return;
    }

    try {

        const url =
            `${API_URL}/corridas?page=${pagina}&pageSize=${tamanhoPagina}`;


        const response =
            await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });


        if (!response.ok) {

            let mensagem =
                "Não foi possível carregar as corridas.";


            try {

                const erro =
                    await response.json();


                if (erro.erro) {

                    mensagem =
                        erro.erro;

                }

            } catch {

                // Resposta não era JSON.

            }


            throw new Error(mensagem);

        }


        const dados =
            await response.json();


        /*
        |--------------------------------------------------------------------------
        | PAGINAÇÃO
        |--------------------------------------------------------------------------
        */

        paginaAtual =
            Number(dados.pagina) || pagina;


        totalPaginas =
            Number(dados.totalPaginas) || 0;


        /*
        |--------------------------------------------------------------------------
        | ITENS
        |--------------------------------------------------------------------------
        */

        corridasAtuais =
            Array.isArray(dados.itens)
                ? dados.itens
                : [];


        /*
        |--------------------------------------------------------------------------
        | RENDER
        |--------------------------------------------------------------------------
        */

        renderizarCorridas(
            corridasAtuais
        );


        atualizarPaginacao();


    } catch (erro) {

        console.error(
            "Erro ao buscar corridas:",
            erro
        );


        const mensagem = erro instanceof TypeError
            ? "Não foi possível conectar à API do painel. Confira se o site está aberto via HTTP/HTTPS e se o Nginx está encaminhando /api/painel para o backend."
            : erro.message || "Erro ao carregar as corridas.";

        mostrarErro(mensagem);

    }

}


/*
|--------------------------------------------------------------------------
| RENDERIZAR CORRIDAS
|--------------------------------------------------------------------------
*/

function renderizarCorridas(corridas) {

    resultados.innerHTML = "";


    if (
        !Array.isArray(corridas) ||
        corridas.length === 0
    ) {

        resultados.innerHTML = `

            <div class="sem-resultados">

                <h3>
                    Nenhuma corrida encontrada
                </h3>

                <p>
                    Não existem corridas disponíveis
                    para os critérios informados.
                </p>

            </div>

        `;

        return;

    }


    corridas.forEach(corrida => {

        const card =
            criarCardCorrida(corrida);


        resultados.appendChild(card);

    });

}


/*
|--------------------------------------------------------------------------
| CRIAR CARD
|--------------------------------------------------------------------------
*/

function criarCardCorrida(corrida) {

    const card =
        document.createElement("article");


    card.className =
        "card-corrida";


    /*
    |--------------------------------------------------------------------------
    | IMAGEM
    |--------------------------------------------------------------------------
    */

    const imagemHtml = corrida.imagemUrl
        ? `
            <button type="button" class="card-corrida-imagem ampliar-imagem" aria-label="Ampliar imagem da corrida">
                <img
                    src="${escapeHtml(corrida.imagemUrl)}"
                    alt="Imagem da corrida ${escapeHtml(corrida.nomeEvento || "")}"
                    loading="lazy"
                >
            </button>
        `
        : `
            <div class="card-corrida-imagem imagem-sem-foto">
                <span>Imagem da corrida não disponível</span>
            </div>
        `;


    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const dataEvento =
        formatarData(
            corrida.dataEvento
        );

    const detalhesId = `detalhes-corrida-${++proximoIdCard}`;


    /*
    |--------------------------------------------------------------------------
    | CARD
    |--------------------------------------------------------------------------
    */

    card.innerHTML = `

        ${imagemHtml}

        <div class="card-corrida-conteudo">

            <div class="card-corrida-header">

                <span class="status-corrida ${classeStatus(corrida.statusAprovacao)}">
                    ${escapeHtml(formatarStatus(corrida.statusAprovacao))}
                </span>
            </div>

            <h3 class="card-corrida-titulo">
                ${escapeHtml(corrida.nomeEvento || "Evento sem nome")}
            </h3>

            <p class="card-corrida-resumo">
                <span>${escapeHtml(dataEvento)}</span>
                <span>${escapeHtml(corrida.regiaoItapetininga || "Local não informado")}</span>
            </p>

            <button
                class="btn-detalhes-corrida"
                type="button"
                aria-haspopup="dialog"
            >
                Ver informações
            </button>

            <div class="card-corrida-info" id="${detalhesId}" hidden>

                <div class="card-corrida-detalhe">
                    <span>Data</span>
                    <strong>${escapeHtml(dataEvento)}</strong>
                </div>

                <div class="card-corrida-detalhe">
                    <span>Local</span>
                    <strong>${escapeHtml(corrida.regiaoItapetininga || "Não informada")}</strong>
                </div>

                <div class="card-corrida-detalhe">
                    <span>Organizador</span>
                    <strong>${escapeHtml(corrida.nomeAnunciante || "Não informado")}</strong>
                </div>

                <div class="card-corrida-detalhe">
                    <span>Modalidade</span>
                    <strong>${escapeHtml(formatarEnum(corrida.tipoCorrida))}</strong>
                </div>

                <div class="card-corrida-detalhe">
                    <span>Categoria</span>
                    <strong>${escapeHtml(formatarEnum(corrida.categoriaCorredores))}</strong>
                </div>

                <div class="card-corrida-detalhe">
                    <span>Premiação</span>
                    <strong>${escapeHtml(formatarEnum(corrida.premiacao))}</strong>
                </div>

                ${corrida.assinatura
                    ? `<div class="card-corrida-detalhe"><span>Origem</span><strong>${escapeHtml(formatarAssinatura(corrida.assinatura))}</strong></div>`
                    : ""}
            </div>

        </div>

    `;

    const botaoDetalhes = card.querySelector(".btn-detalhes-corrida");
    const detalhes = card.querySelector(".card-corrida-info");
    botaoDetalhes.addEventListener("click", () => {
        const conteudo = detalhes.cloneNode(true);
        conteudo.removeAttribute("id");
        conteudo.hidden = false;
        for (const [rotulo, valor] of [["E-mail de contato", corrida.emailContato], ["Telefone", corrida.telefone]]) {
            const item = document.createElement("div");
            item.className = "card-corrida-detalhe";
            const label = document.createElement("span");
            label.textContent = rotulo;
            const texto = document.createElement("strong");
            texto.textContent = valor || "Não informado";
            item.append(label, texto);
            conteudo.append(item);
        }
        abrirCaixaCorrida(corrida.nomeEvento || "Informações da corrida", conteudo);
    });

    const imagem = card.querySelector(".card-corrida-imagem img");
    card.querySelector(".ampliar-imagem")?.addEventListener("click", () => {
        if (imagem?.isConnected) ampliarImagemCorrida(imagem, corrida.nomeEvento || "Imagem da corrida");
    });
    imagem?.addEventListener("error", () => {
        const areaImagem = imagem.parentElement;
        areaImagem.classList.add("imagem-sem-foto");
        areaImagem.replaceChildren(
            Object.assign(document.createElement("span"), {
                textContent: "Imagem da corrida indisponível"
            })
        );
    }, { once: true });


    return card;

}


/*
|--------------------------------------------------------------------------
| PAGINAÇÃO
|--------------------------------------------------------------------------
*/

function atualizarPaginacao() {

    if (
        totalPaginas <= 1
    ) {

        paginacao.style.display =
            "none";

        return;

    }


    paginacao.style.display =
        "flex";


    paginaAtualElement.textContent =
        `Página ${paginaAtual} de ${totalPaginas}`;


    btnAnterior.disabled =
        paginaAtual <= 1;


    btnProxima.disabled =
        paginaAtual >= totalPaginas;

}


/*
|--------------------------------------------------------------------------
| BOTÃO ANTERIOR
|--------------------------------------------------------------------------
*/

btnAnterior.addEventListener(
    "click",
    () => {

        if (paginaAtual > 1) {

            carregarCorridas(
                paginaAtual - 1
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| BOTÃO PRÓXIMA
|--------------------------------------------------------------------------
*/

btnProxima.addEventListener(
    "click",
    () => {

        if (
            paginaAtual < totalPaginas
        ) {

            carregarCorridas(
                paginaAtual + 1
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| FILTROS
|--------------------------------------------------------------------------
*/

formBusca.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        aplicarFiltros();

    }
);


/*
|--------------------------------------------------------------------------
| APLICAR FILTROS
|--------------------------------------------------------------------------
*/

function aplicarFiltros() {

    const nome =
        document
            .getElementById("nome")
            .value
            .trim()
            .toLowerCase();


    const regiao =
        document
            .getElementById("regiao")
            .value
            .trim()
            .toLowerCase();


    const data =
        document
            .getElementById("data")
            .value;


    const tipo =
        document
            .getElementById("tipo")
            .value
            .toLowerCase();


    const categoria =
        document
            .getElementById("categoria")
            .value
            .toLowerCase();


    const premiacao =
        document
            .getElementById("premiacao")
            .value
            .toLowerCase();


    const status =
        document
            .getElementById("status")
            .value
            .toLowerCase();


    const organizadores =
        document
            .getElementById("organizadores")
            .value
            .trim()
            .toLowerCase();


    const filtradas =
        corridasAtuais.filter(
            corrida => {


                /*
                |--------------------------------------------------------------------------
                | NOME
                |--------------------------------------------------------------------------
                */

                if (
                    nome &&
                    !String(
                        corrida.nomeEvento || ""
                    )
                        .toLowerCase()
                        .includes(nome)
                ) {

                    return false;

                }


                /*
                |--------------------------------------------------------------------------
                | REGIÃO
                |--------------------------------------------------------------------------
                */

                if (
                    regiao &&
                    !String(
                        corrida.regiaoItapetininga || ""
                    )
                        .toLowerCase()
                        .includes(regiao)
                ) {

                    return false;

                }


                /*
                |--------------------------------------------------------------------------
                | DATA
                |--------------------------------------------------------------------------
                */

                if (data) {

                    const dataCorrida =
                        corrida.dataEvento
                            ? String(
                                corrida.dataEvento
                            ).substring(0, 10)
                            : "";


                    if (
                        dataCorrida !== data
                    ) {

                        return false;

                    }

                }


                /*
                |--------------------------------------------------------------------------
                | TIPO
                |--------------------------------------------------------------------------
                */

                if (
                    tipo &&
                    normalizarValor(
                        corrida.tipoCorrida
                    ) !==
                    normalizarValor(tipo)
                ) {

                    return false;

                }


                /*
                |--------------------------------------------------------------------------
                | CATEGORIA
                |--------------------------------------------------------------------------
                */

                if (
                    categoria &&
                    normalizarValor(
                        corrida.categoriaCorredores
                    ) !==
                    normalizarValor(categoria)
                ) {

                    return false;

                }


                /*
                |--------------------------------------------------------------------------
                | PREMIAÇÃO
                |--------------------------------------------------------------------------
                */

                if (
                    premiacao &&
                    normalizarValor(
                        corrida.premiacao
                    ) !==
                    normalizarValor(premiacao)
                ) {

                    return false;

                }


                /*
                |--------------------------------------------------------------------------
                | STATUS
                |--------------------------------------------------------------------------
                */

                if (status) {

                    const dataEvento =
                        corrida.dataEvento
                            ? new Date(
                                corrida.dataEvento
                            )
                            : null;


                    if (!dataEvento) {

                        return false;

                    }


                    const hoje =
                        new Date();


                    hoje.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    dataEvento.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    if (
                        status === "realizada" &&
                        dataEvento >= hoje
                    ) {

                        return false;

                    }


                    if (
                        status === "agendada" &&
                        dataEvento < hoje
                    ) {

                        return false;

                    }

                }


                /*
                |--------------------------------------------------------------------------
                | ORGANIZADOR
                |--------------------------------------------------------------------------
                */

                if (
                    organizadores &&
                    !String(
                        corrida.nomeAnunciante || ""
                    )
                        .toLowerCase()
                        .includes(organizadores)
                ) {

                    return false;

                }


                return true;

            }
        );


    renderizarCorridas(
        filtradas
    );

}


/*
|--------------------------------------------------------------------------
| FORMATAR DATA
|--------------------------------------------------------------------------
*/

function formatarData(data) {

    if (!data) {

        return "Não informada";

    }


    const dataISO =
        /^(\d{4})-(\d{2})-(\d{2})/.exec(String(data));

    const dataObj = dataISO
        ? new Date(
            Number(dataISO[1]),
            Number(dataISO[2]) - 1,
            Number(dataISO[3])
        )
        : new Date(data);


    if (
        Number.isNaN(
            dataObj.getTime()
        )
    ) {

        return "Data inválida";

    }


    return dataObj.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/*
|--------------------------------------------------------------------------
| FORMATAR ENUM
|--------------------------------------------------------------------------
*/

function formatarEnum(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "Não informado";

    }


    const rotulos = {
        CorridaDeRua: "Corrida de rua",
        CorridaDeCampo: "Corrida de campo",
        CorridaDeTrilha: "Corrida de trilha",
        CorridaDeEscada: "Corrida de escada",
        CorridaCrossCountry: "Corrida cross country",
        Vovos: "Vovôs",
        Criancas: "Crianças",
        ComPremiacao: "Com premiação",
        SemPremiacao: "Sem premiação",
        PremiacaoDinheiro: "Premiação em dinheiro",
        Administracao: "Administração",
        PainelCorridaHub: "Painel Corrida Hub"
    };

    if (Object.prototype.hasOwnProperty.call(rotulos, valor)) {
        return rotulos[valor];
    }

    return String(valor)

        .replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
        )

        .replace(
            /_/g,
            " "
        )

        .replace(
            /-/g,
            " "
        )

        .replace(
            /\b\w/g,
            letra =>
                letra.toUpperCase()
        );

}


/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

function classeStatus(status) {
    const valor = normalizarValor(status);
    return ["pendente", "aprovado", "rejeitado"].includes(valor)
        ? `status-${valor}`
        : "";
}


function formatarStatus(status) {

    if (
        status === null ||
        status === undefined ||
        status === ""
    ) {

        return "Não informado";

    }


    const valor =
        String(status)
            .toLowerCase();


    switch (valor) {

        case "pendente":
            return "Pendente";

        case "aprovado":
            return "Aprovado";

        case "rejeitado":
            return "Rejeitado";

        default:
            return formatarEnum(status);

    }

}


/*
|--------------------------------------------------------------------------
| ASSINATURA
|--------------------------------------------------------------------------
*/

function formatarAssinatura(
    assinatura
) {

    if (
        assinatura === null ||
        assinatura === undefined ||
        assinatura === ""
    ) {

        return "";

    }


    return formatarEnum(
        assinatura
    );

}


/*
|--------------------------------------------------------------------------
| NORMALIZAR VALOR
|--------------------------------------------------------------------------
*/

function normalizarValor(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)

        .toLowerCase()

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[\s_-]/g,
            ""
        );

}


/*
|--------------------------------------------------------------------------
| ESCAPE HTML
|--------------------------------------------------------------------------
*/

function escapeHtml(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/*
|--------------------------------------------------------------------------
| LOADING
|--------------------------------------------------------------------------
*/

function mostrarLoading() {

    resultados.innerHTML = `

        <div class="estado-carregamento">

            Carregando corridas...

        </div>

    `;

}


/*
|--------------------------------------------------------------------------
| ERRO
|--------------------------------------------------------------------------
*/

function mostrarErro(mensagem) {

    resultados.innerHTML = `

        <div class="erro-resultados">

            <h3>
                Erro ao carregar corridas
            </h3>

            <p>
                ${escapeHtml(mensagem)}
            </p>

            ${window.location.protocol === "file:" ? "" : `<button
                type="button"
                onclick="carregarCorridas(paginaAtual)"
            >
                Tentar novamente
            </button>`}

        </div>

    `;

}


/*
|--------------------------------------------------------------------------
| INICIALIZAÇÃO
|--------------------------------------------------------------------------
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const endereco = new URL(window.location.href);
        if (endereco.searchParams.get("envio") === "sucesso") {
            const aviso = document.createElement("p");
            aviso.setAttribute("role", "status");
            aviso.tabIndex = -1;
            aviso.textContent = "Sua corrida foi enviada para análise com sucesso!";
            Object.assign(aviso.style, {
                padding: "20px", margin: "20px auto", maxWidth: "1100px",
                borderRadius: "14px", border: "1px solid #78bc91",
                background: "#eaf8ef", color: "#174a2a", fontWeight: "600"
            });
            document.querySelector("main").prepend(aviso);
            aviso.focus();
            endereco.searchParams.delete("envio");
            window.history.replaceState(null, "", endereco.href);
        }

        carregarCorridas(1);

    }
);

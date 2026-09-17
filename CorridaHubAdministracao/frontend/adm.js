const API_URL =
    "https://caroline-commentary-patio-complicated.trycloudflare.com";


// =====================================================
// ENDPOINTS
// =====================================================

const ENDPOINT_LISTAR =
    `${API_URL}/api/adm-corrida/listar-solicitacoes-corridas`;

const ENDPOINT_ACEITAR =
    `${API_URL}/api/adm-corrida/aceitar-solicitacoes-corridas`;

const ENDPOINT_REMOVER =
    `${API_URL}/api/adm-corrida/remover-solicitacoes-corridas`;


// =====================================================
// PAGINAÇÃO
// =====================================================

let paginaAtual = 1;

const tamanhoPagina = 10;

let totalPaginas = 1;


// =====================================================
// ELEMENTOS
// =====================================================

const listaCorridas =
    document.getElementById("listaCorridas");

const loading =
    document.getElementById("loading");

const paginaAtualElemento =
    document.getElementById("paginaAtual");

const btnAnterior =
    document.getElementById("btnAnterior");

const btnProxima =
    document.getElementById("btnProxima");

const btnAtualizar =
    document.getElementById("btnAtualizar");

const mensagem =
    document.getElementById("mensagem");


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.className =
        `mensagem ${tipo}`;

    mensagem.style.display = "block";

    setTimeout(() => {

        mensagem.style.display = "none";

    }, 4000);
}


// =====================================================
// LISTAR CORRIDAS
// =====================================================

async function listarCorridas() {

    loading.style.display = "block";

    listaCorridas.innerHTML = "";

    try {

        const url =
            `${ENDPOINT_LISTAR}?pagina=${paginaAtual}&tamanhoPagina=${tamanhoPagina}`;

        console.log("GET:", url);


        const response =
            await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });


        if (!response.ok) {

            const erro =
                await response.text();

            console.error(
                "Erro ao listar:",
                erro
            );

            throw new Error(
                "Não foi possível carregar as solicitações."
            );
        }


        const dados =
            await response.json();


        console.log(
            "Resposta da API:",
            dados
        );


        // ==========================================
        // A API ESTÁ RETORNANDO UM ARRAY
        // ==========================================

        const corridas =
            Array.isArray(dados)
                ? dados
                : (dados.itens || []);


        // Se a API retornar objeto paginado,
        // continua funcionando também.

        if (!Array.isArray(dados)) {

            paginaAtual =
                dados.pagina || paginaAtual;

            totalPaginas =
                dados.totalPaginas || 1;

        } else {

            // Caso a API retorne apenas um array,
            // ainda não temos informações de paginação.

            totalPaginas = 1;
        }


        renderizarCorridas(
            corridas
        );


        atualizarPaginacao();

    } catch (error) {

        console.error(error);

        listaCorridas.innerHTML = `
            <p>
                Erro ao carregar as solicitações.
            </p>
        `;

        mostrarMensagem(
            error.message,
            "erro"
        );

    } finally {

        loading.style.display = "none";
    }
}


// =====================================================
// RENDERIZAR CORRIDAS
// =====================================================

function renderizarCorridas(corridas) {

    if (!corridas || corridas.length === 0) {

        listaCorridas.innerHTML = `
            <p>
                Nenhuma solicitação encontrada.
            </p>
        `;

        return;
    }


    corridas.forEach(corrida => {

        const card =
            document.createElement("div");

        card.className =
            "corrida-card";


        // =================================================
        // IMAGEM
        // =================================================

        let imagemHtml = "";

        if (corrida.imagemUrl) {

            imagemHtml = `
                <img
                    src="${escaparHtml(corrida.imagemUrl)}"
                    alt="Imagem da corrida"
                    class="corrida-imagem"
                    onerror="this.style.display='none';">
            `;
        }


        // =================================================
        // CARD
        // =================================================

        card.innerHTML = `

            <div class="corrida-info">

                <h3>
                    ${escaparHtml(corrida.nomeEvento)}
                </h3>

                <p>
                    <strong>ID:</strong>
                    ${escaparHtml(corrida.id)}
                </p>

                <p>
                    <strong>Anunciante:</strong>
                    ${escaparHtml(corrida.nomeAnunciante)}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escaparHtml(corrida.emailContato)}
                </p>

                <p>
                    <strong>Telefone:</strong>
                    ${escaparHtml(corrida.telefone)}
                </p>

                <p>
                    <strong>Região:</strong>
                    ${escaparHtml(corrida.regiaoItapetininga)}
                </p>

                <p>
                    <strong>Data:</strong>
                    ${formatarData(corrida.dataEvento)}
                </p>

                <p>
                    <strong>Tipo:</strong>
                    ${escaparHtml(corrida.tipoCorrida)}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${escaparHtml(corrida.categoriaCorredores)}
                </p>

                <p>
                    <strong>Premiação:</strong>
                    ${escaparHtml(corrida.premiacao)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escaparHtml(corrida.statusAprovacao)}
                </p>

                <p>
                    <strong>Assinatura:</strong>
                    ${escaparHtml(corrida.assinatura)}
                </p>

            </div>


            ${imagemHtml}


            <div class="corrida-acoes">

                <button
                    type="button"
                    class="btn-success"
                    data-id="${escaparHtml(corrida.id)}">

                    Aceitar

                </button>


                <button
                    type="button"
                    class="btn-danger"
                    data-id="${escaparHtml(corrida.id)}">

                    Remover

                </button>

            </div>

        `;


        // =================================================
        // BOTÃO ACEITAR
        // =================================================

        const botaoAceitar =
            card.querySelector(".btn-success");

        botaoAceitar.addEventListener(
            "click",
            () => aceitarCorrida(corrida.id)
        );


        // =================================================
        // BOTÃO REMOVER
        // =================================================

        const botaoRemover =
            card.querySelector(".btn-danger");

        botaoRemover.addEventListener(
            "click",
            () => removerCorrida(corrida.id)
        );


        listaCorridas.appendChild(card);

    });
}


// =====================================================
// ACEITAR CORRIDA
// =====================================================

async function aceitarCorrida(uid) {

    const confirmar =
        confirm(
            "Deseja aceitar esta corrida?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const url =
            `${ENDPOINT_ACEITAR}?uid=${encodeURIComponent(uid)}`;

        console.log("POST:", url);


        const body = {

            assinatura:
                "Administracao",

            statusAprovacao:
                "Aprovado",

            id:
                uid
        };


        console.log(
            "Body:",
            body
        );


        const response =
            await fetch(
                url,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body)
                }
            );


        if (!response.ok) {

            const erro =
                await response.text();

            console.error(
                "Erro ao aceitar:",
                erro
            );


            if (response.status === 404) {

                throw new Error(
                    "Solicitação não encontrada."
                );
            }


            throw new Error(
                "Erro ao aceitar a corrida."
            );
        }


        mostrarMensagem(
            "Corrida aceita com sucesso.",
            "sucesso"
        );


        await listarCorridas();

    } catch (error) {

        console.error(error);

        mostrarMensagem(
            error.message,
            "erro"
        );
    }
}


// =====================================================
// REMOVER CORRIDA
// =====================================================

async function removerCorrida(uid) {

    const confirmar =
        confirm(
            "Deseja realmente remover esta corrida?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const url =
            `${ENDPOINT_REMOVER}?uid=${encodeURIComponent(uid)}`;

        console.log("DELETE:", url);


        const response =
            await fetch(
                url,
                {
                    method: "DELETE",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            const erro =
                await response.text();

            console.error(
                "Erro ao remover:",
                erro
            );


            if (response.status === 404) {

                throw new Error(
                    "Solicitação não encontrada."
                );
            }


            throw new Error(
                "Erro ao remover a corrida."
            );
        }


        mostrarMensagem(
            "Corrida removida com sucesso.",
            "sucesso"
        );


        await listarCorridas();

    } catch (error) {

        console.error(error);

        mostrarMensagem(
            error.message,
            "erro"
        );
    }
}


// =====================================================
// PAGINAÇÃO
// =====================================================

function atualizarPaginacao() {

    paginaAtualElemento.textContent =
        `Página ${paginaAtual} de ${totalPaginas}`;


    btnAnterior.disabled =
        paginaAtual <= 1;


    btnProxima.disabled =
        paginaAtual >= totalPaginas;
}


// =====================================================
// BOTÃO ANTERIOR
// =====================================================

btnAnterior.addEventListener(
    "click",
    async () => {

        if (paginaAtual <= 1) {
            return;
        }


        paginaAtual--;


        await listarCorridas();
    }
);


// =====================================================
// BOTÃO PRÓXIMA
// =====================================================

btnProxima.addEventListener(
    "click",
    async () => {

        if (paginaAtual >= totalPaginas) {
            return;
        }


        paginaAtual++;


        await listarCorridas();
    }
);


// =====================================================
// BOTÃO ATUALIZAR
// =====================================================

btnAtualizar.addEventListener(
    "click",
    async () => {

        await listarCorridas();
    }
);


// =====================================================
// SEGURANÇA HTML
// =====================================================

function escaparHtml(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }


    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// =====================================================
// FORMATAR DATA
// =====================================================

function formatarData(data) {

    if (!data) {
        return "";
    }


    const dataObj =
        new Date(data);


    if (
        Number.isNaN(
            dataObj.getTime()
        )
    ) {
        return data;
    }


    return dataObj.toLocaleDateString(
        "pt-BR"
    );
}


// =====================================================
// INICIALIZAÇÃO
// =====================================================

listarCorridas();
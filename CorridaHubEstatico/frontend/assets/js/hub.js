const API_URL = "https://newton-demanding-quantum-super.trycloudflare.com/api/buscar-corridas";

let paginaAtual = 1;
const tamanhoPagina = 10;

let totalPaginas = 0;
let corridasAtuais = [];


/*
|--------------------------------------------------------------------------
| ELEMENTOS
|--------------------------------------------------------------------------
*/

const resultados = document.getElementById("resultados");
const paginacao = document.getElementById("paginacao");

const btnAnterior = document.getElementById("btnAnterior");
const btnProxima = document.getElementById("btnProxima");

const paginaAtualElement = document.getElementById("paginaAtual");

const formBusca = document.getElementById("formBusca");


/*
|--------------------------------------------------------------------------
| CARREGAR CORRIDAS
|--------------------------------------------------------------------------
*/

async function carregarCorridas(pagina = 1) {

    mostrarLoading();

    try {

        const url = `${API_URL}?page=${pagina}&pageSize=${tamanhoPagina}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {

            let mensagem = "Não foi possível carregar as corridas.";

            try {

                const erro = await response.json();

                if (erro.erro) {
                    mensagem = erro.erro;
                }

            } catch {
                // Resposta não era JSON.
            }

            throw new Error(mensagem);
        }


        const dados = await response.json();


        /*
        |--------------------------------------------------------------------------
        | PAGINAÇÃO DA API
        |--------------------------------------------------------------------------
        */

        paginaAtual = Number(dados.pagina) || 1;

        totalPaginas = Number(dados.totalPaginas) || 0;


        /*
        |--------------------------------------------------------------------------
        | ITENS
        |--------------------------------------------------------------------------
        */

        corridasAtuais = Array.isArray(dados.itens)
            ? dados.itens
            : [];


        /*
        |--------------------------------------------------------------------------
        | RENDER
        |--------------------------------------------------------------------------
        */

        renderizarCorridas(corridasAtuais);

        atualizarPaginacao();


    } catch (erro) {

        console.error(
            "Erro ao buscar corridas:",
            erro
        );

        mostrarErro(
            erro.message ||
            "Erro ao carregar as corridas."
        );

    }

}


/*
|--------------------------------------------------------------------------
| RENDERIZAR CORRIDAS
|--------------------------------------------------------------------------
*/

function renderizarCorridas(corridas) {

    resultados.innerHTML = "";


    if (!Array.isArray(corridas) || corridas.length === 0) {

        resultados.innerHTML = `
            <div class="sem-resultados">
                <h3>Nenhuma corrida encontrada</h3>

                <p>
                    Não existem corridas disponíveis para os critérios informados.
                </p>
            </div>
        `;

        return;
    }


    corridas.forEach(corrida => {

        const card = criarCardCorrida(corrida);

        resultados.appendChild(card);

    });

}


/*
|--------------------------------------------------------------------------
| CRIAR CARD
|--------------------------------------------------------------------------
*/

function criarCardCorrida(corrida) {

    const card = document.createElement("article");

    card.className = "card-corrida";


    /*
    |--------------------------------------------------------------------------
    | IMAGEM
    |--------------------------------------------------------------------------
    */

    let imagemHtml = "";


    if (corrida.imagemUrl) {

        imagemHtml = `
            <div class="card-corrida-imagem">

                <img
                    src="${escapeHtml(corrida.imagemUrl)}"
                    alt="Imagem da corrida ${escapeHtml(corrida.nomeEvento || "")}"
                    loading="lazy"
                    onerror="
                        this.parentElement.innerHTML =
                        '<div class=&quot;imagem-indisponivel&quot;>Imagem indisponível</div>';
                    "
                >

            </div>
        `;

    } else {

        imagemHtml = `
            <div class="card-corrida-imagem imagem-sem-foto">
                <span>Sem imagem</span>
            </div>
        `;

    }


    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const dataEvento = formatarData(
        corrida.dataEvento
    );


    /*
    |--------------------------------------------------------------------------
    | CARD
    |--------------------------------------------------------------------------
    */

    card.innerHTML = `

        ${imagemHtml}

        <div class="card-corrida-conteudo">

            <div class="card-corrida-header">

                <h3>
                    ${escapeHtml(
                        corrida.nomeEvento ||
                        "Evento sem nome"
                    )}
                </h3>

                <span class="status-corrida">
                    ${formatarStatus(
                        corrida.statusAprovacao
                    )}
                </span>

            </div>


            <div class="card-corrida-info">

                <p>
                    <strong>Organizador:</strong>
                    ${escapeHtml(
                        corrida.nomeAnunciante ||
                        "Não informado"
                    )}
                </p>


                <p>
                    <strong>Região:</strong>
                    ${escapeHtml(
                        corrida.regiaoItapetininga ||
                        "Não informada"
                    )}
                </p>


                <p>
                    <strong>Data:</strong>
                    ${dataEvento}
                </p>


                <p>
                    <strong>Tipo:</strong>
                    ${formatarEnum(
                        corrida.tipoCorrida
                    )}
                </p>


                <p>
                    <strong>Categoria:</strong>
                    ${formatarEnum(
                        corrida.categoriaCorredores
                    )}
                </p>


                <p>
                    <strong>Premiação:</strong>
                    ${formatarEnum(
                        corrida.premiacao
                    )}
                </p>

            </div>


            <div class="card-corrida-footer">

                <span>
                    ${formatarAssinatura(
                        corrida.assinatura
                    )}
                </span>

            </div>

        </div>
    `;


    return card;
}


/*
|--------------------------------------------------------------------------
| PAGINAÇÃO
|--------------------------------------------------------------------------
*/

function atualizarPaginacao() {

    if (totalPaginas <= 1) {

        paginacao.style.display = "none";

        return;
    }


    paginacao.style.display = "flex";


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

        if (paginaAtual < totalPaginas) {

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


function aplicarFiltros() {

    const nome =
        document.getElementById("nome")
            .value
            .trim()
            .toLowerCase();


    const regiao =
        document.getElementById("regiao")
            .value
            .trim()
            .toLowerCase();


    const data =
        document.getElementById("data")
            .value;


    const tipo =
        document.getElementById("tipo")
            .value
            .toLowerCase();


    const categoria =
        document.getElementById("categoria")
            .value
            .toLowerCase();


    const premiacao =
        document.getElementById("premiacao")
            .value
            .toLowerCase();


    const status =
        document.getElementById("status")
            .value
            .toLowerCase();


    const organizadores =
        document.getElementById("organizadores")
            .value
            .trim()
            .toLowerCase();


    const distancia =
        document.getElementById("distancia")
            .value
            .trim()
            .toLowerCase();


    const filtradas = corridasAtuais.filter(corrida => {


        /*
        |--------------------------------------------------------------------------
        | NOME
        |--------------------------------------------------------------------------
        */

        if (
            nome &&
            !String(corrida.nomeEvento || "")
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
            !String(corrida.regiaoItapetininga || "")
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
                    ? String(corrida.dataEvento).substring(0, 10)
                    : "";

            if (dataCorrida !== data) {

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
            normalizarValor(corrida.tipoCorrida) !==
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
            normalizarValor(corrida.categoriaCorredores) !==
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
            normalizarValor(corrida.premiacao) !==
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
                    ? new Date(corrida.dataEvento)
                    : null;


            if (!dataEvento) {

                return false;

            }


            const hoje = new Date();

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
            !String(corrida.nomeAnunciante || "")
                .toLowerCase()
                .includes(organizadores)
        ) {

            return false;

        }


        /*
        |--------------------------------------------------------------------------
        | DISTÂNCIA
        |--------------------------------------------------------------------------
        */

        if (distancia) {

            console.warn(
                "Filtro de distância indisponível: a API não retorna distância."
            );

        }


        return true;

    });


    renderizarCorridas(filtradas);

}


/*
|--------------------------------------------------------------------------
| FORMATAÇÕES
|--------------------------------------------------------------------------
*/

function formatarData(data) {

    if (!data) {

        return "Não informada";

    }


    const dataObj = new Date(data);


    if (
        Number.isNaN(dataObj.getTime())
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
| ENUM
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
            letra => letra.toUpperCase()
        );

}


/*
|--------------------------------------------------------------------------
| STATUS APROVAÇÃO
|--------------------------------------------------------------------------
*/

function formatarStatus(status) {

    if (
        status === null ||
        status === undefined ||
        status === ""
    ) {

        return "Não informado";

    }


    const valor =
        String(status).toLowerCase();


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

function formatarAssinatura(assinatura) {

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
| NORMALIZAÇÃO
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

            <button
                type="button"
                onclick="carregarCorridas(paginaAtual)"
            >
                Tentar novamente
            </button>

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

        carregarCorridas(1);

    }
);
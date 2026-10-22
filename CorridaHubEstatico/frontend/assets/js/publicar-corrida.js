const formularioPublicacao = document.getElementById("formPublicarCorrida");
const mensagemPublicacao = document.getElementById("mensagemPublicacao");
let publicacaoEmAndamento = false;

formularioPublicacao.addEventListener("submit", async event => {
    event.preventDefault();
    if (publicacaoEmAndamento) return;
    publicacaoEmAndamento = true;

    const botao = formularioPublicacao.querySelector('button[type="submit"]');
    const textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = "Enviando para análise…";
    formularioPublicacao.setAttribute("aria-busy", "true");
    mensagemPublicacao.hidden = false;
    mensagemPublicacao.textContent = "Aguarde a confirmação do envio.";
    let enviado = false;

    try {
        const resposta = await fetch(formularioPublicacao.action, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(formularioPublicacao)
        });
        if (!resposta.ok) {
            let erro = "Não foi possível confirmar o envio. Seus dados foram mantidos no formulário.";
            if (resposta.status === 413) erro = "A imagem é muito grande. Escolha uma imagem menor.";
            if (resposta.status === 429) erro = "Muitas tentativas. Aguarde um minuto antes de tentar novamente.";
            const dados = await resposta.json().catch(() => null);
            if (resposta.status === 400) {
                const detalhes = Object.values(dados?.errors || {}).flat().join(" ");
                erro = dados?.erro || detalhes || "Confira os campos do formulário.";
            }
            throw new Error(erro);
        }

        enviado = true;
        mensagemPublicacao.textContent = "Sua corrida foi enviada para análise com sucesso!";
        const destino = new URL("../corridasHub/hub.html", window.location.href);
        destino.searchParams.set("envio", "sucesso");
        window.location.assign(destino.href);
    } catch (erro) {
        mensagemPublicacao.textContent = erro instanceof TypeError
            ? "A conexão foi interrompida e não foi possível confirmar o envio. Confira com a equipe antes de reenviar."
            : erro.message;
    } finally {
        if (!enviado) {
            publicacaoEmAndamento = false;
            botao.disabled = false;
            botao.textContent = textoOriginal;
            formularioPublicacao.removeAttribute("aria-busy");
        }
    }
});

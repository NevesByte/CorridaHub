function abrirCaixaCorrida(titulo, conteudo) {
    const anterior = document.activeElement;
    const caixa = document.createElement("dialog");
    caixa.className = "caixa-corrida";
    caixa.setAttribute("aria-labelledby", "titulo-caixa-corrida");
    const cabecalho = document.createElement("header");
    const heading = document.createElement("h2");
    heading.id = "titulo-caixa-corrida";
    heading.textContent = titulo;
    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "caixa-corrida-fechar";
    fechar.textContent = "×";
    fechar.setAttribute("aria-label", "Fechar janela");
    fechar.addEventListener("click", () => caixa.close());
    cabecalho.append(heading, fechar);
    const corpo = document.createElement("div");
    corpo.className = "caixa-corrida-corpo";
    corpo.append(conteudo);
    caixa.append(cabecalho, corpo);
    const overflowAnterior = document.body.style.overflow;
    caixa.addEventListener("close", () => {
        document.body.style.overflow = overflowAnterior;
        caixa.remove();
        if (anterior?.isConnected) anterior.focus();
    }, { once: true });
    caixa.addEventListener("click", event => {
        if (event.target !== caixa) return;
        const rect = caixa.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom) caixa.close();
    });
    document.body.append(caixa);
    caixa.showModal();
    document.body.style.overflow = "hidden";
    fechar.focus();
}

function ampliarImagemCorrida(imagem, titulo) {
    const ampliada = document.createElement("img");
    ampliada.className = "caixa-corrida-foto";
    ampliada.src = imagem.src;
    ampliada.alt = imagem.alt;
    ampliada.addEventListener("error", () => {
        const aviso = document.createElement("p");
        aviso.textContent = "Não foi possível carregar a imagem. Atualize a lista e tente novamente.";
        ampliada.replaceWith(aviso);
    }, { once: true });
    abrirCaixaCorrida(titulo, ampliada);
}

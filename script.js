// =========================================
// LOGIN E CADASTRO
// =========================================

const btnLogin =
    document.getElementById("btnLogin");

const btnCadastro =
    document.getElementById("btnCadastro");

const formLogin =
    document.getElementById("formLogin");

const formCadastro =
    document.getElementById("formCadastro");

const tituloAcesso =
    document.getElementById("tituloAcesso");

const textoAcesso =
    document.getElementById("textoAcesso");

const irLogin =
    document.getElementById("irLogin");

function mostrarLogin() {
    if (formLogin) {
        formLogin.classList.remove("esconder");
    }

    if (formCadastro) {
        formCadastro.classList.add("esconder");
    }

    if (btnLogin) {
        btnLogin.classList.add("ativo");
    }

    if (btnCadastro) {
        btnCadastro.classList.remove("ativo");
    }

    if (tituloAcesso) {
        tituloAcesso.textContent = "Entrar";
    }

    if (textoAcesso) {

        textoAcesso.textContent =
            "Entre na sua conta para continuar suas leituras.";

    }
}

function mostrarCadastro() {

    if (formCadastro) {
        formCadastro.classList.remove("esconder");
    }

    if (formLogin) {
        formLogin.classList.add("esconder");
    }

    if (btnCadastro) {
        btnCadastro.classList.add("ativo");
    }

    if (btnLogin) {
        btnLogin.classList.remove("ativo");
    }

    if (tituloAcesso) {
        tituloAcesso.textContent = "Criar Conta";
    }

    if (textoAcesso) {

        textoAcesso.textContent =
            "Junte-se ao Clube do Livro e comece sua jornada.";

    }
}

if (btnLogin) {

    btnLogin.addEventListener(
        "click",
        mostrarLogin
    );

}

if (btnCadastro) {

    btnCadastro.addEventListener(
        "click",
        mostrarCadastro
    );

}

if (irLogin) {

    irLogin.addEventListener(
        "click",
        mostrarLogin
    );

}

// =========================================
// HELPERS (DB via Firebase/Firestore)
// =========================================

async function obter(caminho, padrao) {
    await DB.ready;
    return await DB.obter(caminho, padrao);
}

// =========================================
// TOAST NOTIFICATIONS
// =========================================

function garantirToastContainer() {
    if (document.getElementById("toast-container")) {
        return;
    }
    const container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
}

function mostrarNotificacao(mensagem, tipo = "info") {
    garantirToastContainer();

    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.className = "toast toast-" + tipo;

    const icones = {
        erro: "✕",
        sucesso: "✔",
        aviso: "⚠",
        info: "ℹ"
    };

    toast.innerHTML =
        '<div class="toast-icone">' + (icones[tipo] || icones.info) + '</div>' +
        '<div>' + mensagem + '</div>' +
        '<button class="toast-fecha" aria-label="Fechar">✕</button>';

    toast.querySelector(".toast-fecha").addEventListener("click", function() {
        toast.style.animation = "toastSair 0.3s ease-in forwards";
        setTimeout(function() {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });

    container.appendChild(toast);

    setTimeout(function() {
        if (toast.parentNode) {
            toast.style.animation = "toastSair 0.3s ease-in forwards";
            setTimeout(function() {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 3000);
}

async function definir(caminho, valor) {
    await DB.ready;
    return await DB.definir(caminho, valor);
}

async function migrarLegado(uid) {
    if (localStorage.getItem("cisk_db_migrado") === "1") {
        return;
    }
    var bruto = localStorage.getItem("cisk_db_usuario");
    if (!bruto) {
        return;
    }
    var legado;
    try {
        legado = JSON.parse(bruto);
    } catch (e) {
        return;
    }
    if (!legado || typeof legado !== "object" || Array.isArray(legado)) {
        return;
    }
    var usuarioLegado = legado.usuario || {};
    var clubeLegado = legado.clube || {};
    var progressoLegado = legado.progresso || {};
    var presencaLegado = legado.presenca || {};
    var leiturasLegado = (legado.leituras || {}).ultima || {};

    if (usuarioLegado.nome !== undefined) {
        await definir("usuario.nome", usuarioLegado.nome);
    }
    if (usuarioLegado.email !== undefined) {
        await definir("usuario.email", usuarioLegado.email);
    }
    if (usuarioLegado.descricao !== undefined) {
        await definir("usuario.descricao", usuarioLegado.descricao);
    }
    if (usuarioLegado.logado !== undefined) {
        await definir("usuario.logado", usuarioLegado.logado);
    }
    if (clubeLegado.nome !== undefined) {
        await definir("clube.nome", clubeLegado.nome);
    }
    if (progressoLegado.livro !== undefined) {
        await definir("progresso.livro", progressoLegado.livro);
    }
    if (presencaLegado.proximoEncontro !== undefined) {
        await definir("presenca.proximoEncontro", presencaLegado.proximoEncontro);
    }
    if (leiturasLegado.titulo !== undefined) {
        await definir("leituras.ultima.titulo", leiturasLegado.titulo);
    }
    if (leiturasLegado.autor !== undefined) {
        await definir("leituras.ultima.autor", leiturasLegado.autor);
    }
    if (leiturasLegado.paginas !== undefined) {
        await definir("leituras.ultima.paginas", leiturasLegado.paginas);
    }

    localStorage.setItem("cisk_db_migrado", "1");
}

// =========================================
// PROTECAO DE ROTAS (auth)
// =========================================

var paginasProtegidas = [
    "perfil",
    "editar perfil",
    "dados pessoais",
    "clubes",
    "nova leitura",
    "Minha estante"
];

function normalizarPagina(caminho) {
    var p = String(caminho || "").split("/").pop();
    try {
        p = decodeURIComponent(p);
    } catch (e) {}
    return p.replace(/\.html$/i, "");
}

function paginaAtual() {
    return normalizarPagina(location.pathname) || "tela inicio";
}

DB.ready.then(function() {
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js").then(function(moduloAuth) {
        moduloAuth.onAuthStateChanged(DB.auth, function(usuario) {
            var pagina = paginaAtual();
            if (!usuario && paginasProtegidas.indexOf(pagina) !== -1) {
                location.href = "cadastro.html";
                return;
            }
            if (usuario && pagina === "cadastro") {
                location.href = "tela inicio.html";
            }
        });
    });
});

// =========================================
// CADASTRO
// =========================================

if (formCadastro) {

    formCadastro.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const campoNome =
                document.getElementById(
                    "nomeCadastro"
                );


            const campoEmail =
                document.getElementById(
                    "emailCadastro"
                );


            const campoSenha =
                document.getElementById(
                    "senhaCadastro"
                );


            const campoConfirmar =
                document.getElementById(
                    "confirmarSenha"
                );


            const nome =
                campoNome
                    ? campoNome.value.trim()
                    : "";


            const email =
                campoEmail
                    ? campoEmail.value.trim()
                    : "";


            const senha =
                campoSenha
                    ? campoSenha.value
                    : "";


            const confirmarSenha =
                campoConfirmar
                    ? campoConfirmar.value
                    : senha;


            if (nome.length < 2) {

                mostrarNotificacao(
                    "Digite seu nome.",
                    "erro"
                );

                return;

            }


            if (senha.length < 8) {

                mostrarNotificacao(
                    "A senha precisa ter pelo menos 8 caracteres.",
                    "erro"
                );

                return;

            }


            if (
                campoConfirmar &&
                senha !== confirmarSenha
            ) {

                mostrarNotificacao(
                    "As senhas não são iguais.",
                    "erro"
                );

                return;

            }


            try {

                await DB.ready;

                const moduloAuth = await import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
                );

                const credencial =
                    await moduloAuth.createUserWithEmailAndPassword(
                        DB.auth,
                        email,
                        senha
                    );

                const uid = credencial.user.uid;
                const agora = Date.now();

                const moduloFirestore = await import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
                );

                const ref = moduloFirestore.doc(
                    DB.db,
                    "usuarios/" + uid
                );

                await moduloFirestore.setDoc(
                    ref,
                    {
                        usuario: {
                            nome: nome,
                            email: email,
                            descricao: "",
                            logado: true,
                            criadoEm: agora,
                            atualizadoEm: agora
                        },
                        clube: {
                            nome: ""
                        },
                        progresso: {
                            livro: 0
                        },
                        presenca: {
                            proximoEncontro: ""
                        },
                        leituras: {
                            ultima: {
                                titulo: "",
                                autor: "",
                                paginas: ""
                            }
                        }
                    }
                );

                await migrarLegado(uid);

                mostrarNotificacao(
                    "Conta criada com sucesso!",
                    "sucesso"
                );

                window.location.href = "tela inicio.html";

            } catch (erro) {

                mostrarNotificacao(
                    "Erro ao criar conta: " + (erro && erro.message ? erro.message : erro),
                    "erro"
                );

            }
        }
    );

}


// =========================================
// LOGIN
// =========================================

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const emailDigitado =
                document
                    .getElementById("emailLogin")
                    .value
                    .trim();


            const senhaDigitada =
                document
                    .getElementById("senhaLogin")
                    .value;


            try {

                await DB.ready;

                const moduloAuth = await import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
                );

                await moduloAuth.signInWithEmailAndPassword(
                    DB.auth,
                    emailDigitado,
                    senhaDigitada
                );

                const uid = DB.auth.currentUser ? DB.auth.currentUser.uid : null;

                if (uid) {
                    await migrarLegado(uid);
                }

                window.location.href =
                    "tela inicio.html";

            } catch (erro) {

                mostrarNotificacao(
                    "E-mail ou senha incorretos.",
                    "erro"
                );

            }
        }
    );

}


// =========================================
// NOME NA TELA INICIAL
// =========================================

const boasVindas =
    document.getElementById(
        "boasVindas"
    );


const nomePerfil =
    document.getElementById(
        "nomePerfil"
    );


async function inicializarPagina() {
    await DB.ready;

    const nomeUsuario = await obter("usuario.nome");

    if (boasVindas && nomeUsuario) {

        boasVindas.textContent =
            "Bem-vindo, " +
            nomeUsuario +
            "!";

    }

    if (nomePerfil && nomeUsuario) {

        nomePerfil.textContent =
            nomeUsuario;

    }
}

inicializarPagina();


// =========================================
// CONFIRMAR ENCONTRO
// =========================================

const btnConfirmarEncontro =
    document.getElementById(
        "btnConfirmarEncontro"
    );


if (btnConfirmarEncontro) {

    (async function() {

        btnConfirmarEncontro.addEventListener(
            "click",
            async function() {

                btnConfirmarEncontro.textContent =
                    "Presença Confirmada ✓";

                btnConfirmarEncontro.disabled =
                    true;


                await definir(
                    "presenca.proximoEncontro",
                    "confirmada"
                );

            }
        );

        const presencaSalva = await obter(
            "presenca.proximoEncontro"
        );

        if (presencaSalva === "confirmada") {

            btnConfirmarEncontro.textContent =
                "Presença Confirmada ✓";


            btnConfirmarEncontro.disabled =
                true;

        }

    })();


}


// =========================================
// WORKSHOP
// =========================================

const btnWorkshop =
    document.getElementById(
        "btnWorkshop"
    );


if (btnWorkshop) {

    btnWorkshop.addEventListener(
        "click",
        function() {

            mostrarNotificacao(
                "Workshop de Escrita Criativa - 05 de Agosto.",
                "info"
            );

        }
    );

}


// =========================================
// PROGRESSO DO LIVRO
// =========================================

const btnAtualizarProgresso =
    document.getElementById(
        "btnAtualizarProgresso"
    );


const textoProgresso =
    document.getElementById(
        "textoProgresso"
    );


const barraProgresso =
    document.getElementById(
        "barraProgresso"
    );


async function mostrarProgressoSalvo() {

    const progresso =
        await obter(
            "progresso.livro"
        );


    if (
        progresso !== null &&
        progresso !== undefined &&
        textoProgresso &&
        barraProgresso
    ) {

        textoProgresso.textContent =
            "Progresso: " +
            progresso +
            "%";


        barraProgresso.style.width =
            progresso + "%";

    }

}

mostrarProgressoSalvo();


if (btnAtualizarProgresso) {

    btnAtualizarProgresso.addEventListener(
        "click",
        async function() {

            const progresso =
                prompt(
                    "Digite seu progresso de 0 a 100:"
                );


            if (progresso === null) {
                return;
            }


            const valor =
                Number(progresso);


            if (
                !Number.isNaN(valor) &&
                valor >= 0 &&
                valor <= 100
            ) {

                if (textoProgresso) {

                    textoProgresso.textContent =
                        "Progresso: " +
                        valor +
                        "%";

                }


                if (barraProgresso) {

                    barraProgresso.style.width =
                        valor + "%";

                }


                await definir(
                    "progresso.livro",
                    valor
                );

            }

            else {

                mostrarNotificacao(
                    "Digite um número entre 0 e 100.",
                    "aviso"
                );

            }

        }
    );

}


// =========================================
// NOVA LEITURA
// =========================================

const formNovaLeitura =
    document.getElementById(
        "formNovaLeitura"
    );


if (formNovaLeitura) {

    formNovaLeitura.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const titulo =
                document
                    .getElementById("tituloLivro")
                    .value
                    .trim();


            const autor =
                document
                    .getElementById("autorLivro")
                    .value
                    .trim();


            const paginas =
                document
                    .getElementById("paginasLivro")
                    .value;


            await definir(
                "leituras.ultima.titulo",
                titulo
            );


            await definir(
                "leituras.ultima.autor",
                autor
            );


            await definir(
                "leituras.ultima.paginas",
                paginas
            );


            mostrarNotificacao(
                "Livro adicionado à sua estante!",
                "sucesso"
            );


            window.location.href =
                "Minha estante.html";

        }
    );

}


// =========================================
// EDITAR PERFIL
// =========================================

const formEditarPerfil =
    document.getElementById(
        "formEditarPerfil"
    );


if (formEditarPerfil) {

    const campoEditarNome =
        document.getElementById(
            "editarNome"
        );


    if (campoEditarNome) {
        (async function() {
            const nomeAtual =
                await obter(
                    "usuario.nome"
                );

            if (nomeAtual) {

                campoEditarNome.value =
                    nomeAtual;

            }
        })();
    }

    formEditarPerfil.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const nome =
                document
                    .getElementById("editarNome")
                    .value
                    .trim();


            const descricao =
                document.getElementById(
                    "editarDescricao"
                );


            await definir(
                "usuario.nome",
                nome
            );


            if (descricao) {

                await definir(
                    "usuario.descricao",
                    descricao.value
                );
            }


            mostrarNotificacao(
                "Perfil atualizado!",
                "sucesso"
            );


            window.location.href =
                "perfil.html";

        }
    );

}


// =========================================
// DADOS PESSOAIS
// =========================================

const formDados =
    document.getElementById(
        "formDados"
    );


if (formDados) {

    const dadosNome =
        document.getElementById(
            "dadosNome"
        );


    const dadosEmail =
        document.getElementById(
            "dadosEmail"
        );


    if (dadosNome) {
        (async function() {
            dadosNome.value =
                await obter(
                    "usuario.nome"
                ) || "";
        })();
    }


    if (dadosEmail) {
        (async function() {
            dadosEmail.value =
                await obter(
                    "usuario.email"
                ) || "";
        })();
    }


    formDados.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            if (dadosNome) {

                await definir(
                    "usuario.nome",
                    dadosNome.value.trim()
                );

            }


            if (dadosEmail) {

                await definir(
                    "usuario.email",
                    dadosEmail.value.trim()
                );

            }


            mostrarNotificacao(
                "Dados atualizados com sucesso!",
                "sucesso"
            );


            window.location.href =
                "perfil.html";

        }
    );

}


// =========================================
// ADICIONAR CLUBE
// =========================================

const formClube =
    document.getElementById(
        "formClube"
    );


if (formClube) {

    formClube.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const campo =
                document.getElementById(
                    "nomeClube"
                );


            if (campo) {

                await definir(
                    "clube.nome",
                    campo.value.trim()
                );

            }


            mostrarNotificacao(
                "Clube adicionado!",
                "sucesso"
            );


            window.location.href =
                "tela inicio.html";

        }
    );

}


// =========================================
// NOTIFICACOES
// =========================================

const btnSalvarNotificacoes =
    document.getElementById(
        "btnSalvarNotificacoes"
    );


if (btnSalvarNotificacoes) {

    btnSalvarNotificacoes.addEventListener(
        "click",
        function() {

            mostrarNotificacao(
                "Configurações de notificações salvas!",
                "sucesso"
            );


            window.location.href =
                "perfil.html";

        }
    );

}


// =========================================
// BIBLIOTECA - MODAL DE RESUMO
// =========================================

const modalResumo =
    document.getElementById(
        "modalResumo"
    );


const modalTitulo =
    document.getElementById(
        "modalTitulo"
    );


const modalAutor =
    document.getElementById(
        "modalAutor"
    );


const modalTexto =
    document.getElementById(
        "modalTexto"
    );


const fecharModal =
    document.getElementById(
        "fecharModal"
    );


const btnFecharResumo =
    document.getElementById(
        "btnFecharResumo"
    );


function fecharResumo() {

    if (modalResumo) {

        modalResumo.classList.remove(
            "mostrar-modal"
        );

    }
}

function configurarBotoesResumo() {

    const botoesResumo =
        document.querySelectorAll(
            ".btn-resumo"
        );


    botoesResumo.forEach(
        function(botao) {

            botao.addEventListener(
                "click",
                function() {

                    if (!modalResumo) {
                        return;
                    }


                    if (modalTitulo) {

                        modalTitulo.textContent =
                            botao.dataset.titulo ||
                            "Livro";

                    }


                    if (modalAutor) {

                        modalAutor.textContent =
                            botao.dataset.autor ||
                            "";

                    }


                    if (modalTexto) {

                        modalTexto.textContent =
                            botao.dataset.resumo ||
                            "Resumo não disponível.";

                    }


                    modalResumo.classList.add(
                        "mostrar-modal"
                    );

                }
            );

        }
    );
}

function renderizarLivrosFixos() {

    var grid = document.getElementById(
        "bibliotecaGrid"
    );

    if (!grid) {
        return;
    }

    var livros = DB.obterLivros();

    grid.innerHTML = "";

    livros.forEach(
        function(livro) {

            var artigo = document.createElement(
                "article"
            );

            artigo.className = "biblioteca-livro";

            artigo.setAttribute(
                "data-nome",
                livro.dataNome || ""
            );

            artigo.innerHTML =
                '<div class="capa-livro">' +
                '<img src="' + (livro.imagem || "") + '" alt="' + (livro.alt || "") + '">' +
                '</div>' +
                '<div class="livro-informacoes">' +
                '<h2>' + (livro.titulo || "") + '</h2>' +
                '<p class="livro-autor">' + (livro.autor || "") + '</p>' +
                '<button type="button" class="btn-resumo" data-titulo="' + (livro.titulo || "") + '" data-autor="' + (livro.autor || "") + '" data-resumo="' + (livro.resumo || "") + '">' +
                'Ver resumo' +
                '</button>' +
                '<a href="' + (livro.amazonUrl || "") + '" target="_blank" rel="noopener noreferrer" class="btn-amazon">' +
                '<span class="amazon-icone">a</span>' +
                'Comprar na Amazon' +
                '</a>' +
                '</div>';

            grid.appendChild(artigo);

        }
    );

}

function renderizarEncontros() {

    var encontros = DB.obterEncontros();

    var proximo = encontros.proximo || {};

    // tela inicio.html - card "Encontros Agendados"
    var mesEl = document.getElementById("proximoEncontroMes");
    var diaEl = document.getElementById("proximoEncontroDia");
    var tituloEl = document.getElementById("proximoEncontroTitulo");
    var horaEl = document.getElementById("proximoEncontroHora");

    if (proximo.dataHoraTexto) {

        var partes = String(proximo.dataHoraTexto).match(/(\d{1,2})\s+de\s+([^\s,]+)/);

        if (partes && mesEl) {
            mesEl.textContent = partes[2].toUpperCase();
        }

        if (partes && diaEl) {
            diaEl.textContent = partes[1];
        }
    }

    if (proximo.titulo && tituloEl) {
        tituloEl.textContent = proximo.titulo;
    }

    if (proximo.dataHoraTexto && horaEl) {
        horaEl.textContent = "Hoje às " + String(proximo.dataHoraTexto).replace(/.*às\s*/, "");
    }

    // encontros.html - próximo encontro
    var proximoDataEl = document.getElementById("proximoEncontroData");
    var proximoModalidadeEl = document.getElementById("proximoEncontroModalidade");
    var linkSalaEl = document.getElementById("linkSalaEncontro");

    if (proximo.dataHoraTexto && proximoDataEl) {
        proximoDataEl.textContent = proximo.dataHoraTexto;
    }

    if (proximo.modalidade && proximoModalidadeEl) {
        proximoModalidadeEl.textContent = proximo.modalidade;
    }

    if (proximo.meetUrl && linkSalaEl) {
        linkSalaEl.href = proximo.meetUrl;
    }

    // encontros.html - agenda
    var agendaLista = document.getElementById("agendaLista");

    if (agendaLista && Array.isArray(encontros.agenda)) {

        agendaLista.innerHTML = "";

        encontros.agenda.forEach(
            function(item) {

                var card = document.createElement("article");
                card.className = "agenda-card";

                var dataDestaque = (item.mes === "JUL") ? " agenda-data-destaque" : "";

                var detalhesBtn = "";
                if (item.detalhes) {
                    detalhesBtn = '<button type="button" class="agenda-detalhes btn-sem-estilo" id="btnWorkshop">' + item.detalhes + '</button>';
                }

                card.innerHTML =
                    '<div class="agenda-data' + dataDestaque + '">' +
                    '<span>' + (item.mes || "") + '</span>' +
                    '<strong>' + (item.dia || "") + '</strong>' +
                    '</div>' +
                    '<div class="agenda-conteudo">' +
                    '<h3>' + (item.titulo || "") + '</h3>' +
                    '<p>' + (item.medicacaoOuLocal || "") + '</p>' +
                    '</div>' +
                    detalhesBtn;

                agendaLista.appendChild(card);

                if (item.detalhes) {

                    var btnWorkshopDinamico = document.getElementById("btnWorkshop");

                    if (btnWorkshopDinamico) {

                        btnWorkshopDinamico.addEventListener(
                            "click",
                            function() {

                                mostrarNotificacao(item.detalhes, "info");

                            }
                        );

                    }

                }

            }
        );

    }

}

renderizarLivrosFixos();

renderizarEncontros();

configurarBotoesResumo();


if (fecharModal) {

    fecharModal.addEventListener(
        "click",
        fecharResumo
    );

}


if (btnFecharResumo) {

    btnFecharResumo.addEventListener(
        "click",
        fecharResumo
    );

}


if (modalResumo) {

    modalResumo.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                modalResumo
            ) {

                fecharResumo();

            }

        }
    );
}


document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            fecharResumo();

        }

    }
);


// =========================================
// PESQUISA LOCAL DA BIBLIOTECA
// =========================================

const pesquisaLivro =
    document.getElementById(
        "pesquisaLivro"
    );


const nenhumLivro =
    document.getElementById(
        "nenhumLivro"
    );


if (pesquisaLivro) {

    pesquisaLivro.addEventListener(
        "input",
        function() {

            const pesquisa =
                pesquisaLivro
                    .value
                    .toLowerCase()
                    .trim();


            const livros =
                document.querySelectorAll(
                    ".biblioteca-livro"
                );


            let encontrados = 0;


            livros.forEach(
                function(livro) {

                    const texto =
                        (
                            livro.dataset.nome ||
                            livro.textContent
                        )
                        .toLowerCase();


                    if (
                        texto.includes(
                            pesquisa
                        )
                    ) {

                        livro.style.display =
                            "flex";

                        encontrados++;

                    }

                    else {

                        livro.style.display =
                            "none";

                    }

                }
            );


            if (nenhumLivro) {

                nenhumLivro.style.display =
                    encontrados === 0
                        ? "block"
                        : "none";

            }

        }
    );

}


// =========================================
// EXPORTAR / IMPORTAR DADOS (JSON) - DESABILITADOS
// =========================================

const btnExportarDados =
    document.getElementById(
        "btnExportarDados"
    );

const btnImportarDados =
    document.getElementById(
        "btnImportarDados"
    );

if (btnExportarDados) {
    btnExportarDados.disabled = true;
}

if (btnImportarDados) {
    btnImportarDados.disabled = true;
}

// =========================================
// SAIR DA CONTA
// =========================================

const btnSair =
    document.getElementById(
        "btnSair"
    );


if (btnSair) {

    btnSair.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();


            try {

                await DB.ready;

                const moduloAuth = await import(
                    "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
                );

                await moduloAuth.signOut(DB.auth);

            } catch (erro) {

                // ignora falha de logout; segue redirecionando

            }

            window.location.href =
                "cadastro.html";

        }
    );

}


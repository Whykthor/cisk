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

function solicitarBackupJSON() {
    var resposta = confirm("Deseja salvar as alterações em JSON?");

    if (resposta) {
        DB.exportarUsuario("cisk_db_usuario.json");
    }
}

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
// CADASTRO
// =========================================

if (formCadastro) {

    formCadastro.addEventListener(
        "submit",
        function(event) {

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

                alert(
                    "Digite seu nome."
                );

                return;

            }



            if (senha.length < 8) {

                alert(
                    "A senha precisa ter pelo menos 8 caracteres."
                );

                return;

            }



            if (
                campoConfirmar &&
                senha !== confirmarSenha
            ) {

                alert(
                    "As senhas não são iguais."
                );

                return;

            }



            DB.definir(
                "usuario.nome",
                nome
            );


            DB.definir(
                "usuario.email",
                email
            );


            // Temporário enquanto ainda não existe banco.
            DB.definir(
                "usuario.senha",
                senha
            );


            DB.definir(
                "usuario.logado",
                true
            );


            alert(
                "Conta criada com sucesso!"
            );

            solicitarBackupJSON();


            window.location.href ="tela inicio.html";

        }
    );

}



// =========================================
// LOGIN
// =========================================

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        function(event) {

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


            const emailSalvo =
                DB.obter(
                    "usuario.email"
                );


            const senhaSalva =
                DB.obter(
                    "usuario.senha"
                );



            if (
                !emailSalvo ||
                !senhaSalva
            ) {

                alert(
                    "Nenhuma conta cadastrada. Faça seu cadastro primeiro."
                );

                mostrarCadastro();

                return;

            }



            if (
                emailDigitado === emailSalvo &&
                senhaDigitada === senhaSalva
            ) {

                DB.definir(
                    "usuario.logado",
                    true
                );

                solicitarBackupJSON();


                window.location.href =
                    "tela inicio.html";

            }

            else {

                alert(
                    "E-mail ou senha incorretos."
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


if (boasVindas) {

    const nomeUsuario =
        DB.obter(
            "usuario.nome"
        );


    if (nomeUsuario) {

        boasVindas.textContent =
            "Bem-vindo, " +
            nomeUsuario +
            "!";

    }

}



// =========================================
// NOME NO PERFIL
// =========================================

const nomePerfil =
    document.getElementById(
        "nomePerfil"
    );


if (nomePerfil) {

    const nomeUsuario =
        DB.obter(
            "usuario.nome"
        );


    if (nomeUsuario) {

        nomePerfil.textContent =
            nomeUsuario;

    }

}



// =========================================
// CONFIRMAR ENCONTRO
// =========================================

const btnConfirmarEncontro =
    document.getElementById(
        "btnConfirmarEncontro"
    );


if (btnConfirmarEncontro) {

    btnConfirmarEncontro.addEventListener(
        "click",
        function() {

            btnConfirmarEncontro.textContent =
                "Presença Confirmada ✓";


            btnConfirmarEncontro.disabled =
                true;


            DB.definir(
                "presenca.proximoEncontro",
                "confirmada"
            );

        }
    );


    if (
        DB.obter(
            "presenca.proximoEncontro"
        ) === "confirmada"
    ) {

        btnConfirmarEncontro.textContent =
            "Presença Confirmada ✓";


        btnConfirmarEncontro.disabled =
            true;

    }

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

            alert(
                "Workshop de Escrita Criativa - 05 de Agosto."
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



function mostrarProgressoSalvo() {

    const progresso =
        DB.obter(
            "progresso.livro"
        );


    if (
        progresso !== null &&
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
        function() {

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


                DB.definir(
                    "progresso.livro",
                    valor
                );

            }

            else {

                alert(
                    "Digite um número entre 0 e 100."
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
        function(event) {

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


            DB.definir(
                "leituras.ultima.titulo",
                titulo
            );


            DB.definir(
                "leituras.ultima.autor",
                autor
            );


            DB.definir(
                "leituras.ultima.paginas",
                paginas
            );


            alert(
                "Livro adicionado à sua estante!"
            );


            window.location.href =
                "estante.html";

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

        const nomeAtual =
            DB.obter(
                "usuario.nome"
            );


        if (nomeAtual) {

            campoEditarNome.value =
                nomeAtual;
}



}
    formEditarPerfil.addEventListener(
        "submit",
        function(event) {

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


            DB.definir(
                "usuario.nome",
                nome
            );


            if (descricao) {

                DB.definir(
                    "usuario.descricao",
                    descricao.value
                );
            }


            alert(
                "Perfil atualizado!"
            );

            solicitarBackupJSON();


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

        dadosNome.value =
            DB.obter(
                "usuario.nome"
            ) || "";

    }


    if (dadosEmail) {

        dadosEmail.value =
            DB.obter(
                "usuario.email"
            ) || "";

    }


    formDados.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (dadosNome) {

                DB.definir(
                    "usuario.nome",
                    dadosNome.value.trim()
                );

            }


            if (dadosEmail) {

                DB.definir(
                    "usuario.email",
                    dadosEmail.value.trim()
                );

            }


            alert(
                "Dados atualizados com sucesso!"
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
        function(event) {

            event.preventDefault();


            const campo =
                document.getElementById(
                    "nomeClube"
                );


            if (campo) {

                DB.definir(
                    "clube.nome",
                    campo.value.trim()
                );

            }


            alert(
                "Clube adicionado!"
            );

            solicitarBackupJSON();


            window.location.href =
                "tela inicio.html";

        }
    );

}



// =========================================
// NOTIFICAÇÕES
// =========================================

const btnSalvarNotificacoes =
    document.getElementById(
        "btnSalvarNotificacoes"
    );


if (btnSalvarNotificacoes) {

    btnSalvarNotificacoes.addEventListener(
        "click",
        function() {

            alert(
                "Configurações de notificações salvas!"
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

                                alert(item.detalhes);

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
// SAIR DA CONTA
// =========================================

const btnSair =
    document.getElementById(
        "btnSair"
    );


if (btnSair) {

    btnSair.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            DB.definir(
                "usuario.logado",
                false
            );


            window.location.href =
                "acesso.html";

        }
    );

}




// =========================================
// EXPORTAR / IMPORTAR DADOS (JSON)
// =========================================

const btnExportarDados =
    document.getElementById(
        "btnExportarDados"
    );

const btnImportarDados =
    document.getElementById(
        "btnImportarDados"
    );

const inputImportarDados =
    document.getElementById(
        "inputImportarDados"
    );


if (btnExportarDados) {

    btnExportarDados.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            try {

                DB.exportarUsuario();

                alert(
                    "Dados exportados com sucesso! Salve o arquivo em banco de dados/dados-usuario.json."
                );

            } catch (erro) {

                alert(
                    "Erro ao exportar dados: " + erro
                );

            }

        }
    );

}


if (btnImportarDados) {

    btnImportarDados.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            if (inputImportarDados) {
                inputImportarDados.click();
            }

        }
    );

}


if (inputImportarDados) {

    inputImportarDados.addEventListener(
        "change",
        function() {

            var arquivo = this.files && this.files[0];

            if (!arquivo) {
                return;
            }

            var leitor = new FileReader();

            leitor.onload = function() {

                var resultado = DB.importarUsuario(leitor.result);

                if (resultado.ok) {

                    alert(
                        "Dados importados com sucesso!"
                    );

                    location.reload();

                } else {

                    alert(
                        "Erro ao importar: " + resultado.erro
                    );

                }

            };

            leitor.readAsText(arquivo);

        }
    );

}


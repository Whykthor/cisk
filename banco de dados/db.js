// =========================================
// CAMADA DE DADOS (db.js)
// localStorage unificado em "cisk_db_usuario"
// Fixos lidos de window.DB_FIXO (dados-fixos.js, compatível com file://)
// =========================================

(function() {

  "use strict";

  var DB_USUARIO_KEY = "cisk_db_usuario";

  // ---------- Objeto padrão (modelo do banco variável) ----------
  function modeloPadrao() {
    return {
      versao: 1,
      usuario: {
        nome: "",
        email: "",
        senha: "",
        descricao: "",
        logado: false
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
    };
  }

  // ---------- Navegação aninhada segura ----------
  function getCaminho(obj, caminho, padrao) {
    var partes = String(caminho).split(".");
    var atual = obj;
    for (var i = 0; i < partes.length; i++) {
      if (atual === null || atual === undefined || typeof atual !== "object") {
        return padrao;
      }
      atual = atual[partes[i]];
    }
    return atual === undefined ? padrao : atual;
  }

  function setCaminho(obj, caminho, valor) {
    var partes = String(caminho).split(".");
    var atual = obj;
    for (var i = 0; i < partes.length - 1; i++) {
      if (atual[partes[i]] === null || atual[partes[i]] === undefined || typeof atual[partes[i]] !== "object") {
        atual[partes[i]] = {};
      }
      atual = atual[partes[i]];
    }
    atual[partes[partes.length - 1]] = valor;
  }

  // ---------- API pública ----------
  var DB = {

    DB_USUARIO_KEY: DB_USUARIO_KEY,

    // ------- Fixos (leitura apenas) -------
    obterLivros: function() {
      if (window.DB_FIXO && Array.isArray(window.DB_FIXO.livros)) {
        return window.DB_FIXO.livros;
      }
      return [];
    },

    obterEncontros: function() {
      if (window.DB_FIXO && window.DB_FIXO.encontros) {
        return window.DB_FIXO.encontros;
      }
      return { proximo: {}, agenda: [] };
    },

    // ------- Variáveis (JSON unificado no localStorage) -------
    carregarUsuario: function() {
      try {
        var bruto = localStorage.getItem(DB_USUARIO_KEY);
        if (bruto === null || bruto === "") {
          return modeloPadrao();
        }
        var parseado = JSON.parse(bruto);
        if (parseado === null || typeof parseado !== "object" || Array.isArray(parseado)) {
          return modeloPadrao();
        }
        return parseado;
      } catch (e) {
        return modeloPadrao();
      }
    },

    salvarUsuario: function(db) {
      localStorage.setItem(DB_USUARIO_KEY, JSON.stringify(db));
    },

    obter: function(caminho, padrao) {
      var db = DB.carregarUsuario();
      return getCaminho(db, caminho, padrao);
    },

    definir: function(caminho, valor) {
      var db = DB.carregarUsuario();
      setCaminho(db, caminho, valor);
      DB.salvarUsuario(db);
      return valor;
    },

    // ------- Migração automática (uma vez, idempotente, sem perda) -------
    migrarSeNecessario: function() {
      var existente = localStorage.getItem(DB_USUARIO_KEY);
      if (existente !== null && existente !== "") {
        return; // já migrado / já existe o banco unificado
      }

      var db = modeloPadrao();

      // Lê chaves legadas quando presentes (não as apaga).
      var nomeLegado = localStorage.getItem("nomeUsuario");
      if (nomeLegado !== null) {
        db.usuario.nome = nomeLegado;
      }

      var emailLegado = localStorage.getItem("emailUsuario");
      if (emailLegado !== null) {
        db.usuario.email = emailLegado;
      }

      var senhaLegada = localStorage.getItem("senhaUsuario");
      if (senhaLegada !== null) {
        db.usuario.senha = senhaLegada;
      }

      var descricaoLegada = localStorage.getItem("descricaoUsuario");
      if (descricaoLegada !== null) {
        db.usuario.descricao = descricaoLegada;
      }

      var logadoLegado = localStorage.getItem("usuarioLogado");
      if (logadoLegado !== null) {
        db.usuario.logado = (String(logadoLegado).toLowerCase() === "true");
      }

      var progressoLegado = localStorage.getItem("progressoLivro");
      if (progressoLegado !== null) {
        var num = Number(progressoLegado);
        db.progresso.livro = Number.isNaN(num) ? 0 : num;
      }

      var presencaLegada = localStorage.getItem("presencaEncontro");
      if (presencaLegada !== null) {
        db.presenca.proximoEncontro = presencaLegada;
      }

      var ultimaTitulo = localStorage.getItem("ultimaLeituraTitulo");
      if (ultimaTitulo !== null) {
        db.leituras.ultima.titulo = ultimaTitulo;
      }

      var ultimaAutor = localStorage.getItem("ultimaLeituraAutor");
      if (ultimaAutor !== null) {
        db.leituras.ultima.autor = ultimaAutor;
      }

      var ultimaPaginas = localStorage.getItem("ultimaLeituraPaginas");
      if (ultimaPaginas !== null) {
        db.leituras.ultima.paginas = ultimaPaginas;
      }

      var clubeLegado = localStorage.getItem("nomeClube");
      if (clubeLegado !== null) {
        db.clube.nome = clubeLegado;
      }

      DB.salvarUsuario(db);
    },

    // ------- Exportar -------
    exportarUsuario: function(nomeArquivo) {
      nomeArquivo = nomeArquivo || "dados-usuario.json";
      var db = DB.carregarUsuario();
      var exportacao = {
        versao: db.versao !== undefined ? db.versao : 1,
        exportadoEm: new Date().toISOString(),
        usuario: db.usuario,
        clube: db.clube,
        progresso: db.progresso,
        presenca: db.presenca,
        leituras: db.leituras
      };
      var texto = JSON.stringify(exportacao, null, 2);
      var blob = new Blob([texto], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return exportacao;
    },

    // ------- Importar -------
    importarUsuario: function(texto) {
      if (texto === null || texto === undefined) {
        return { ok: false, erro: "Arquivo vazio." };
      }
      var parseado;
      try {
        parseado = JSON.parse(texto);
      } catch (e) {
        return { ok: false, erro: "JSON inválido." };
      }

      if (
        parseado === null ||
        typeof parseado !== "object" ||
        Array.isArray(parseado) ||
        parseado.versao === undefined
      ) {
        return { ok: false, erro: "Estrutura de dados incompatível." };
      }

      DB.salvarUsuario(parseado);
      return { ok: true, erro: null };
    }

  };

  window.DB = DB;

  // Executa migração imediatamente ao carregar (idempotente).
  DB.migrarSeNecessario();

})();

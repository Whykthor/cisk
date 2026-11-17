// =========================================
// CAMADA DE DADOS (db.js)
// Firebase Authentication + Firestore (NoSQL)
// localStorage mantido apenas para one-time migration
// Carregamento do SDK via dynamic import() (CDN), sem <script> nos HTML
// =========================================

(function() {
  "use strict";

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

  var app = null;
  var auth = null;
  var db = null;
  var fs = null;
  var initPromise = null;

  function iniciarFirebase() {
    if (initPromise) {
      return initPromise;
    }
    initPromise = (async function() {
      var configUrl = new URL("./firebase-config.js", document.baseURI).href;
      var configModulo = await import(configUrl);
      var firebaseConfig = configModulo.firebaseConfig;
      var moduloApp = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
      var moduloAuth = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      var moduloFirestore = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      // Garante que os componentes auth e firestore estejam registrados antes de inicializar o app
      app = moduloApp.initializeApp(firebaseConfig);
      auth = moduloAuth.getAuth(app);
      db = moduloFirestore.getFirestore(app);
      fs = moduloFirestore;
      DB.auth = auth;
      DB.db = db;
      DB.fs = fs;
    })();
    initPromise.catch(function(e) {
      console.warn("Falha ao inicializar Firebase:", e);
    });
    return initPromise;
  }

  var DB = {
    auth: undefined,
    db: undefined,
    ready: iniciarFirebase(),

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

    obterEstante: async function() {
      try {
        await initPromise;
      } catch (e) {
        return [];
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !fs || !db) {
        return [];
      }
      var ref = fs.collection(db, "usuarios/" + uid + "/estante");
      var snap = await fs.getDocs(ref);
      var lista = [];
      snap.forEach(function(doc) {
        lista.push(doc.data());
      });
      return lista;
    },

    adicionarEstante: async function(livro) {
      try {
        await initPromise;
      } catch (e) {
        return livro;
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !fs || !db) {
        return livro;
      }
      var ref = fs.doc(db, "usuarios/" + uid + "/estante/" + String(livro.id));
      await fs.setDoc(ref, livro);
      return livro;
    },

    removerEstante: async function(livroId) {
      try {
        await initPromise;
      } catch (e) {
        return;
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !fs || !db) {
        return;
      }
      await fs.deleteDoc(fs.doc(db, "usuarios/" + uid + "/estante/" + String(livroId)));
    },

    obter: async function(caminho, padrao) {
      try {
        await initPromise;
      } catch (e) {
        return padrao;
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !fs || !db) {
        return padrao;
      }
      var ref = fs.doc(db, "usuarios/" + uid);
      var snap = await fs.getDoc(ref);
      if (!snap.exists()) {
        return padrao;
      }
      return getCaminho(snap.data(), caminho, padrao);
    },

    definir: async function(caminho, valor) {
      try {
        await initPromise;
      } catch (e) {
        return valor;
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !fs || !db) {
        return valor;
      }
      var ref = fs.doc(db, "usuarios/" + uid);
      var atualizacao = {};
      atualizacao[caminho] = valor;
      atualizacao["atualizadoEm"] = Date.now();
      await fs.setDoc(ref, atualizacao, { merge: true });
      return valor;
    },

    obterClubes: async function() {
      try {
        await initPromise;
      } catch (e) {
        return [];
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !fs || !db) {
        return [];
      }
      var ref = fs.collection(db, "usuarios/" + uid + "/clubes");
      var snap = await fs.getDocs(ref);
      var lista = [];
      snap.forEach(function(doc) {
        var item = doc.data();
        item.id = doc.id;
        lista.push(item);
      });
      return lista;
    },

    adicionarClube: async function(clube) {
      try {
        await initPromise;
      } catch (e) {
        return clube;
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !fs || !db) {
        return clube;
      }
      var ref = fs.doc(db, "usuarios/" + uid + "/clubes");
      var clubeId = ref.id;
      var agora = Date.now();
      var dados = {
        nome: clube.nome,
        criadoEm: agora,
        atualizadoEm: agora
      };
      await fs.setDoc(ref, dados);
      return Object.assign({}, clube, { id: clubeId, criadoEm: agora, atualizadoEm: agora });
    },

    removerClube: async function(clubeId) {
      try {
        await initPromise;
      } catch (e) {
        return;
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !fs || !db) {
        return;
      }
      await fs.deleteDoc(fs.doc(db, "usuarios/" + uid + "/clubes/" + String(clubeId)));
    },

    obterEncontrosClube: async function(clubeId) {
      try {
        await initPromise;
      } catch (e) {
        return [];
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !clubeId || !fs || !db) {
        return [];
      }
      var ref = fs.collection(db, "usuarios/" + uid + "/clubes/" + String(clubeId) + "/encontros");
      var snap = await fs.getDocs(ref);
      var lista = [];
      snap.forEach(function(doc) {
        var item = doc.data();
        item.id = doc.id;
        lista.push(item);
      });
      return lista;
    },

    adicionarEncontroClube: async function(clubeId, encontro) {
      try {
        await initPromise;
      } catch (e) {
        return encontro;
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !clubeId || !fs || !db) {
        return encontro;
      }
      var ref = fs.doc(db, "usuarios/" + uid + "/clubes/" + String(clubeId) + "/encontros");
      var encontroId = ref.id;
      var agora = Date.now();
      var dados = {
        titulo: encontro.titulo,
        data: encontro.data,
        hora: encontro.hora,
        modalidade: encontro.modalidade,
        localOuLink: encontro.localOuLink,
        criadoEm: agora
      };
      await fs.setDoc(ref, dados);
      return Object.assign({}, encontro, { id: encontroId, criadoEm: agora });
    },

    removerEncontroClube: async function(clubeId, encontroId) {
      try {
        await initPromise;
      } catch (e) {
        return;
      }
      var uid = auth && auth.currentUser ? auth.currentUser.uid : null;
      if (!uid || !fs || !db) {
        return;
      }
      await fs.deleteDoc(fs.doc(db, "usuarios/" + uid + "/clubes/" + String(clubeId) + "/encontros/" + String(encontroId)));
    }
  };

  window.DB = DB;

})();


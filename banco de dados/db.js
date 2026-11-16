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
    }
  };

  window.DB = DB;

})();

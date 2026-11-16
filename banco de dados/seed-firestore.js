const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const JSON_DIR = path.join(ROOT, "banco de dados");

// Caminho da chave de serviço (variável de ambiente ou arquivo padrão)
const SERVICE_ACCOUNT_PATH =
  process.env.FIREBASE_SERVICE_ACCOUNT ||
  path.join(ROOT, "serviceAccountKey.json");

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(
    `Chave de serviço não encontrada: ${SERVICE_ACCOUNT_PATH}\n` +
      "Gere-a no Console do Firebase > Configurações do projeto > Contas de serviço > Gerar nova chave privada."
  );
  process.exit(1);
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

async function lerJson(arquivo) {
  const conteudo = fs.readFileSync(path.join(JSON_DIR, arquivo), "utf8");
  return JSON.parse(conteudo);
}

async function seed() {
  const [livros, encontros, usuarioModelo] = await Promise.all([
    lerJson("livros.json"),
    lerJson("encontros.json"),
    lerJson("dados-usuario.json"),
  ]);

  const batch = db.batch();

  // Coleção pública de livros (id do documento = id do livro)
  livros.forEach((livro) => {
    const ref = db.collection("livros").doc(livro.id);
    batch.set(ref, livro, { merge: true });
  });

  // Documento único com os encontros (configuração global)
  batch.set(db.doc("configuracao/encontros"), encontros, { merge: true });

  // Exemplo de documento de usuário (estrutura vazia, serve de referência)
  batch.set(db.doc("usuarios/_exemplo"), usuarioModelo, { merge: true });

  await batch.commit();
  console.log("Seed concluído com sucesso.");
  console.log(`- ${livros.length} livros gravados na coleção 'livros'.`);
  console.log("- Encontros gravados no documento 'configuracao/encontros'.");
  console.log("- Documento de referência gravado em 'usuarios/_exemplo'.");

  // Verificação rápida
  const snapLivros = await db.collection("livros").count().get();
  console.log(
    `Total de documentos em 'livros': ${snapLivros.data().count}`
  );

  process.exit(0);
}

seed().catch((erro) => {
  console.error("Erro no seed:", erro);
  process.exit(1);
});

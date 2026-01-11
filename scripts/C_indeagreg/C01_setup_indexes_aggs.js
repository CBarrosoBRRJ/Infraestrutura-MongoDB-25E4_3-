/**
 * Parte 2C - Índices + Agregações
 * DB: CB_indeagreg
 * Coleções:
 *  - CB_indexar1 (>=7 atributos, incluindo 1 array) + índices variados, sparse, TTL 20s
 *  - CB_indexar2 (>=4 strings) + índice textual
 *  - CB_Venda (16 docs) + agregações por UF
 */

const dba = db.getSiblingDB("CB_indeagreg");

// limpa DB para ficar determinístico
dba.dropDatabase();

/* =========================
   CB_indexar1
========================= */
dba.createCollection("CB_indexar1");

// 4 docs, >=7 atributos (inclui array)
dba.CB_indexar1.insertMany([
  {
    _id: 1,
    codigo: 1001,
    nome: "Produto A",
    categoria: "Eletronicos",
    preco: 199.9,
    ativo: true,
    tags: ["promo", "novo"],         // array
    email: "a@exemplo.com",          // vamos usar unique
    criadoEm: new Date(),
    expiresAt: new Date(Date.now() + 20000) // TTL (20s) baseado em expiresAt
  },
  {
    _id: 2,
    codigo: 1002,
    nome: "Produto B",
    categoria: "Eletronicos",
    preco: 299.9,
    ativo: true,
    tags: ["destaque"],
    email: "b@exemplo.com",
    criadoEm: new Date(),
    expiresAt: new Date(Date.now() + 20000)
  },
  {
    _id: 3,
    codigo: 1003,
    nome: "Produto C",
    categoria: "Casa",
    preco: 89.9,
    ativo: false,
    tags: ["casa", "liquidacao"],
    // email ausente propositalmente (pra testar sparse)
    criadoEm: new Date(),
    expiresAt: new Date(Date.now() + 20000)
  },
  {
    _id: 4,
    codigo: 1004,
    nome: "Produto D",
    categoria: "Casa",
    preco: 129.9,
    ativo: true,
    tags: ["casa"],
    email: "d@exemplo.com",
    criadoEm: new Date(),
    expiresAt: new Date(Date.now() + 20000)
  }
]);

// Índices solicitados:
// 1) ascendente (ex: codigo)
// 2) descendente unique (ex: email)
// 3) composto (categoria + preco)
// 4) array (tags)
// 5) sparse (email) - útil porque doc _id:3 não tem email
// 6) TTL 20s (expiresAt)
dba.CB_indexar1.createIndex({ codigo: 1 });
dba.CB_indexar1.createIndex({ email: -1 }, { unique: true });
dba.CB_indexar1.createIndex({ categoria: 1, preco: 1 });
dba.CB_indexar1.createIndex({ tags: 1 });
dba.CB_indexar1.createIndex({ email: 1 }, { sparse: true });
dba.CB_indexar1.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

print("OK: CB_indexar1 criado + índices configurados.");
print("Índices CB_indexar1:");
printjson(dba.CB_indexar1.getIndexes());

/* =========================
   CB_indexar2 (texto)
========================= */
dba.createCollection("CB_indexar2");

// 4 docs, >=4 strings
dba.CB_indexar2.insertMany([
  { _id: 1, titulo: "MongoDB para iniciantes", autor: "Ana", resumo: "Curso basico de banco NoSQL", idioma: "pt" },
  { _id: 2, titulo: "Data Engineering", autor: "Bruno", resumo: "Pipelines e ETL com boas praticas", idioma: "en" },
  { _id: 3, titulo: "Indexacao e performance", autor: "Carla", resumo: "Indices, explain e otimizacao", idioma: "pt" },
  { _id: 4, titulo: "Sharding e replicacao", autor: "Davi", resumo: "Alta disponibilidade e escala horizontal", idioma: "pt" }
]);

// índice textual (em múltiplos campos)
dba.CB_indexar2.createIndex({ titulo: "text", resumo: "text", autor: "text" });

print("OK: CB_indexar2 criado + índice textual.");
print("Índices CB_indexar2:");
printjson(dba.CB_indexar2.getIndexes());

/* =========================
   CB_Venda (agregações)
========================= */
dba.createCollection("CB_Venda");

// 16 docs: 4 UFs, 4 docs cada
const vendas = [];
const ufs = ["SP", "RJ", "MG", "PR"];

let id = 1;
for (const uf of ufs) {
  for (let i = 1; i <= 4; i++) {
    vendas.push({
      _id: id++,
      uf,
      valor: 100 * i + (uf.charCodeAt(0) % 7) * 10, // valores variados mas determinísticos
      item: `Item_${uf}_${i}`,
      data: new Date()
    });
  }
}
dba.CB_Venda.insertMany(vendas);

print("OK: CB_Venda criado com 16 docs.");

// Agregações por UF:
// - count
// - total (sum valor)
// - média
// - max
// - min
print("AGG: count por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$uf", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).toArray());

print("AGG: total (sum) por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$uf", total: { $sum: "$valor" } } },
  { $sort: { _id: 1 } }
]).toArray());

print("AGG: média (avg) por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$uf", media: { $avg: "$valor" } } },
  { $sort: { _id: 1 } }
]).toArray());

print("AGG: max por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$uf", max: { $max: "$valor" } } },
  { $sort: { _id: 1 } }
]).toArray());

print("AGG: min por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$uf", min: { $min: "$valor" } } },
  { $sort: { _id: 1 } }
]).toArray());

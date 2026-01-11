/**
 * Parte 2C - Correção CB_Venda conforme enunciado
 * DB: CB_indeagreg
 * Coleção: CB_Venda
 * Campos exigidos:
 *  - Cod_Venda, UF_Venda, Desc_Prod_Vendido, Valor_Venda
 * 16 documentos: 4 UFs x 4 docs
 * Agregações por UF: count, sum, avg, max, min
 */

const dba = db.getSiblingDB("CB_indeagreg");

// recria apenas a coleção CB_Venda (não mexe nas outras)
const cols = dba.getCollectionNames();
if (cols.includes("CB_Venda")) dba.CB_Venda.drop();
dba.createCollection("CB_Venda");

const ufs = ["SP","RJ","MG","PR"];
let cod = 1;
const docs = [];

for (const uf of ufs) {
  for (let i = 1; i <= 4; i++) {
    docs.push({
      Cod_Venda: cod++,
      UF_Venda: uf,
      Desc_Prod_Vendido: `Produto_${uf}_${i}`,
      Valor_Venda: 100 * i + (uf.charCodeAt(0) % 7) * 10
    });
  }
}

dba.CB_Venda.insertMany(docs);

print("OK: CB_Venda recriada conforme enunciado.");
print("Exemplo de documento:");
printjson(dba.CB_Venda.findOne());

print("AGG: numero de documentos por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$UF_Venda", qtd: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).toArray());

print("AGG: valor total por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$UF_Venda", total: { $sum: "$Valor_Venda" } } },
  { $sort: { _id: 1 } }
]).toArray());

print("AGG: media por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$UF_Venda", media: { $avg: "$Valor_Venda" } } },
  { $sort: { _id: 1 } }
]).toArray());

print("AGG: maior valor por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$UF_Venda", max: { $max: "$Valor_Venda" } } },
  { $sort: { _id: 1 } }
]).toArray());

print("AGG: menor valor por UF");
printjson(dba.CB_Venda.aggregate([
  { $group: { _id: "$UF_Venda", min: { $min: "$Valor_Venda" } } },
  { $sort: { _id: 1 } }
]).toArray());

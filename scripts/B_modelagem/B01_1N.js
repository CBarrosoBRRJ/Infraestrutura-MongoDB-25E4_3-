/**
 * Parte 2B - Modelagem 1:N (referência)
 * DB: CB_modelo
 * Coleções: CB_col1a (lado 1), CB_col2a (lado N)
 */

const dbm = db.getSiblingDB("CB_modelo");

// drop seguro
const cols = dbm.getCollectionNames();
if (cols.includes("CB_col1a")) dbm.CB_col1a.drop();
if (cols.includes("CB_col2a")) dbm.CB_col2a.drop();

dbm.createCollection("CB_col1a");
dbm.createCollection("CB_col2a");

dbm.CB_col1a.insertMany([
  { _id: 1, nome: "Mae_A", tipo: "MAE" },
  { _id: 2, nome: "Mae_B", tipo: "MAE" }
]);

dbm.CB_col2a.insertMany([
  { _id: 101, nome: "Filha_A1", maeId: 1 },
  { _id: 102, nome: "Filha_A2", maeId: 1 },
  { _id: 201, nome: "Filha_B1", maeId: 2 },
  { _id: 202, nome: "Filha_B2", maeId: 2 }
]);

print("OK: 1:N criado. Prova: filhas da Mae_A (maeId=1)");

// força materialização + impressão
const filhas = dbm.CB_col2a.find({ maeId: 1 }).toArray();
printjson(filhas);

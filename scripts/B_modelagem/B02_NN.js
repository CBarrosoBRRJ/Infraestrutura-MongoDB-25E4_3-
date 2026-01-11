/**
 * Parte 2B - Modelagem N:N (referência via coleção de relacionamento)
 * DB: CB_modelo
 * Coleções: CB_col1b, CB_col2b, CB_rel1b2b
 */

const dbm = db.getSiblingDB("CB_modelo");

const cols = dbm.getCollectionNames();
if (cols.includes("CB_col1b")) dbm.CB_col1b.drop();
if (cols.includes("CB_col2b")) dbm.CB_col2b.drop();
if (cols.includes("CB_rel1b2b")) dbm.CB_rel1b2b.drop();

dbm.createCollection("CB_col1b");
dbm.createCollection("CB_col2b");
dbm.createCollection("CB_rel1b2b");

// Entidade A: 3 docs
dbm.CB_col1b.insertMany([
  { _id: 1, nome: "A1" },
  { _id: 2, nome: "A2" },
  { _id: 3, nome: "A3" }
]);

// Entidade B: 3 docs
dbm.CB_col2b.insertMany([
  { _id: 10, nome: "B10" },
  { _id: 20, nome: "B20" },
  { _id: 30, nome: "B30" }
]);

// Relações (6 docs) para provar N:N
dbm.CB_rel1b2b.insertMany([
  { _id: 1001, aId: 1, bId: 10 },
  { _id: 1002, aId: 1, bId: 20 },
  { _id: 1003, aId: 2, bId: 20 },
  { _id: 1004, aId: 2, bId: 30 },
  { _id: 1005, aId: 3, bId: 10 },
  { _id: 1006, aId: 3, bId: 30 }
]);

print("OK: N:N criado.");

print("Prova 1: relações de A1 (aId=1)");
printjson(dbm.CB_rel1b2b.find({ aId: 1 }).toArray());

print("Prova 2: A's relacionados ao B20 (bId=20)");
printjson(dbm.CB_rel1b2b.find({ bId: 20 }).toArray());

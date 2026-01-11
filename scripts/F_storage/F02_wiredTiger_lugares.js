var d = db.getSiblingDB("CB_rh");

d.CB_lugares.drop();

d.CB_lugares.insertMany([
  { _id: 1, nome: "Praia",      cidade: "Santos",        uf: "SP" },
  { _id: 2, nome: "Museu",      cidade: "Rio de Janeiro",uf: "RJ" },
  { _id: 3, nome: "Parque",     cidade: "Curitiba",      uf: "PR", obs: "familia" },
  { _id: 4, nome: "Cachoeira",  cidade: "Brotas",        uf: "SP" }
]);

print("OK lugares=" + d.CB_lugares.count());
printjson(d.CB_lugares.find().sort({ _id: 1 }).toArray());

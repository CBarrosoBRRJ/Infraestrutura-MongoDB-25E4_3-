var d = db.getSiblingDB("CB_rh");

d.CB_produtos.drop();

d.CB_produtos.insertMany([
  { _id: 1, nome: "Teclado", preco: 120.0, estoque: 10 },
  { _id: 2, nome: "Mouse", preco: 60.0, estoque: 25 },
  { _id: 3, nome: "Monitor", preco: 900.0, estoque: 5, obs: "promo" },
  { _id: 4, nome: "Cabo USB", preco: 25.0 }
]);

print("OK: inseridos = " + d.CB_produtos.countDocuments({}));
printjson(d.CB_produtos.find().sort({_id:1}).toArray());

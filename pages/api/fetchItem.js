import products from "./products.json";

function post(req, res) {
  const { itemID } = req.body;

  if (!itemID) {
    return res.status(400).send("Missing itemID");
  }

  const product = products.find((p) => p.id === itemID);

  if (!product) {
    return res.status(404).send("Item not found");
  }

  const { hash, filename } = product;
  return res.status(200).send({ hash, filename });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    post(req, res);
  } else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}

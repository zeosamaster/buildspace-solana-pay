import products from "./products.json";
import fs from "fs";

function post(req, res) {
  try {
    const { name, price, image_url, description, filename, hash } = req.body;

    const maxID = Math.max(...products.map((p) => p.id));

    products.push({
      id: maxID + 1,
      name,
      price,
      image_url,
      description,
      filename,
      hash
    });

    fs.writeFileSync(
      "./pages/api/products.json",
      JSON.stringify(products, null, 2)
    );

    return res.status(200).send({ status: "ok" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "error adding product" });
  }
}

export default function handler(req, res) {
  if (req.method === "POST") {
    post(req, res);
  } else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}

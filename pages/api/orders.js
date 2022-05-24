import orders from "./orders.json";
import { writeFile } from "fs/promises";

function get(req, res) {
  const { buyer } = req.query;

  const buyerOrders = orders.filter((order) => order.buyer === buyer);

  if (buyerOrders.length === 0) {
    return res.status(204).send();
  } else {
    return res.status(200).json(buyerOrders);
  }
}

async function post(req, res) {
  try {
    const newOrder = req.body;

    if (
      orders.find(
        ({ buyer, itemID }) =>
          buyer === newOrder.buyer.toString() && itemID === newOrder.itemID
      )
    ) {
      return res.status(400).send("Order already exists");
    }

    orders.push(newOrder);
    await writeFile("./pages/api/orders.json", JSON.stringify(orders, null, 2));
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(400).send(err);
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    case "POST":
      await post(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
  }
}

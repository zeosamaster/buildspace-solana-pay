export const addOrder = async (order) => {
  console.log("adding order ", order, "To DB");
  await fetch("../api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  });
};

export const hasPurchased = async (publicKey, itemID) => {
  const response = await fetch(`../api/orders?buyer=${publicKey.toString()}`);
  if (response.status !== 200) {
    return false;
  }

  const orders = await response.json();
  console.log("Current wallet's orders are:", orders);

  return orders.some(
    (order) => order.buyer === publicKey.toString() && order.itemID === itemID
  );
};

export const fetchItem = async (itemID) => {
  const response = await fetch("../api/fetchItem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemID })
  });
  return response.json();
};

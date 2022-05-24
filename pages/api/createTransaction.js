import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint
} from "@solana/spl-token";
import BigNumber from "bignumber.js";
import products from "./products.json";

const usdcAddress = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);
const sellerAddress = "HM6sBeohe6vfxsJP9JdkA1rYjgjcBxwvqqrnS7xsRxeT";
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (req, res) => {
  try {
    const { buyer, orderID, itemID } = req.body;
    if (!buyer) {
      return res.status(400).json({
        message: "Missing buyer address"
      });
    }

    if (!orderID) {
      return res.status(400).json({
        message: "Missing order ID"
      });
    }

    const itemPrice = products.find((item) => item.id === itemID).price;

    if (!itemPrice) {
      return res.status(404).json({
        message: "Item not found. please check item ID"
      });
    }

    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    const buyerUsdcAddress = await getAssociatedTokenAddress(
      usdcAddress,
      buyerPublicKey
    );
    const shopUsdcAddress = await getAssociatedTokenAddress(
      usdcAddress,
      sellerPublicKey
    );
    console.log({ buyerUsdcAddress, shopUsdcAddress });
    const { blockhash } = await connection.getLatestBlockhash("finalized");

    // This is new, we're getting the mint address of the token we want to transfer
    const usdcMint = await getMint(connection, usdcAddress);

    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey
    });

    // Here we're creating a different type of transfer instruction
    const transferInstruction = createTransferCheckedInstruction(
      buyerUsdcAddress,
      usdcAddress, // This is the address of the token we want to transfer
      shopUsdcAddress,
      buyerPublicKey,
      bigAmount.toNumber() * 10 ** usdcMint.decimals,
      usdcMint.decimals // The token could have any number of decimals
    );

    // The rest remains the same :)
    transferInstruction.keys.push({
      pubkey: new PublicKey(orderID),
      isSigner: false,
      isWritable: false
    });

    tx.add(transferInstruction);

    const serializedTransaction = tx.serialize({
      requireAllSignatures: false
    });
    const base64 = serializedTransaction.toString("base64");

    return res.status(200).json({
      transaction: base64
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "error creating tx" });
  }
};

export default function handler(req, res) {
  if (req.method === "POST") {
    return createTransaction(req, res);
  } else {
    res.status(405).end();
  }
}

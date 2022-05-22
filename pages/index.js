import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import HeadComponent from "../components/Head";
import Product from "../components/Product";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const NonConnectedWallet = () => (
  <div>
    <img
      src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif"
      alt="emoji"
    />

    <div className="button-container">
      <WalletMultiButton className="cta-button connect-wallet-button" />
    </div>
  </div>
);

const Products = ({ products }) => (
  <div className="products-container">
    {products.map((product) => (
      <Product key={product.id} product={product} />
    ))}
  </div>
);

const App = () => {
  const { publicKey } = useWallet();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!publicKey) return;

    fetch(`/api/fetchProducts`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        console.log("Products", { data });
      });
  }, [publicKey]);

  return (
    <div className="App">
      <HeadComponent />
      <div className="container">
        <header className="header-container">
          <p className="header"> 😳 Buildspace Emoji Store 😈</p>
          <p className="sub-text">
            The only emoji store that accepts shitcoins
          </p>
        </header>

        <main>
          {publicKey ? (
            <Products products={products} />
          ) : (
            <NonConnectedWallet />
          )}
        </main>

        <div className="footer-container">
          <img
            alt="Twitter Logo"
            className="twitter-logo"
            src="twitter-logo.svg"
          />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

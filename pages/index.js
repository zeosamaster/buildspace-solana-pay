import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import HeadComponent from "../components/Head";

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

const App = () => {
  // This will fetch the users' public key (wallet address) from any wallet we support
  const { publicKey } = useWallet();

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

        <main>{publicKey ? "Connected!" : <NonConnectedWallet />}</main>

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

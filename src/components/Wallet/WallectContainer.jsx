import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
  } from "@solana/wallet-adapter-react-ui";
  
  import "@solana/wallet-adapter-react-ui/styles.css";
  import {
    ConnectionProvider,
    WalletProvider,
  } from "@solana/wallet-adapter-react";
import Airdrops from "./Airdrops";
  
  const endpoint =
    "https://solana-devnet.g.alchemy.com/v2/diwPPgkKr0uAA8fX5aghdNxvdwjRPcnt";

export default function WallectContainer() {
  return (
    <div className="col-start-2 ">
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>
                <div className="flex gap-5 justify-center">
                <WalletMultiButton />
                <WalletDisconnectButton />
                </div>
                <Airdrops />
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </div>
  )
}

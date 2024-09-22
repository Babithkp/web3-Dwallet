import { useConnection, useWallet } from "@solana/wallet-adapter-react";import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ed25519 } from '@noble/curves/ed25519';

export default function Airdrops() {
  const [amount, setAmount] = useState("");
  const [solBalance, setSolBalance] = useState(0);
  const [toAddress, setToAddress] = useState("");
  const [toAmount, setToAmount] = useState("");
  const wallet = useWallet();
  const { connection } = useConnection();
  const [airDropLoading, setAirDropLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBalance = useCallback(async () => {
    if (wallet.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    }
  }, [wallet.publicKey, connection, setSolBalance]);

  const sendAirDropToUser = async () => {
    if (!wallet.publicKey) {
      toast.error("Wallet not connected!");
      return;
    }

    if (amount <= 0) {
      toast.error("Please enter a valid amount for airdrop");
      return;
    }

    setAirDropLoading(true);
    try {
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );
      if (signature) {
        toast.success("Airdrop successful!");
        fetchBalance();
      }
      setAirDropLoading(false);
      setAmount("");
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast.error(`Airdrop failed: ${error.message}`);
    }
  };

  const solanaTransfer = async () => {
    setTransferLoading(true);
    if (!wallet.publicKey) {
      toast.error("Wallet not connected!");
      setTransferLoading(false);
      return;
    }

    if (toAddress && toAmount) {
      try {
        const {
          context: { slot: minContextSlot },
          value: { blockhash },
        } = await connection.getLatestBlockhashAndContext();

        // Create a transfer transaction
        const transaction = new Transaction({
          feePayer: wallet.publicKey,
          recentBlockhash: blockhash,
        }).add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: toAddress,
            lamports: toAmount * LAMPORTS_PER_SOL,
          })
        );
        await wallet.sendTransaction(transaction, connection, {
          minContextSlot,
        });

        fetchBalance();
        toast.success("Solana transaction sent successfully");
        setToAddress("");
        setToAmount("");
        setTransferLoading(false);
      } catch (e) {
        toast.error(e, "Error sending transaction");
      }
    } else {
      toast.error("Please Enter public key and Amount to transfer");
    }
  };

  const signMessageHandler = async () => {
    if (!wallet.publicKey) {
      toast.error("Wallet not connected!");
      return;
    }
    if (!message) {
      toast.error("Please enter a message to sign");
      return;
    }

    const encodedMessage = new TextEncoder().encode(message);
    const signature = await wallet.signMessage(encodedMessage);

    if (!ed25519.verify(signature, encodedMessage, wallet.publicKey.toBytes())) throw new Error('Message signature invalid!');
    toast.success("Message signed successfully");
  };

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <div className="bg-transparent text-lg text-white">
      <p className="text-xl mt-10">Balance : {solBalance}</p>
      <div className="my-5">
        <label>Get Airdrop</label>
        <div className="flex justify-between  my-2">
          <input
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
            className="w-1/2 px-2 rounded-md text-black"
            value={amount}
          />
          <button
            onClick={sendAirDropToUser}
            className="mr-10 w-1/4 bg-blue-900 p-2 px-3 rounded-md text-base font-medium flex justify-center items-center h-10"
          >
            {airDropLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Get Airdrop"
            )}
          </button>
        </div>
      </div>
      <div className="my-5">
        <label>Send Solana</label>
        <div className="grid grid-cols-2 grid-rows-2 gap-2  my-2">
          <input
            placeholder="Amount"
            onChange={(e) => setToAmount(e.target.value)}
            className="px-2 rounded-md text-black"
            value={toAmount}
          />
          <input
            placeholder="Publick Key"
            onChange={(e) => setToAddress(e.target.value)}
            className=" px-2 rounded-md col-start-1 text-black"
            value={toAddress}
          />
          <button
            onClick={solanaTransfer}
            className="mr-10 h-10 w-1/2 justify-self-end  col-start-2 bg-blue-900 p-2 px-3 rounded-md text-base font-medium flex justify-center items-center"
          >
            {transferLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin " />
            ) : (
              "Send Solona"
            )}
          </button>
        </div>
      </div>
      <section>
        <label>Sign Message</label>
        <div className="flex justify-between gap-2 mt-5">
          <input
            type="text"
            className="w-1/2 px-2 rounded-md text-black"
            placeholder="Write your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={signMessageHandler}
            className="mr-10 w-1/4 bg-blue-900 p-2 px-3 rounded-md text-base font-medium flex justify-center items-center h-10"
          >
            Sign Message
          </button>
        </div>
      </section>
    </div>
  );
}

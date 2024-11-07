window.global ||= window;

import React, { useCallback, useState, useEffect, useMemo } from "react";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { transactionBuilder } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import * as bs58 from "bs58";
import { fetchorderById, saveOrderInfo, updateOrderState } from "../../firebase/query";
import CheckoutForm from "../CheckoutForm"; 
import { toast } from "react-toastify";

function MintBlack({ color }) {
  const [candyMachineAddress, setCandyMachineAddress] = useState(null);
  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    const fetchOrderData = async () => {
      const order = await fetchorderById('4fd7R1QJZqX9JcVRqTqBfJxJUAchW745EvHDVTHoyvDR');
      console.log("Order", order);
    };
    fetchOrderData();

    // Выбираем Candy Machine ID на основе цвета
    let address;
    if (color === "black") {
      address = publicKey(import.meta.env.VITE_BLACK_CANDY_MACHINE_ID);
    } else if (color === "white") {
      address = publicKey(import.meta.env.VITE_WHITE_CANDY_MACHINE_ID);
    } else {
      address = publicKey(import.meta.env.VITE_BLUE_CANDY_MACHINE_ID);
    }
    setCandyMachineAddress(address); // Установка адреса Candy Machine

  }, [color]);

  const mainnetEndpoint = import.meta.env.VITE_NEXT_PUBLIC_RPC || "https://api.mainnet-beta.solana.com";
  const treasury = publicKey(import.meta.env.VITE_NEXT_PUBLIC_TREASURY);

  const umi = useMemo(
    () =>
      createUmi(mainnetEndpoint)
        .use(walletAdapterIdentity(wallet))
        .use(mplCandyMachine())
        .use(mplTokenMetadata()),
    [wallet]
  );

  const handleOrderSubmission = async (orderData, size) => {
    console.log("Order Submitted:", orderData);
    await mintNFT(orderData, size);
  };

  const mintNFT = useCallback(
    async (orderData, size) => {
      try {
        console.log("Minting NFT...");
        const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
        const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
        const nftMint = generateSigner(umi);

        const transaction = await transactionBuilder()
          .add(setComputeUnitLimit(umi, { units: 800_000 }))
          .add(
            mintV2(umi, {
              candyMachine: candyMachine.publicKey,
              candyGuard: candyGuard?.publicKey,
              nftMint,
              collectionMint: candyMachine.collectionMint,
              collectionUpdateAuthority: candyMachine.authority,
              mintArgs: {
                solPayment: { destination: treasury },
              },
            })
          );

        const { signature } = await transaction.sendAndConfirm(umi, {
          confirm: { commitment: "confirmed" },
        });

        const txid = bs58.encode(signature);
        console.log("Mint successful! Transaction ID:", txid);

        const billingInfo = {
          name: orderData.fullName,
          email: orderData.email,
          address: orderData.addressLine1,
          city: orderData.city,
          state: orderData.state,
          zip: orderData.postalCode,
        };

        const nftMetadata = {
          nftAddress: nftMint.publicKey,
          trait: generateRandomTrait(),
          size,
        };

        console.log("NFT Metadata:", nftMetadata);
        await saveOrderInfo(wallet.publicKey.toString(), nftMetadata, billingInfo);

      } catch (error) {
        console.error("Mint failed:", error);
        toast.warn("Mint failed! Please try again.");
      }
    },
    [wallet, umi, candyMachineAddress, treasury]
  );

  function generateRandomTrait() {
    const traits = ["Discount Rate for Krypt Products", "Access to VIP Events", "Exclusive Community Access", "Gift Box Access"];
    const randomIndex = Math.floor(Math.random() * traits.length);
    return traits[randomIndex];
  }

  return (
    <div>
      <CheckoutForm submitOrder={handleOrderSubmission} />
    </div>
  );
}

export default MintBlack;

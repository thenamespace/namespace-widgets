import { usePublicClient, useWalletClient } from "wagmi"
import { ENV } from "../env";

const networkId = ENV.network === "mainnet" ? 1 : 5;

export const useWeb3Clients = () => {
    const publicClient = usePublicClient({chainId: networkId});
    const { data: walletClient } = useWalletClient({chainId: networkId});


    return {
        publicClient,
        walletClient
    }
}
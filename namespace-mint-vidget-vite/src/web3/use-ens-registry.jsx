import { useWeb3Clients } from "./use-web3-client"
import { namehash } from "viem";
import abi from "./abi/registry.json"
import { addresses } from "./addresses";
import { ENV } from "../env";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const contractAddress = addresses[ENV.network].ensRegistry;

export const useEnsRegistry = () => {

    const {publicClient} = useWeb3Clients();
    const isNameTaken = async (name) => {
        const ownerAddress = await publicClient.readContract({
            functionName: "owner",
            args: [namehash(name)],
            abi: abi,
            address: contractAddress
        })
        return ownerAddress !== ZERO_ADDRESS;
    }

    return {
        isNameTaken,
        isReady: publicClient != undefined
    }
}
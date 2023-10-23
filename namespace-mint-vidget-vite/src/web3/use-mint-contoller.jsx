import { useAccount } from "wagmi";
import { addresses } from "./addresses";
import { encodeAbiParameters, namehash, parseAbiParameters, keccak256 } from "viem";
import mintControllerAbi from "./abi/mint-controller-abi.json";
import { ENV } from "../env";
import { useWeb3Clients } from "./use-web3-client";

const contractAddress = addresses[ENV.network].mintController;

export const useMintController = () => {

    const { publicClient, walletClient } = useWeb3Clients();
    const { address } = useAccount();

    const makeCommitment = async ({ parentName, label, secret, subnameOwner, resolver }) => {

        const _commitment = encodeAbiParameters(
            parseAbiParameters("string label, bytes32 parentNode, address[] addresses, bytes extraData, bytes32 secret"),
            [label, namehash(parentName), [subnameOwner,  resolver], "0x0", keccak256(secret)]
        )

        const { request } = await publicClient.simulateContract({
            functionName: "commit",
            abi: mintControllerAbi,
            address: contractAddress,
            args: [keccak256(_commitment)],
            account: address
        })


        return walletClient.writeContract(request)
    }

    const mintSubname = async ({ parentName, label, secret, subnameOwner, resolver, price }) => {
        const _price = price || BigInt(0);

        const { request } = await publicClient.simulateContract({
            functionName: "mintSubdomain",
            abi: mintControllerAbi,
            address: contractAddress,
            args: [label, namehash(parentName), [subnameOwner, resolver], "0x0",  keccak256(secret)],
            value: _price,
            account: address
        })


        return walletClient.writeContract(request)
    }

    return {
        mintSubname,
        makeCommitment
    }
}
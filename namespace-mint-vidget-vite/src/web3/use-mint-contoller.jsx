import { useAccount } from "wagmi";
import { addresses } from "./addresses";
import { encodeAbiParameters, namehash, parseAbiParameters, keccak256, parseEther } from "viem";
import mintControllerAbi from "./abi/mint-controller-abi.json";
import { ENV } from "../env";
import { useWeb3Clients } from "./use-web3-client";

const contractAddress = addresses[ENV.network].mintController;

export const useMintController = () => {

    const { publicClient, walletClient } = useWeb3Clients();
    const { address } = useAccount();

    const makeCommitment = async ({ parentName, label, secret, subnameOwner, resolver, ethPrice, ethPriceSignature }) => {

        const _commitment = encodeAbiParameters(
            parseAbiParameters("string label, bytes32 parentNode, address[] addresses, bytes extraData, uint24 ethPrice, bytes32 secret"),
            [label, namehash(parentName), [subnameOwner, resolver], ethPriceSignature, ethPrice, keccak256(secret)]
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

    const mintSubname = async ({ parentName, label, secret, subnameOwner, resolver, price, ethPrice, ethPriceSignature }) => {
        const _price = price || BigInt(0);

        // add $1 mint fee if price is under $20
        const priceInCents = _price * BigInt(ethPrice);
        if (priceInCents < parseEther("2000")) {
            const oneDollarInEth = parseEther(`${(1 / ethPrice) * 100}`);
            const { request } = await publicClient.simulateContract(
                mintParams(label, parentName, subnameOwner, resolver, ethPriceSignature, ethPrice, secret, price + oneDollarInEth)
            );
            return walletClient.writeContract(request);
        }

        const { request } = await publicClient.simulateContract(
            mintParams(label, parentName, subnameOwner, resolver, ethPriceSignature, ethPrice, secret, price)
        );
        return walletClient.writeContract(request)
    }

    const mintParams = (label, parentName, subnameOwner, resolver, ethPriceSignature, ethPrice, secret, price) => {
        return {
            functionName: "mintSubdomain",
            abi: mintControllerAbi,
            address: contractAddress,
            args: [label, namehash(parentName), [subnameOwner, resolver], ethPriceSignature, ethPrice, keccak256(secret)],
            value: price,
            account: address
        };
    }

    return {
        mintSubname,
        makeCommitment
    }
}
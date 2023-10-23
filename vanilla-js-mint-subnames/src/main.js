import { walletConnectModal } from "./wallet-connect"
import asd from "./styles";
import { watchAccount, disconnect, getAccount } from '@wagmi/core'

let connectedAddress;

const btn = document.createElement("button");
btn.classList.add("connect-btn");
btn.addEventListener("click", () => {
    console.log("clicked!");
    walletConnectModal.open();
})


const main = async() => {

    const isConnected = getAccount().address;
    console.log(isConnected);
}

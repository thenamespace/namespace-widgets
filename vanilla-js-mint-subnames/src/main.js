import { walletConnectModal } from "./wallet-connect"

const connectBtn = document.createElement("btn")
connectBtn.addEventListener("click", () => {
    walletConnectModal.open();
})

const main = document.createElement("div");
main.innerHTML(`
   <button>Connect</button>
`)

const body = document.getElementsByTagName("body")[0];
body.appendChild(main);
body.appendChild(connectBtn);


import { createWeb3Modal, walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'

import { configureChains, createConfig } from '@wagmi/core'
import { mainnet } from '@wagmi/core/chains'
import { publicProvider } from '@wagmi/core/providers/public'
import { InjectedConnector } from '@wagmi/core'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'

// 1. Define constants
const projectId = 'e811e24d56cec721b6d7e53a5644b9c9'

// 2. Configure wagmi client
const { chains, publicClient } = configureChains([mainnet], [
    walletConnectProvider({ projectId }),
    publicProvider()
])

const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
        new EIP6963Connector({ chains }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } }),
        new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } })
    ],
    publicClient
})

// 3. Create modal
const modal = createWeb3Modal({ wagmiConfig, projectId, chains })

export const walletConnectModal = modal;
export const web3Client = publicClient({ chainId: 1 });
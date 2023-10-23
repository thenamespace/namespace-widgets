import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
    mainnet,
    goerli
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
    [mainnet, goerli],
    [
        //   alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'Namespace',
    projectId: 'e811e24d56cec721b6d7e53a5644b9c9',
    chains
});

const wagmiConfig = createConfig({
    autoConnect: false,
    connectors,
    publicClient
})

export const WalletConnector = ({ children }) => {
    return <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
            {children}
        </RainbowKitProvider>
    </WagmiConfig>
}
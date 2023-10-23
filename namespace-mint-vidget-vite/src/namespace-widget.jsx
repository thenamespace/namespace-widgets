import { Button, Typography } from "antd";
import { useEffect, useState } from "react";
import { WalletConnector } from "./web3/wallect-connector";
import { useAccount, useDisconnect } from "wagmi";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { normalize } from "viem/ens";
import { UserProfile } from "./components/user-profile";
import { SearchAndMint } from "./components/search-and-mint";
import "./namespace-widget.css";
import { useWeb3Clients } from "./web3/use-web3-client";
import { ENV } from "./env";

export const NamespaceWidget = () => {

    return <WalletConnector>
        <NamespaceWidgetContent />
    </WalletConnector>
}

const NamespaceWidgetContent = () => {
    const [isContentVisible, setContentVisible] = useState(true);
    const { isConnected, address } = useAccount();
    const { walletClient, publicClient } = useWeb3Clients();

    const isConnectedAndReady = address && walletClient && publicClient;

    return <div className="namespace-widget-container">
        <div className="namespace-widget-content" style={{ display: isContentVisible ? "flex" : "none" }}>
            {!isConnected && <ConnectScreen />}
            {isConnected && (
                isConnectedAndReady ? <ConnectedScreen
                    connectedAddress={address}
                    walletClient={walletClient}
                    publicClient={publicClient} /> : <LoadingScreen />
            )}
        </div>
        <Button type="primary" className="widget-button" onClick={() => setContentVisible(!isContentVisible)}>
            <img src={ENV.CDN + "/ninja-logo.png"} width="40px" height="40px"></img>
            <Typography color="white" weight="bold">Namespace</Typography>
            {isContentVisible ? <FaChevronDown /> : <FaChevronUp />}
        </Button>
    </div>
}

const LoadingScreen = () => {
    return <div className="connect-page-container">
        <p>LOADING!!!!</p>
    </div>
}

const ConnectScreen = () => {
    return <div className="connect-page-container">
        <Typography.Title level={4} style={{ margin: 0 }}> Connect your wallet </Typography.Title>
        <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 10 }}>and start
            <span style={{ color: "red" }}> minting! </span></Typography.Title>
        <ConnectButton />
        <div className="powered-by-namespace">
            <img src={ENV.CDN + "/ninja-logo.png"} width="20px" height="20px"></img>
            <Typography level={4}>Powered by <a href="https://app.namespace.ninja"
                target="_blank">Namespace.ninja©</a></Typography>
        </div>
    </div>
}

const ConnectedScreen = ({ connectedAddress, publicClient }) => {

    const { disconnect } = useDisconnect();
    const [ensName, setEnsName] = useState()
    const [ensAvatar, setEnsAvatar] = useState();
    const [isEnsProfileLoading, setEnsProfileLoading] = useState(true);

    useEffect(() => {
        const init = async () => {

            setEnsProfileLoading(true);

            let _ensName = "No name"
            let _ensAvatar = ENV.CDN + "/ninja-logo.png"
            const ensName = await publicClient.getEnsName({ address: connectedAddress })
            if (ensName) {
                _ensName = ensName;
                const ensAvatar = await publicClient.getEnsAvatar({ name: normalize(ensName) })
                if (ensAvatar) {
                    _ensAvatar = ensAvatar;
                }
            }
            setEnsAvatar(_ensAvatar);
            setEnsName(_ensName);
            setEnsProfileLoading(false);
        }
        init();
    }, [connectedAddress])

    return <div className="connected-page-container">
        <div className="user-profile-container">
            <UserProfile
                ensAvatar={ensAvatar}
                ensName={ensName}
                onDisconnect={() => disconnect()}
                address={connectedAddress}
                isLoading={isEnsProfileLoading}></UserProfile>
        </div>
        <div style={{ width: "100%", marginBottom: "15px" }}>
            <SearchAndMint />
        </div>
        <div className="powered-by-namespace">
            <img src={ENV.CDN + "/ninja-logo.png"} width="20px" height="20px"></img>
            <Typography level={4}>Powered by <a href="https://app.namespace.ninja"
                target="_blank">Namespace.ninja©</a></Typography>
        </div>
    </div>
}
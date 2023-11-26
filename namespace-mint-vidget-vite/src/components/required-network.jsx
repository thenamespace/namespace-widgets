import { Button, Spin } from "antd";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import { ENV } from "../env";
import Typography from "antd/es/typography/Typography";

export const RequiredNetwork = ({ children }) => {

    const { isConnected, isConnecting } = useAccount();
    const { chain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();

    if (isConnected && chain) {
        if (chain.id !== ENV.networkId) {
            const currentNetwork = chain.id === 1 ? "Mainnet" : "Goerli";
            const supportedNetwork = chain.id === 1 ? "Goerli" : "Mainnet";
            return <div style={{ width: "100%", height: "100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <Typography style={{fontWeight:"bold", fontSize:14}}>Unsupported network</Typography>
                <Typography style={{fontSize:11, color:"#ACACAC"}}>You are currently connected to {currentNetwork} </Typography>
                <Typography style={{fontSize:11, color:"#ACACAC", marginBottom:15}}>Switch to {supportedNetwork} to continue</Typography>
                <Button onClick={() => switchNetworkAsync(ENV.networkId)} type="primary" size="large">Switch</Button>
            </div>
        }
    }
    return <>
        {children}
    </>
}
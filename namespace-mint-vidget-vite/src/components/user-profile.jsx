import { Popconfirm, Spin, Tooltip, Typography } from "antd"
import "./user-profile.css"
import { VscDebugDisconnect } from "react-icons/vsc";


const shortenAddress = (addr) => {
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 6);
}


export const UserProfile = ({ ensName, ensAvatar, address, onDisconnect, isLoading }) => {

    return <div className="user-profile">
        {isLoading && <div className="name-loading">
            <Spin />
        </div>}
        {!isLoading && <>
            <img className="avatar" src={ensAvatar} width="32px" height="32px"></img>
            <div style={{ marginLeft: 5 }}>
                <Typography style={{ fontSize: 12, fontWeight: "bold", lineHeight: 1.3 }}>{ensName}</Typography>
                <Typography style={{ fontSize: 10, lineHeight: 1 }}>{shortenAddress(address)}</Typography>
            </div>
            <Popconfirm title="Disconnect" onConfirm={() => onDisconnect()}>
                <VscDebugDisconnect style={{ marginLeft: 6, cursor: "pointer" }}/>
            </Popconfirm>
            
        </>}
    </div>
}
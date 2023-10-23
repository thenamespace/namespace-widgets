import { WalletConnector } from './web3/wallect-connector'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { Col, Modal, Row } from 'antd';
import { ENV } from "./env";

function App() {

  return (
    <>
      <WalletConnector>
        <div>Hello There</div>
        <Widget />
      </WalletConnector>
    </>
  )
}

const Widget = () => {

  const [isVisible, setVisible] = useState(true);
  const { address, isConnected } = useAccount();

  return <Row style={{ padding:10, position:"fixed", top:"0px", width:"100%", height: "65px", background: "lightblue", borderBottom: "1px solid lightgrey" }}>
    <Col span={12}>
      hello there
    </Col>
    <Col span={12}>
       {(!isConnected || !address) && <ConnectButton/>}
    </Col>
  </Row>
}

export default App

import { useEffect, useState } from "react";
import { useMintController } from "../web3/use-mint-contoller";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { Button, Col, Dropdown, Input, Popconfirm, Progress, Row, Spin, Typography } from "antd";
import { AiOutlineClose } from "react-icons/ai";
import { addresses } from "../web3/addresses";
import { ENV } from "../env";
import { getListingPrice } from "./utils";
import "./mint-subname.css";
import { useWeb3Clients } from "../web3/use-web3-client";
import { LuTimer } from "react-icons/lu"

const NOT_STARTED = 0;
const COMMITMENT_SENT = 1;
const TIMER_STARTED = 2;
const TIMER_COMPLETED = 3;
const REGISTRATION_SENT = 4;
const REGISTRATION_COMPLETED = 5;

const publicResolverAddress = addresses[ENV.network].publicResolver
let _interval;

export const MintSubname = ({ parentListing, labelName, onCancel }) => {

    const [step, setStep] = useState(NOT_STARTED);
    const { publicClient } = useWeb3Clients();
    const { makeCommitment, mintSubname } = useMintController();
    const { address: connectedAddress } = useAccount();
    const [subnameOwner, setSubnameOwner] = useState(connectedAddress);
    const [waitingForWallet, setWaitingForWallet] = useState(false);
    const [waitingForTx, setWaitingForTx] = useState(false);
    const [timer, setTimer] = useState(60);
    const [error, setError] = useState(true);
    const [txHash, setTxHash] = useState();

    useEffect(() => {
        if (step === TIMER_STARTED) {
            const interval = setInterval(() => {
                setTimer((timer) => {
                    if (timer <= 0) {
                        onTimerCompleted()
                        return 0;
                    }
                    return timer - 1;
                });
            }, 1000);
            _interval = interval;
            return () => clearInterval(interval);
        } else if (step === TIMER_COMPLETED) {
            if (_interval) {
                clearInterval(_interval);
                _interval = null;
            }
        } 
    }, [step])

    const onTimerCompleted = () => {
        setStep(TIMER_COMPLETED)
    }

    const _makeCommitment = async () => {
        try {
            setWaitingForWallet(true)
            const { fullName } = parentListing;
            const commitment = {
                parentName: fullName,
                label: labelName,
                secret: "secret",
                subnameOwner: subnameOwner,
                resolver: publicResolverAddress
            }
            const txHash = await makeCommitment(commitment);
            setWaitingForWallet(false)
            setStep(COMMITMENT_SENT)
            setWaitingForTx(true);
            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
            setWaitingForTx(false);
            setStep(TIMER_STARTED)
        } catch (error) {
            console.error(error);
        } finally {
            setWaitingForTx(false);
            setWaitingForWallet(false);
        }
    }

    const _mint = async () => {
        try {
            const { fullName } = parentListing;
            const price = getListingPrice(parentListing, subnameOwner).WEI;
            const commitment = {
                parentName: fullName,
                label: labelName,
                secret: "secret",
                subnameOwner: subnameOwner,
                resolver: publicResolverAddress,
                price
            }
            setWaitingForWallet(true)
            const tx = await mintSubname(commitment);
            setWaitingForWallet(false);
            setWaitingForTx(true);
            setStep(REGISTRATION_SENT)
            const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
            setWaitingForTx(false);
            setStep(REGISTRATION_COMPLETED)
        } catch (error) {
            console.error(error)
        } finally {
            setWaitingForTx(false);
            setWaitingForWallet(false);
        }
    }

    const StepPending = <Spin size="large" />
    const StepNotStarted = <Progress type="circle" size={40} percent={0} strokeWidth={17} format={() => { }} />
    const StepCompleted = <Progress type="circle" size={40} percent={100} strokeWidth={17} />

    return <div className="subname-minting-container">
        <Row>
            <Col span={24} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "270px" }}>
                {step === NOT_STARTED && <div>
                    <div style={{ textAlign: "center", margin: 15 }}>
                        <Typography style={{ fontSize: 12, color: "#ACACAC" }}>You are about to mint</Typography>
                        <Typography style={{ fontSize: 15, fontWeight: "bold" }}>{`${labelName}.${parentListing.fullName}`}</Typography>
                        <Typography style={{ fontSize: 12, color: "#ACACAC" }}>Price <Typography.Text style={{ color: "black", fontWeight: "bold", fontSize: 12 }}>
                            {getListingPrice(parentListing, labelName).ETH} ETH
                        </Typography.Text></Typography>
                    </div>
                    <Typography className="registration-subtitle">Subname owner</Typography>
                    <Input
                        style={{ fontSize: 11, marginTop: 3 }}
                        placeholder="Owner address"
                        status={!isAddress(subnameOwner) && "error"}
                        value={subnameOwner}
                        onChange={(e) => setSubnameOwner(e.target.value)}></Input>
                </div>}
                {(step > NOT_STARTED && step < REGISTRATION_COMPLETED) && <div style={{ marginTop: 10 }}>
                    <Row style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                        <Col span={5}>
                            {step === COMMITMENT_SENT && StepPending}
                            {step > COMMITMENT_SENT && StepCompleted}

                        </Col>
                        <Col span={19}>
                            <Typography style={{ fontSize: 13 }} className="registration-title txt-bold">Commitment sent</Typography>
                            <Typography style={{ fontSize: 12 }} className="registration-subtitle">Wait for commitment transaction to pass and start 60 second waiting period</Typography>
                        </Col>
                    </Row>
                    <Row style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                        <Col span={5}>
                            {step < TIMER_STARTED && StepNotStarted}
                            {step === TIMER_STARTED && StepPending}
                            {step > TIMER_STARTED && StepCompleted}
                        </Col>
                        <Col span={19}>
                            <Typography style={{ fontSize: 13 }} className="registration-title txt-bold">Waiting period</Typography>
                            <Typography style={{ fontSize: 12 }} className="registration-subtitle">Wait for 60 seconds to make sure no one else tries to register this name.</Typography>
                        </Col>
                    </Row>
                    <Row style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                        <Col span={5}>
                            {step < REGISTRATION_SENT && StepNotStarted}
                            {step === REGISTRATION_SENT && StepPending}
                            {step > REGISTRATION_SENT && StepCompleted}
                        </Col>
                        <Col span={19}>
                            <Typography style={{ fontSize: 13 }} className="registration-title txt-bold">Completed registration</Typography>
                            <Typography style={{ fontSize: 12 }} className="registration-subtitle">Complete the second transaction to secure your name.</Typography>
                        </Col>
                    </Row>
                    <div>
                        {step === TIMER_STARTED && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3px" }}>
                            <LuTimer />
                            <Typography style={{ fontSize: 12, fontWeight: "bold", marginLeft: 5 }}>00:{timer < 10 ? "0" + timer : timer}</Typography>
                        </div>}
                    </div>
                </div>}
                {
                    step === REGISTRATION_COMPLETED && <div style={{ display: "flex", justifyContent: "center", marginTop: 25, alignItems: "center", flexDirection: "column" }}>
                        <Progress type={"circle"} size={60} percent={100} strokeWidth={15}></Progress>
                        <Typography style={{ marginTop: 15 }} className="registration-subtitle">You have successfully minted</Typography>
                        <Typography className="registration-title"><Typography.Text className="registration-title txt-bold">{labelName}</Typography.Text>.{parentListing.fullName}</Typography>
                    </div>
                }
                <div className="mint-actions">
                    {step === NOT_STARTED && <>
                        <Button style={{ width: "50%", marginRight: 5 }}
                            disabled={!isAddress(subnameOwner)}
                            loading={waitingForWallet}
                            type="primary"
                            size="large"
                            onClick={() => _makeCommitment()}>Confirm</Button>
                        <Button size="large" style={{width:"50%"}} onClick={() => onCancel()}>
                            Cancel
                        </Button>
                    </>}
                    {(step > NOT_STARTED && step < REGISTRATION_COMPLETED) && <Button
                        style={{ width: "100%" }}
                        loading={waitingForTx || waitingForWallet}
                        disabled={step !== TIMER_COMPLETED}
                        type="primary"
                        size="large"
                        onClick={() => _mint()}>
                        {waitingForWallet && "Waiting for wallet"}
                        {waitingForTx && "Waiting for transaction"}
                        {(!waitingForTx && !waitingForWallet) && "Register"}
                    </Button>}
                    {
                        step === REGISTRATION_COMPLETED && <Button size="large" type="primary" style={{ width: "100%" }} onClick={() => onCancel()}>Great</Button>
                    }
                </div>
            </Col>
        </Row>
    </div>
}

const PreCommitmentScreen = ({ subname }) => {
    return <div>

    </div>
}

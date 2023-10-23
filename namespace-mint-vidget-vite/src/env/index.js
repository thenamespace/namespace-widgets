import { isAddress } from "viem";

export const NETWORK_GOERLI = "goerli";
export const NETWORK_MAINNET = "mainnet";
export const ZERO_ADDR = "0x0";

const GOERLI_API = "https://staging_app.namespace.ninja"
const MAINNET_API = "https://app.namespace.ninja"

const defaultEnvironment = {
    names: [],
    owner: ZERO_ADDR,
    network: NETWORK_GOERLI,
    networkId: 5,
    backendAPI: GOERLI_API,
    CDN: "https://namespace-widgets.fra1.cdn.digitaloceanspaces.com/namespace-vite-widget"
}

const areValidNames = (names) => {
    if (!names || !names.length) {
        return false;
    }
    return true;
}

const isValidNetwork = (networkName) => {
    if (!networkName || typeof networkName !== "string") {
        return false;
    }
    return networkName === NETWORK_GOERLI || networkName == NETWORK_MAINNET;
}

const isValidAddress = (ownerAddr) => {
    if (!ownerAddr || typeof ownerAddr !== "string") {
        return false;
    }
    return isAddress(ownerAddr);
}

const getNetworkId = (networkName) => {
    const networks = {
        mainnet: 1,
        goerli: 5
    }
    return networks[networkName];
}

const loadConfiguration = () => {
    const config = document.getElementById("namespace-widget-config")
    if (!config) {
      console.info("Namespace widget is not configure, using default configuration")
      return defaultEnvironment;
    }


    const _configNames = config.getAttribute("names");
    let parsedNames = [];
    if (_configNames && _configNames.length > 0) {
        parsedNames = _configNames.split(",").map(name => name.trim());
    }
    const _configNetwork = config.getAttribute("network");
    const _configOwner = config.getAttribute("owner");
    const injectedConfig = {...defaultEnvironment};


    injectedConfig.names = areValidNames(parsedNames) ? parsedNames : []
    injectedConfig.owner = isValidAddress(_configOwner) ? _configOwner : ZERO_ADDR;
    injectedConfig.network = isValidNetwork(_configNetwork) ? _configNetwork :  NETWORK_GOERLI
    injectedConfig.networkId = getNetworkId(injectedConfig.network)
    injectedConfig.backendAPI = injectedConfig.network === NETWORK_GOERLI ? GOERLI_API : MAINNET_API;

    return injectedConfig;
  }

export const ENV = loadConfiguration();
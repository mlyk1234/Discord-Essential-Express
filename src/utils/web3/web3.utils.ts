import { JsonFragmentType } from "@ethersproject/abi";
import { ethers, Signer } from "ethers";
import { ErrorCode } from "../error-handler/error-code";
import { ErrorException } from "../error-handler/error-exception";
import STANDARD_ABI from "./abis/arb.abi.json";

export const providerWallet = "0xFdeaD6307Bb131aFE19121CEc34BF4A11Da0bd69";
export const providerPrivateKey = "6dd8dcfde06503dca5918329319e0b1773a73e6c8d907fb309476832771a7c20";

export const infura_key = "660872984add4e5aaa994611b3f5ca74";

export const providers: {[key: string]: any} = {
    "INFURA": () => {
        return new ethers.providers.InfuraProvider('goerli', infura_key);
    },
    "QUICKNODE": () => {
        // Arbitrum testnet rpc supported from quiknode
        return new ethers.providers.JsonRpcProvider("https://dry-clean-field.arbitrum-goerli.discover.quiknode.pro/8719a6bfcb0ea719b6c860c940af4976247a22cc/");
    },
    "BSC_TESTNET": () => {
        // For BSC indirectly
        // https://docs.bscscan.com/misc-tools-and-utilities/public-rpc-nodes
        return new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
    },
    "AVALANCHE_TESTNET": () => {
        // For Avalanche Fuji indirectly
        // https://docs.avax.network/quickstart/fuji-workflow
        return new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
    },
    "POLYGON_TESTNET": () => {
        // For Avalanche Fuji indirectly
        // https://docs.avax.network/quickstart/fuji-workflow
        return new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
    },
    "OPTIMISM_TESTNET": () => {
        // For Avalanche Fuji indirectly
        // https://docs.avax.network/quickstart/fuji-workflow
        return new ethers.providers.JsonRpcProvider("https://goerli.optimism.io");
    }
}


export const signer = (network: string) => {
    switch(network) {
        case "Arbitrum Testnet":
            return new ethers.Wallet(providerPrivateKey, providers["QUICK"]());
        case "BSC Testnet":
            return new ethers.Wallet(providerPrivateKey, providers["BSC_TESTNET"]());
        case "Avalanche Testnet":
            return new ethers.Wallet(providerPrivateKey, providers["AVALANCHE_TESTNET"]());
        case "Polygon Testnet":
            return new ethers.Wallet(providerPrivateKey, providers["POLYGON_TESTNET"]());
        case "Optimism Testnet":
            return new ethers.Wallet(providerPrivateKey, providers["OPTIMISM_TESTNET"]());
        default:
            throw new ErrorException(ErrorCode.NotFound, {message: "[Internal Error in signer]: Probably invalid network"})
    }
}

interface IConfig {
    signer: any,
    wallet: string,
    decimals?: number
}

export const _Transfer = {
    "USDC": async (contractAddress: string, config: IConfig) => await _USDC_TX(contractAddress, config),
    "WBTC": async (contractAddress: string, config: IConfig) => await _WBTC_TX(contractAddress, config),
    "WETH": async (contractAddress: string, config: IConfig) => await _WETH_TX(contractAddress, config),
}

export const decimals: {[key: string]: {[key: string]: number}} = {
    "Goerli": {
        "USDC": 6,
        "WBTC": 8,
        // "WETH": 8 isNative
    },
    "Arbitrum Testnet": {
        "USDC": 6,
        "WBTC": 8
    },
    "BSC Testnet": {
        "USDC": 18,
        "WBTC": 18
    },
    "Avalanche Testnet": {
        "USDC": 6,
        "WBTC": 8
    },
    "Polygon Testnet": {
        "USDC": 6,
        "WBTC": 8
    },
    "Optimism Testnet": {
        "USDC": 6,
        "WBTC": 8
    }
}

export const _USDC_TX = async (contractAddress: string, config: IConfig) => {
    const contract = new ethers.Contract(contractAddress, STANDARD_ABI, config.signer);
    const numberOfTokens = ethers.utils.parseUnits('10.0', config.decimals);

    return contract.transfer(config.wallet, numberOfTokens);
}

export const _WBTC_TX = async (contractAddress: string, config: IConfig) => {
    const contract = new ethers.Contract(contractAddress, STANDARD_ABI, config.signer);
    const numberOfTokens = ethers.utils.parseUnits('0.1', config.decimals);

    return contract.transfer(config.wallet, numberOfTokens);

    // ;TODO log or send msg if owner balance not enough
}

export const _WETH_TX = async (contractAddress: string, config: IConfig) => {
    const contract = new ethers.Contract(contractAddress, STANDARD_ABI, config.signer);
    const numberOfTokens = ethers.utils.parseUnits('0.1', config.decimals);

    return contract.transfer(config.wallet, numberOfTokens);

    // ;TODO log or send msg if owner balance not enough
}
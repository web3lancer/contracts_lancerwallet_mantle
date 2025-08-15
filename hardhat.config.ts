import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// dotenv may be missing in the environment; guard the import
try { dotenv.config(); } catch {}

const MANTLE_MAINNET = process.env.MANTLE_MAINNET_RPC ?? process.env.MANTLE_RPC_URL ?? "https://rpc.mantle.xyz";
const MANTLE_SEPOLIA = process.env.MANTLE_SEPOLIA_RPC ?? process.env.MANTLE_SEPOLIA_URL ?? "https://rpc.sepolia.mantle.xyz";
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY ?? process.env.PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  defaultNetwork: "mantleSepolia",
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    mantle: {
      url: MANTLE_MAINNET,
      accounts: ACCOUNT_PRIVATE_KEY ? [ACCOUNT_PRIVATE_KEY] : [],
      chainId: 5000,
    },
    mantleSepolia: {
      url: MANTLE_SEPOLIA,
      accounts: ACCOUNT_PRIVATE_KEY ? [ACCOUNT_PRIVATE_KEY] : [],
      chainId: 5001,
    },
    hardhat: {},
  },
};

export default config;

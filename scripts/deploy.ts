import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  // Get network name from command line or default to hardhat
  const networkName = process.env.HARDHAT_NETWORK || "mantleSepolia";
  
  // Use environment variables directly or fallback to known Mantle Sepolia RPC
  let rpcUrl: string;
  let privateKey: string;
  
  if (networkName === "mantleSepolia") {
    rpcUrl = process.env.MANTLE_SEPOLIA_RPC_URL || process.env.MANTLE_SEPOLIA_RPC || "https://rpc.sepolia.mantle.xyz";
    privateKey = process.env.PRIVATE_KEY || process.env.ACCOUNT_PRIVATE_KEY || "";
  } else if (networkName === "mantle") {
    rpcUrl = process.env.MANTLE_MAINNET_RPC_URL || process.env.MANTLE_RPC_URL || "https://rpc.mantle.xyz";
    privateKey = process.env.PRIVATE_KEY || process.env.ACCOUNT_PRIVATE_KEY || "";
  } else {
    throw new Error(`Unsupported network: ${networkName}. Use mantleSepolia or mantle`);
  }
  
  if (!privateKey) {
    throw new Error("No private key found. Make sure PRIVATE_KEY is set in .env");
  }
  
  console.log("Network:", networkName);
  console.log("RPC URL:", rpcUrl);
  
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  const deployer = new ethers.Wallet(privateKey, provider);
  console.log("Deploying with:", deployer.address);

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });

  // Deploy EscrowManager
  const escrowArtifact = await hre.artifacts.readArtifact("EscrowManager");
  const EscrowFactory = new ethers.ContractFactory(escrowArtifact.abi, escrowArtifact.bytecode, deployer);
  const escrow = await EscrowFactory.deploy();
  await escrow.waitForDeployment();
  console.log("EscrowManager deployed to:", await escrow.getAddress());

  // Deploy Identity
  const identityArtifact = await hre.artifacts.readArtifact("Identity");
  const IdentityFactory = new ethers.ContractFactory(identityArtifact.abi, identityArtifact.bytecode, deployer);
  const identity = await IdentityFactory.deploy();
  await identity.waitForDeployment();
  console.log("Identity deployed to:", await identity.getAddress());

  // Deploy ReputationRegistry
  const reputationArtifact = await hre.artifacts.readArtifact("ReputationRegistry");
  const ReputationFactory = new ethers.ContractFactory(reputationArtifact.abi, reputationArtifact.bytecode, deployer);
  const reputation = await ReputationFactory.deploy();
  await reputation.waitForDeployment();
  console.log("ReputationRegistry deployed to:", await reputation.getAddress());

  const out: Record<string, string> = {
    EscrowManager: await escrow.getAddress(),
    Identity: await identity.getAddress(),
    ReputationRegistry: await reputation.getAddress(),
  };

  const outPath = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("Wrote deployments to", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
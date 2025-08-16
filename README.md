# Web3Lancer Contracts - Mantle

Smart contracts for the Web3Lancer platform deployed on Mantle network.

## Contracts

### Core Contracts
- **EscrowManager**: Handles escrow creation, release, and refunds for freelance payments
- **Identity**: Manages user registration and KYC verification
- **ReputationRegistry**: Tracks user reputation through reviews and ratings

## Deployment

### Mantle Sepolia Testnet

Latest deployment addresses:

| Contract | Address |
|----------|---------|
| EscrowManager | `0x6ff1561da1cce79765E2F541196894F9EF0BC170` |
| Identity | `0xb97A756bC016FaA099AFE4c9e2e8FA6E9F55c05a` |
| ReputationRegistry | `0xa71e7C9516b835b4A543568E4f5FC78d628FaC48` |

### Deploy Commands

1. Set up environment:
```bash
cp .env.sample .env
# Fill in PRIVATE_KEY and MANTLE_SEPOLIA_RPC_URL
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Deploy to Mantle Sepolia:
```bash
npx hardhat run --network mantleSepolia scripts/deploy.ts
```

4. Deploy to Mantle Mainnet:
```bash
npx hardhat run --network mantle scripts/deploy.ts
```

### Network Configuration

- **Mantle Sepolia**: Chain ID 5003
- **RPC URL**: https://rpc.sepolia.mantle.xyz
- **Explorer**: https://sepolia.mantlescan.xyz
- **Faucet**: https://faucet.sepolia.mantle.xyz

## Development

```bash
# Install dependencies
npm install

# Run tests
npx hardhat test

# Start local node
npx hardhat node
```
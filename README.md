# WS Votes

A Solana voting program built with the Anchor framework that enables the creation and management of voting polls on the Solana blockchain.

## Overview

WS Votes is a decentralized voting application that allows users to create polls with specified start and end times. Each poll is stored as a Program Derived Address (PDA) on the Solana blockchain, ensuring secure and transparent voting records.

## Features

- **Poll Initialization**: Create new voting polls with unique IDs, descriptions, and time windows
- **PDA-based Storage**: Each poll is stored as a Program Derived Address using the poll ID as a seed
- **Time-bound Polls**: Polls have configurable start and end timestamps
- **Anchor Framework**: Built using Anchor for type-safe Solana program development

## Prerequisites

Before you begin, ensure you have the following installed:

- [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.18.0 or later)
- [Anchor Framework](https://www.anchor-lang.com/docs/installation) (v0.32.1 or later)
- [Node.js](https://nodejs.org/) (v16 or later)
- [Yarn](https://yarnpkg.com/) (v3.1.1 or later)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ws_votes
```

2. Install dependencies:
```bash
yarn install
```

3. Build the Anchor program:
```bash
anchor build
```

## Project Structure

```
ws_votes/
├── programs/
│   └── ws_votes/
│       └── src/
│           └── lib.rs          # Main program logic
├── tests/
│   └── ws_votes.ts             # TypeScript tests
├── migrations/
│   └── deploy.ts               # Deployment script
├── Anchor.toml                 # Anchor configuration
├── Cargo.toml                  # Rust dependencies
└── package.json                # Node.js dependencies
```

## Program Details

### Program ID
```
13cPJfvm6R4Z965utk47dDgemVdGVN2wSbgE9zZ1zHzg
```

### Instructions

#### `initialize_voting`

Creates a new voting poll with the specified parameters.

**Parameters:**
- `poll_id` (u64): Unique identifier for the poll
- `poll_start` (u64): Unix timestamp for when the poll starts
- `poll_end` (u64): Unix timestamp for when the poll ends
- `description` (String): Description of the poll (max 32 characters)

**Accounts:**
- `signer` (mut, signer): The account that pays for and signs the transaction
- `poll` (init): The poll account to be created (PDA)
- `system_program`: The Solana System Program

### Account Structure

```rust
pub struct Poll {
    pub poll_id: u64,
    pub description: String,        // max 32 characters
    pub poll_start: u64,
    pub poll_end: u64,
    pub candidate_amount: u64
}
```

The poll account is stored as a PDA with seeds derived from the `poll_id`.

## Configuration

The project is configured for Solana devnet by default. Configuration can be found in `Anchor.toml`:

- **Cluster**: devnet
- **Wallet**: Configured in `Anchor.toml` (update with your wallet path)
- **Program ID**: `13cPJfvm6R4Z965utk47dDgemVdGVN2wSbgE9zZ1zHzg`

## Building

Build the program:
```bash
anchor build
```

This will:
- Compile the Rust program
- Generate the IDL (Interface Definition Language) file
- Create the program binary

## Testing

Run the test suite:
```bash
anchor test
```

Or use the custom test script:
```bash
yarn test
```

Alternatively, run tests with explicit environment variables:
```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com ANCHOR_WALLET=/Users/air/.config/solana/devnet-keypair.json npx ts-mocha -p ./tsconfig.json -t 1000000 "tests/**/*.ts"
```

The tests are located in `tests/ws_votes.ts` and demonstrate how to:
- Connect to the Solana cluster
- Initialize a new voting poll
- Interact with the program

## Deployment

### Deploy to Devnet

1. Ensure your Solana CLI is configured for devnet:
```bash
solana config set --url devnet
```

2. Airdrop SOL to your wallet (if needed):
```bash
solana airdrop 2
```

3. Deploy the program:
```bash
anchor deploy
```

Or use the migration script:
```bash
anchor run deploy
```

### Deploy to Mainnet

1. Update `Anchor.toml` to use mainnet:
```toml
[provider]
cluster = "mainnet"
```

2. Build for mainnet:
```bash
anchor build
```

3. Deploy:
```bash
anchor deploy
```

## Usage Example

### TypeScript/JavaScript

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import idl from "./target/idl/ws_votes.json";

// Setup provider and program
const provider = anchor.AnchorProvider.env();
const program = new Program(idl, provider);

// Initialize a poll
const pollId = new BN(1);
const pollStart = new BN(Math.floor(Date.now() / 1000)); // Current time
const pollEnd = new BN(Math.floor(Date.now() / 1000) + 86400); // 24 hours later
const description = "Election 2024";

const tx = await program.methods
  .initializeVoting(pollId, pollStart, pollEnd, description)
  .rpc();

console.log("Transaction signature:", tx);
```

## Development

### Linting

Check code formatting:
```bash
yarn lint
```

Auto-fix formatting issues:
```bash
yarn lint:fix
```

### Adding New Features

1. Add new instructions in `programs/ws_votes/src/lib.rs`
2. Update the account structures as needed
3. Add corresponding tests in `tests/ws_votes.ts`
4. Rebuild and test:
```bash
anchor build
anchor test
```

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure you have the correct Rust and Anchor versions installed
2. **Deployment Failures**: Check that you have sufficient SOL in your wallet
3. **Test Failures**: Verify your Solana CLI is configured for the correct cluster

### Getting Help

- [Anchor Documentation](https://www.anchor-lang.com/docs)
- [Solana Documentation](https://docs.solana.com/)
- [Anchor Discord](https://discord.gg/anchorlang)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

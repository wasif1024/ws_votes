# 🗳️ WS Votes

> A decentralized voting system built on Solana blockchain using the Anchor framework

[![Anchor](https://img.shields.io/badge/Anchor-0.32.1-blue)](https://www.anchor-lang.com/)
[![Solana](https://img.shields.io/badge/Solana-1.18+-purple)](https://solana.com/)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange)](https://www.rust-lang.org/)

WS Votes is a fully functional on-chain voting application that enables the creation of polls, candidate registration, and transparent vote casting on the Solana blockchain. Built with Anchor for type-safe Solana program development.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Program API](#-program-api)
- [Usage Examples](#-usage-examples)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## ✨ Features

- **🗳️ Poll Management**: Create voting polls with unique IDs, descriptions, and configurable time windows
- **👥 Candidate Registration**: Add multiple candidates to polls with automatic tracking
- **✅ Voting System**: Cast votes for candidates with on-chain vote counting
- **🔐 Secure PDA-based Storage**: All accounts use Program Derived Addresses (PDAs) for secure, deterministic addressing
- **📊 Automatic Tracking**: Polls automatically track the number of registered candidates
- **⚡ Type-Safe**: Built with Anchor framework for compile-time type safety

## 🏗️ Architecture

### Account Models

#### Poll Account
Each poll is stored as a PDA with seeds derived from the `poll_id`. This ensures deterministic addressing and prevents poll ID collisions.

```rust
pub struct Poll {
    pub poll_id: u64,              // Unique poll identifier
    pub description: String,        // Poll description (max 32 chars)
    pub poll_start: u64,           // Start timestamp
    pub poll_end: u64,             // End timestamp
    pub candidate_amount: u64      // Number of registered candidates
}
```

#### Candidate Account
Candidates are stored as PDAs with seeds combining `poll_id` and `candidate_name`, ensuring unique candidate addresses per poll.

```rust
pub struct Candidate {
    pub candidate_name: String,    // Candidate name (max 32 chars)
    pub poll_id: u64,              // Associated poll ID
    pub candidate_vote: u64        // Vote count
}
```

## 🚀 Getting Started

### Prerequisites

- **Rust** (latest stable version) - [Install](https://www.rust-lang.org/tools/install)
- **Solana CLI** (v1.18.0 or later) - [Install](https://docs.solana.com/cli/install-solana-cli-tools)
- **Anchor Framework** (v0.32.1 or later) - [Install](https://www.anchor-lang.com/docs/installation)
- **Node.js** (v16 or later) - [Install](https://nodejs.org/)
- **Yarn** (v3.1.1 or later) - [Install](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ws_votes
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Build the program**
   ```bash
   anchor build
   ```

   This will:
   - Compile the Rust program
   - Generate the IDL (Interface Definition Language) file
   - Create the program binary

## 📖 Program API

### Program ID
```
13cPJfvm6R4Z965utk47dDgemVdGVN2wSbgE9zZ1zHzg
```

### Instructions

#### 1. `initialize_voting`

Creates a new voting poll with the specified parameters.

**Parameters:**
- `poll_id` (u64): Unique identifier for the poll
- `poll_start` (u64): Unix timestamp for when the poll starts
- `poll_end` (u64): Unix timestamp for when the poll ends
- `description` (String): Description of the poll (max 32 characters)

**Accounts:**
- `signer` (mut, signer): The account that pays for and signs the transaction
- `poll` (init): The poll account to be created (PDA with seed: `poll_id`)
- `system_program`: The Solana System Program

**Example:**
```typescript
await program.methods
  .initializeVoting(
    new BN(1),                              // poll_id
    new BN(Math.floor(Date.now() / 1000)),  // poll_start
    new BN(Math.floor(Date.now() / 1000) + 86400),  // poll_end (24h later)
    "Best Programming Language"             // description
  )
  .rpc();
```

---

#### 2. `initialize_candidate`

Registers a new candidate for an existing poll. Automatically increments the poll's candidate count.

**Parameters:**
- `candidate_name` (String): Name of the candidate (max 32 characters)
- `poll_id` (u64): The poll ID this candidate belongs to

**Accounts:**
- `signer` (mut, signer): The account that pays for and signs the transaction
- `poll` (mut): The poll account (PDA with seed: `poll_id`)
- `candidate` (init): The candidate account to be created (PDA with seeds: `poll_id`, `candidate_name`)
- `system_program`: The Solana System Program

**Example:**
```typescript
await program.methods
  .initializeCandidate("Rust", new BN(1))  // candidate_name, poll_id
  .rpc();
```

---

#### 3. `vote`

Casts a vote for a specific candidate in a poll.

**Parameters:**
- `candidate_name` (String): Name of the candidate to vote for
- `poll_id` (u64): The poll ID

**Accounts:**
- `signer` (signer): The account signing the transaction
- `poll`: The poll account (PDA with seed: `poll_id`)
- `candidate` (mut): The candidate account (PDA with seeds: `poll_id`, `candidate_name`)

**Example:**
```typescript
await program.methods
  .vote("Rust", new BN(1))  // candidate_name, poll_id
  .rpc();
```

## 💻 Usage Examples

### Complete Voting Workflow

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import idl from "./target/idl/ws_votes.json";

// Setup
const provider = anchor.AnchorProvider.env();
const program = new Program(idl, provider);

const pollId = new BN(1);
const now = Math.floor(Date.now() / 1000);

// Step 1: Create a poll
const createPollTx = await program.methods
  .initializeVoting(
    pollId,
    new BN(now),
    new BN(now + 86400),  // 24 hours
    "Favorite Programming Language"
  )
  .rpc();
console.log("Poll created:", createPollTx);

// Step 2: Add candidates
await program.methods.initializeCandidate("Rust", pollId).rpc();
await program.methods.initializeCandidate("TypeScript", pollId).rpc();
await program.methods.initializeCandidate("Python", pollId).rpc();

// Step 3: Cast votes
await program.methods.vote("Rust", pollId).rpc();
await program.methods.vote("Rust", pollId).rpc();
await program.methods.vote("TypeScript", pollId).rpc();

// Step 4: Fetch poll data
const [pollAddress] = PublicKey.findProgramAddressSync(
  [pollId.toArrayLike(Buffer, "le", 8)],
  program.programId
);
const poll = await program.account.poll.fetch(pollAddress);
console.log("Poll:", poll);
console.log("Total candidates:", poll.candidateAmount.toString());

// Step 5: Fetch candidate data
const [candidateAddress] = PublicKey.findProgramAddressSync(
  [
    pollId.toArrayLike(Buffer, "le", 8),
    Buffer.from("Rust")
  ],
  program.programId
);
const candidate = await program.account.candidate.fetch(candidateAddress);
console.log("Rust votes:", candidate.candidateVote.toString());
```

### Deriving Account Addresses

```typescript
// Derive Poll PDA
const [pollAddress] = PublicKey.findProgramAddressSync(
  [pollId.toArrayLike(Buffer, "le", 8)],
  program.programId
);

// Derive Candidate PDA
const [candidateAddress] = PublicKey.findProgramAddressSync(
  [
    pollId.toArrayLike(Buffer, "le", 8),
    Buffer.from("CandidateName")
  ],
  program.programId
);
```

## 🧪 Testing

### Run All Tests

```bash
anchor test
```

Or use the custom test script:

```bash
yarn test
```

### Run Tests with Explicit Environment Variables

```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=/Users/air/.config/solana/devnet-keypair.json \
npx ts-mocha -p ./tsconfig.json -t 1000000 "tests/**/*.ts"
```

### Test Coverage

The test suite (`tests/ws_votes.ts`) includes:

- ✅ Poll initialization
- ✅ Candidate registration
- ✅ Vote casting
- ✅ Account data verification

## 🚢 Deployment

### Configuration

The project is configured for Solana devnet by default. Configuration is in `Anchor.toml`:

- **Cluster**: devnet
- **Wallet**: `/Users/air/.config/solana/devnet-keypair.json`
- **Program ID**: `13cPJfvm6R4Z965utk47dDgemVdGVN2wSbgE9zZ1zHzg`

### Deploy to Devnet

1. **Configure Solana CLI**
   ```bash
   solana config set --url devnet
   ```

2. **Airdrop SOL** (if needed)
   ```bash
   solana airdrop 2
   ```

3. **Deploy**
   ```bash
   anchor deploy
   ```

   Or use the migration script:
   ```bash
   anchor run deploy
   ```

### Deploy to Mainnet

1. **Update `Anchor.toml`**
   ```toml
   [provider]
   cluster = "mainnet"
   ```

2. **Build**
   ```bash
   anchor build
   ```

3. **Deploy**
   ```bash
   anchor deploy
   ```

## 📁 Project Structure

```
ws_votes/
├── programs/
│   └── ws_votes/
│       ├── src/
│       │   └── lib.rs          # Main program logic
│       └── Cargo.toml          # Rust dependencies
├── tests/
│   └── ws_votes.ts             # TypeScript test suite
├── migrations/
│   └── deploy.ts               # Deployment script
├── target/
│   ├── idl/                    # Generated IDL files
│   └── types/                  # Generated TypeScript types
├── Anchor.toml                 # Anchor configuration
├── Cargo.toml                  # Workspace Cargo config
├── package.json                # Node.js dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🛠️ Development

### Code Formatting

Check formatting:
```bash
yarn lint
```

Auto-fix formatting:
```bash
yarn lint:fix
```

### Adding New Features

1. Add instructions in `programs/ws_votes/src/lib.rs`
2. Update account structures as needed
3. Add tests in `tests/ws_votes.ts`
4. Rebuild and test:
   ```bash
   anchor build
   anchor test
   ```

### Building from Source

```bash
# Clean build artifacts
anchor clean

# Build the program
anchor build

# Run tests
anchor test
```

## 🔍 Troubleshooting

### Common Issues

**Build Errors**
- Ensure you have the correct Rust and Anchor versions installed
- Run `anchor clean` and rebuild

**Deployment Failures**
- Verify you have sufficient SOL in your wallet
- Check that the program ID matches in `Anchor.toml` and `lib.rs`

**Test Failures**
- Ensure Solana CLI is configured for the correct cluster
- Verify wallet has sufficient balance for test transactions

### Getting Help

- [Anchor Documentation](https://www.anchor-lang.com/docs)
- [Solana Documentation](https://docs.solana.com/)
- [Anchor Discord](https://discord.gg/anchorlang)

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ using Anchor and Solana**

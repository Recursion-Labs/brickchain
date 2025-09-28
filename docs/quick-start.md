# Quick Start Guide (for Hackathons)

Welcome, hackers! This guide will help you get a local instance of BrickChain up and running in minutes so you can start building your DApp.

## For Windows Users: Using WSL

To follow this guide on Windows, you'll need to use the Windows Subsystem for Linux (WSL). This will provide you with a Linux environment directly on your Windows machine.

1.  **Install WSL:** Open PowerShell as an administrator and run:
    ```bash
    wsl --install
    ```
2.  **Restart your computer.**
3.  **Choose a Linux distribution:** We recommend Ubuntu. You can install it from the Microsoft Store.
4.  **Open your Linux distribution:** Once installed, open it from the Start Menu. You'll be prompted to create a username and password.

For more detailed instructions, follow the [official Microsoft WSL installation guide](https://docs.microsoft.com/en-us/windows/wsl/install).

From now on, all commands should be run inside your WSL terminal.

## 5-Minute Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/brickchain.git
cd brickchain
```

### 2. Install Dependencies

First, install the project-wide dependencies:

```bash
npm install
```

### 3. Install Midnight Development Tools

BrickChain is built on the Midnight network. You'll need to install the Compact compiler and other development tools.

Follow the official **[Midnight Installation Guide](https://docs.midnight.network/getting-started/installation)** to set up your environment. This will guide you through installing the necessary toolchain to work with Compact smart contracts.

### 4. Start the Local Development Environment

We use Docker to run a local version of the Midnight network.

```bash
docker-compose -f docker/prod/compose.yaml up -d
```

This will start a local Midnight node, a proof server, and an indexer.

## Your First Token (Backend)

Now, let's deploy the smart contract and mint a token using the CLI.

### 1. Deploy the Contract

```bash
cd contracts
npm run deploy:local
```

This will compile the contract and deploy it to your local network. You should see a contract address in the output.

### 2. Mint a Token

```bash
cd ../cli

# Mint 1000 tokens to a recipient address
# (replace with an address from your wallet)
npm run mint -- --to 0x... --amount 1000
```

You have now created your first token on your local BrickChain instance!

## Frontend Interaction

Let's connect the frontend to see your token balance.

### 1. Start the Frontend

```bash
cd ../app
npm run dev
```

The application will be available at `http://localhost:3000`.

### 2. See Your Balance

The starter frontend is already set up to connect to your local contract. Open the app in your browser, connect your wallet, and you should be able to see the balance of the tokens you minted.

The relevant code for connecting to the contract can be found in `app/src/index.ts`.

## Hackathon Project Ideas

Here are some ideas to get you started:

*   **Fractionalized NFT Marketplace:** Build a UI to tokenize and trade fractions of NFTs.
*   **Private DAO Voting:** Create a system where token holders can vote on proposals without revealing their identity.
*   **Real Estate Crowdfunding Platform:** Allow users to crowdfund real estate investments by purchasing tokens.
*   **Decentralized Identity:** Use BrickChain tokens to represent and manage digital identities with privacy.
*   **Gaming Integration:** Integrate BrickChain tokens as an in-game currency with private transactions.

## Where to Go Next

This guide was just the beginning. To dive deeper, check out our comprehensive documentation:

*   **[Development Setup Guide](./development-setup.md):** For a more detailed setup process.
*   **[CLI Usage Guide](./cli-usage.md):** To explore all the features of the CLI.
*   **[Smart Contracts](./smart-contracts.md):** For a deep dive into the contract architecture.
*   **[Architecture](./architecture.md):** To understand the overall system design.

Happy hacking!
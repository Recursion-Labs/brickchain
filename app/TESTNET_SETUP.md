# 🌙 Midnight Testnet Setup Guide

This guide will help you set up your Cardano wallet for Midnight testnet development and testing.

## 🎯 Prerequisites

- A Cardano wallet (Lace recommended for Midnight)
- Basic understanding of blockchain testnet vs mainnet
- Internet connection for downloading wallet and accessing faucets

## 📱 Supported Wallets

### Recommended: Lace Wallet
- **Best for Midnight**: Officially supported by IOG
- **Download**: [https://www.lace.io/](https://www.lace.io/)
- **Features**: Built-in testnet support, modern UI, Midnight-ready

### Alternative Wallets
- **Nami**: [https://namiwallet.io/](https://namiwallet.io/)
- **Eternl**: [https://eternl.io/](https://eternl.io/)
- **Flint**: [https://flint-wallet.com/](https://flint-wallet.com/)
- **Typhon**: [https://typhonwallet.io/](https://typhonwallet.io/)

## 🔧 Step-by-Step Setup

### Step 1: Install Lace Wallet

1. **Download Lace**
   - Visit [https://www.lace.io/](https://www.lace.io/)
   - Download for your browser (Chrome, Firefox, Edge)
   - Install the browser extension

2. **Create or Import Wallet**
   - Create a new wallet OR import existing seed phrase
   - **IMPORTANT**: Use a separate wallet for testnet (never use mainnet funds)
   - Secure your seed phrase safely

### Step 2: Switch to Testnet

1. **Open Lace Wallet**
   - Click on the Lace extension icon
   - Navigate to Settings (gear icon)

2. **Network Settings**
   - Find "Network" or "Blockchain" settings
   - Switch from "Mainnet" to "Preprod Testnet"
   - Confirm the network change

3. **Verify Network**
   - Check that wallet shows "Preprod" or "Testnet"
   - Balance should show 0 ADA (normal for new testnet wallet)

### Step 3: Get Test ADA

1. **Access Cardano Testnet Faucet**
   - Visit: [https://faucet.preprod.cardano.org/faucet](https://faucet.preprod.cardano.org/faucet)
   - Alternative: [https://testnets.cardano.org/en/testnets/cardano/tools/faucet/](https://testnets.cardano.org/en/testnets/cardano/tools/faucet/)

2. **Request Test ADA**
   - Copy your testnet wallet address from Lace
   - Paste address into faucet
   - Complete any required verification (captcha, etc.)
   - Submit request

3. **Wait for Confirmation**
   - Test ADA should arrive within 5-10 minutes
   - Check your Lace wallet balance
   - You should receive 1000+ test ADA

### Step 4: Connect to Midnight Platform

1. **Open Midnight App**
   - Navigate to the Midnight Real Estate platform
   - Click "Connect Wallet" button

2. **Select Lace Wallet**
   - Choose Lace from the wallet options
   - Approve connection in Lace popup
   - Grant necessary permissions

3. **Verify Connection**
   - Check that wallet shows "Connected"
   - Verify network shows "Testnet"
   - Confirm ADA balance is visible

## ⚠️ Important Notes

### Security Best Practices
- **Never use mainnet funds on testnet**
- **Keep testnet and mainnet wallets separate**
- **Test ADA has no real value**
- **Don't share seed phrases or private keys**

### Network Validation
- **Network ID 0** = Cardano Testnet ✅
- **Network ID 1** = Cardano Mainnet ❌ (don't use for testing)
- Always verify you're on testnet before testing

### Troubleshooting
- **No test ADA received**: Check faucet limits, try different faucet
- **Wrong network**: Double-check wallet network settings
- **Connection issues**: Refresh page, try different browser
- **Wallet not detected**: Ensure wallet extension is enabled

## 🔍 Verification Checklist

Before using Midnight features, ensure:

- [ ] ✅ Lace wallet installed and set up
- [ ] ✅ Wallet switched to Preprod testnet
- [ ] ✅ Test ADA received (1000+ ADA recommended)
- [ ] ✅ Wallet connected to Midnight platform
- [ ] ✅ Network shows "Testnet" in the app
- [ ] ✅ Balance visible and correct

## 🌐 Useful Resources

### Cardano Testnet
- **Faucet**: [https://faucet.preprod.cardano.org/faucet](https://faucet.preprod.cardano.org/faucet)
- **Explorer**: [https://preprod.cardanoscan.io/](https://preprod.cardanoscan.io/)
- **Documentation**: [https://developers.cardano.org/docs/get-started/testnets-and-devnets](https://developers.cardano.org/docs/get-started/testnets-and-devnets)

### Midnight Network
- **Documentation**: [https://docs.midnight.network/](https://docs.midnight.network/)
- **Developer Portal**: [https://developers.midnight.network/](https://developers.midnight.network/)
- **Community**: [https://discord.gg/midnight](https://discord.gg/midnight)

### Mesh.js Integration
- **Documentation**: [https://meshjs.dev/](https://meshjs.dev/)
- **React Hooks**: [https://meshjs.dev/react/wallet-hooks](https://meshjs.dev/react/wallet-hooks)
- **Examples**: [https://meshjs.dev/examples](https://meshjs.dev/examples)

## 🆘 Getting Help

If you encounter issues:

1. **Check Network**: Ensure you're on Cardano testnet (Network ID: 0)
2. **Verify Balance**: Confirm you have test ADA
3. **Browser Issues**: Try incognito mode or different browser
4. **Wallet Issues**: Restart wallet extension
5. **Platform Issues**: Refresh the Midnight app

### Support Channels
- **Midnight Discord**: [https://discord.gg/midnight](https://discord.gg/midnight)
- **Cardano Community**: [https://forum.cardano.org/](https://forum.cardano.org/)
- **GitHub Issues**: Report bugs in the project repository

## 🚀 Next Steps

Once your testnet wallet is set up:

1. **Explore Features**: Try property registration and tokenization
2. **Test Transactions**: Practice with small amounts first
3. **Learn ZK Proofs**: Understand privacy features
4. **Join Community**: Connect with other developers
5. **Build Projects**: Start developing on Midnight

---

**Remember**: Testnet is for development and testing only. Never use real funds or sensitive data on testnet environments.
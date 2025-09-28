import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wallet,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Copy,
  RefreshCw,
  LogOut,
  RotateCcw,
} from "lucide-react";
import {
  useMidnightWallet,
  useMidnightWalletConnection,
  useMidnightWalletState,
} from "@/lib/midnight-wallet-provider";
import { useStore } from "@/lib/store";

export default function MidnightWalletConnect() {
  const { isConnected, isConnecting, error, connectWallet, disconnectWallet } =
    useMidnightWalletConnection();
  const { walletState, refreshWalletState } = useMidnightWalletState();
  const { isWalletInstalled, getServiceConfig } = useMidnightWallet();
  const {
    connectWallet: storeConnectWallet,
    disconnectWallet: storeDisconnectWallet,
  } = useStore();

  const [copied, setCopied] = useState(false);
  const [serviceConfig, setServiceConfig] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load service configuration
  const loadServiceConfig = async () => {
    try {
      const serviceResults = await getServiceConfig();
      console.log("🔄 Refreshing network configuration...");
      
      // Process the array of service results into the expected format
      const processedConfig = {
        node: false,
        indexer: false,
        proofServer: false
      };
      
      serviceResults?.forEach((service: any) => {
        if (service.name === 'Node') {
          processedConfig.node = service.status === 'healthy';
          console.log(`📡 Node: ${processedConfig.node ? '✅ Connected' : '❌ Disconnected'}`);
        } else if (service.name === 'Indexer') {
          processedConfig.indexer = service.status === 'healthy';
          console.log(`📊 Indexer: ${processedConfig.indexer ? '✅ Connected' : '❌ Disconnected'}`);
        } else if (service.name === 'Proof Server') {
          processedConfig.proofServer = service.status === 'healthy';
          console.log(`🔐 Proof Server: ${processedConfig.proofServer ? '✅ Connected' : '❌ Disconnected'}`);
        }
      });
      
      setServiceConfig(processedConfig);
      console.log("✨ Network refresh complete");
    } catch (error) {
      console.error("❌ Failed to load service configuration:", error);
      setServiceConfig({ node: false, indexer: false, proofServer: false });
    }
  };

  // Combined refresh function
  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      // Refresh wallet state
      await refreshWalletState();

      // Refresh service configuration
      await loadServiceConfig();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sync with global store when wallet state changes
  useEffect(() => {
    if (isConnected && walletState) {
      storeConnectWallet(null, walletState.address, {
        balance: walletState.balance,
        name: "Midnight Lace Wallet",
      });
    } else {
      disconnectWallet();
    }
  }, [isConnected, walletState, connectWallet, disconnectWallet]);

  // Load service configuration when connected
  useEffect(() => {
    loadServiceConfig();
  }, [isConnected]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  const copyAddress = async () => {
    if (walletState?.address) {
      await navigator.clipboard.writeText(walletState.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
  };

  const openLaceWallet = () => {
    window.open(
      "https://chromewebstore.google.com/detail/lace-beta/hgeekaiplokcnmakghbdfbgnlfheichg",
      "_blank"
    );
  };

  if (!isWalletInstalled()) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Midnight Lace Wallet Required
            </h3>
            <p className="text-sm text-gray-400">
              Connect to the Midnight Network
            </p>
          </div>
        </div>

        <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/20">
          <AlertCircle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            Please install the Midnight Lace wallet browser extension to
            continue.
          </AlertDescription>
        </Alert>

        <Button
          onClick={openLaceWallet}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Install Lace Wallet
        </Button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Connect Midnight Wallet
            </h3>
            <p className="text-sm text-gray-400">
              Access privacy-preserving features
            </p>
          </div>
        </div>

        {error && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>

        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <p>• Zero-knowledge privacy protection</p>
          <p>• Secure asset management</p>
          <p>• Testnet compatible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-green-500/20 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Wallet Connected
            </h3>
            <p className="text-sm text-gray-400">Midnight Lace Wallet</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Connected
          </Badge>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-200 font-medium"
            >
              <RotateCcw
                className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                // Debug functionality disabled

                try {
                  // Check both Cardano and Midnight interfaces
                
                  console.log(
                    "� Window midnight object:",
                    !!(window as any).midnight
                  );
                  console.log(
                    "�🌐 Available cardano wallets:",
                    Object.keys((window as any).cardano || {})
                  );
                  console.log(
                    "🌙 Available midnight wallets:",
                    Object.keys((window as any).midnight || {})
                  );

                  // Check for Midnight Lace (for tDUST/Midnight network)
                  const hasMidnightLace = !!(window as any).midnight?.mnLace;
                  console.log("🌙 Midnight Lace available:", hasMidnightLace);

                  // Check for Cardano Lace (for ADA/Cardano network)
                  const hasCardanoLace = !!(window as any).cardano?.lace;
                  console.log("🌐 Cardano Lace available:", hasCardanoLace);

                  if (!hasMidnightLace && !hasCardanoLace) {
                    console.error(
                      "❌ No Lace wallet found in either cardano or midnight objects"
                    );
                    alert(
                      "Lace wallet not found. Please ensure Lace wallet is installed and supports Midnight network."
                    );
                    return;
                  }

                  let debugResults: any = {};

                  // Try Midnight Lace first (for tDUST)
                  if (hasMidnightLace) {
                    console.log("🌙 Testing Midnight Lace interface...");
                    const midnightLace = (window as any).midnight.mnLace;
                    console.log(
                      "🌙 Midnight Lace methods:",
                      Object.keys(midnightLace)
                    );

                    try {
                      // First enable to get the wallet API
                      console.log("🔌 Enabling Midnight Lace...");
                      const walletApi = await midnightLace.enable();
                      console.log("💼 Wallet API:", walletApi);
                      console.log(
                        "💼 API methods:",
                        Object.keys(walletApi || {})
                      );

                      // Get state and try to get balance
                      let balance = "Not found";
                      let state = null;

                      if (walletApi && typeof walletApi.state === "function") {
                        state = await walletApi.state();
                        console.log("🌙 Midnight state:", state);

                        // Check if balance is in state
                        if (state && state.balance) {
                          balance = state.balance;
                        }
                      }

                      // Try to get balance using balanceTransaction method
                      if (
                        balance === "Not found" &&
                        walletApi &&
                        typeof walletApi.balanceTransaction === "function"
                      ) {
                        try {
                          console.log("💰 Trying balanceTransaction method...");
                          const balanceResult =
                            await walletApi.balanceTransaction();
                          console.log("💰 Balance result:", balanceResult);
                          balance = balanceResult;
                        } catch (balanceErr) {
                          console.warn(
                            "⚠️ balanceTransaction failed:",
                            balanceErr
                          );
                        }
                      }

                      debugResults.midnight = {
                        available: true,
                        state: state,
                        balance: balance,
                        apiMethods: Object.keys(walletApi || {}),
                      };
                    } catch (midnightErr) {
                      console.warn("⚠️ Midnight Lace error:", midnightErr);
                      debugResults.midnight = {
                        available: true,
                        error: String(midnightErr),
                      };
                    }
                  }


                  console.log("✅ Debug check completed!");
                  console.log("📋 Final results:", debugResults);

                  const debugInfo = `DEBUG RESULTS:
                        Midnight Lace: ${
                          hasMidnightLace ? "Available" : "Not found"
                        }
                        ${
                          debugResults.midnight
                            ? `- State: ${JSON.stringify(
                                debugResults.midnight,
                                null,
                                2
                              )}`
                            : ""
                        }

                        Cardano Lace: ${
                          hasCardanoLace ? "Available" : "Not found"
                        }  
                        ${
                          debugResults.cardano
                            ? `- Balance: ${debugResults.cardano.balance}
                        - UTXOs: ${debugResults.cardano.utxos}
                        - Network: ${debugResults.cardano.network}
                        - Address: ${debugResults.cardano.address}`
                            : ""
                        }`;

                  alert(debugInfo);
                } catch (err) {
                  console.error("❌❌❌ Manual balance check failed:", err);
                  const errorMessage =
                    err instanceof Error ? err.message : String(err);
                  const errorStack =
                    err instanceof Error ? err.stack : "No stack trace";
                  console.error("Error details:", errorMessage);
                  console.error("Error stack:", errorStack);
                  alert("Debug failed: " + errorMessage);
                }
              }}
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-200 font-medium"
            >
              💰 Get Balance
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnectWallet}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-all duration-200 font-medium"
            >
              <LogOut className="h-3 w-3 mr-1" />
              Disconnect
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Wallet Info */}
        <div className="space-y-4">
          {/* Address */}
          <div>
            <label className="text-sm font-medium text-gray-300">Address</label>
            <div className="flex items-center space-x-2 mt-1 p-3 bg-slate-700/50 rounded-lg">
              <code className="text-sm text-gray-300 font-mono flex-1">
                {walletState?.address
                  ? formatAddress(walletState.address)
                  : "Loading..."}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddress}
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-200 font-medium px-3"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Balance */}
          <div>
            <label className="text-sm font-medium text-gray-300">Balance</label>
            <div className="mt-1 p-3 bg-slate-700/50 rounded-lg">
              <span className="text-lg font-semibold text-white">
                {walletState?.balance !== null &&
                walletState?.balance !== undefined
                  ? `${parseFloat(walletState.balance).toFixed(2)} tDUST`
                  : "Loading..."}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Public Keys */}
        {walletState && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Coin Public Key
              </label>
              <div className="mt-1 p-3 bg-slate-700/50 rounded-lg">
                <code className="text-xs text-gray-400 font-mono break-all">
                  {formatAddress(walletState.coinPublicKey)}
                </code>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Encryption Public Key
              </label>
              <div className="mt-1 p-3 bg-slate-700/50 rounded-lg">
                <code className="text-xs text-gray-400 font-mono break-all">
                  {formatAddress(walletState.encryptionPublicKey)}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Service Configuration - Full Width Bottom */}
      {serviceConfig && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Network Configuration
            </label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigator.clipboard.writeText(
                    "cd docker/prod && docker-compose up -d"
                  )
                }
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Command
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-green-500/30 text-green-300 hover:bg-green-500/10 text-xs"
              >
                <RefreshCw
                  className={`h-3 w-3 mr-1 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-sm text-gray-300">Node:</span>
              <span className="text-lg">
                {serviceConfig.node ? "✅" : "❌"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-sm text-gray-300">Indexer:</span>
              <span className="text-lg">
                {serviceConfig.indexer ? "✅" : "❌"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-sm text-gray-300">Proof Server:</span>
              <span className="text-lg">
                {serviceConfig.proofServer ? "✅" : "❌"}
              </span>
            </div>
          </div>

          {/* Services Offline Warning */}
          {(!serviceConfig.node ||
            !serviceConfig.indexer ||
            !serviceConfig.proofServer) && (
            <Alert className="mt-4 bg-yellow-500/10 border-yellow-500/20">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                <div className="space-y-3">
                  <p className="font-semibold">⚠️ Network Services Status</p>
                  <p className="text-sm">
                    {!serviceConfig.node && "Node service is not responding. "}
                    {!serviceConfig.indexer &&
                      "Indexer service needs attention. "}
                    {!serviceConfig.proofServer && "Proof Server is offline. "}
                    {serviceConfig._configWarning?.usingRemoteNode
                      ? "Using remote services for Node and Indexer."
                      : "Start local Docker services for full functionality:"}
                  </p>

                  {!serviceConfig._configWarning?.usingRemoteNode && (
                    <>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-yellow-300">
                          Quick Start (All Services):
                        </p>
                        <div className="text-xs font-mono bg-slate-800/50 p-2 rounded border border-slate-600">
                          cd docker/prod && docker-compose up -d
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-yellow-300">
                          Check Status:
                        </p>
                        <div className="text-xs font-mono bg-slate-800/50 p-2 rounded border border-slate-600">
                          docker-compose ps
                        </div>
                      </div>

                      <div className="text-xs text-yellow-200">
                        💡 Tip: Use the "Copy Command" button above, then paste
                        in your terminal
                      </div>
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}

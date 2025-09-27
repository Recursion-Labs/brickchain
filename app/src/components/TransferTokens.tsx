'use client';

import { useState } from 'react';
import { useStore } from '../lib/store';
import { getMidnightClient } from '../lib/midnight';
import Navigation from './Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRightLeft, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Shield, 
  Send,
  Zap,
  Sparkles
} from 'lucide-react';

export default function TransferTokens() {
  const { isConnected, walletAddress } = useStore();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [result, setResult] = useState<{ txHash: string; proof: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount || !isConnected) return;

    try {
      setIsTransferring(true);
      setError(null);
      
      const midnightClient = getMidnightClient();
      const response = await midnightClient.shieldedTransfer(recipient, parseInt(amount));
      
      setResult(response);
      
      // Reset form
      setRecipient('');
      setAmount('');
    } catch (err) {
      setError('Failed to transfer tokens');
      console.error('Transfer error:', err);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-6">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <ArrowRightLeft className="w-3 h-3 mr-1" />
              Secure Transfer
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transfer Property
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tokens
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Securely transfer property tokens with <span className="text-blue-400 font-semibold">zero-knowledge privacy</span> and 
            <span className="text-purple-400 font-semibold"> instant settlement</span> on the Midnight Network.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-purple-500/20 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Transfer Tokens</CardTitle>
                  <CardDescription className="text-gray-300">
                    Send property tokens to another wallet securely
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!isConnected && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    Please connect your wallet to transfer tokens.
                  </AlertDescription>
                </Alert>
              )}

              {/* Current Wallet Display */}
              {isConnected && walletAddress && (
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Connected Wallet</span>
                  </div>
                  <p className="text-gray-300 text-sm font-mono break-all">{walletAddress}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Address */}
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-gray-200">Recipient Wallet Address</Label>
                  <Input
                    id="recipient"
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter recipient wallet address"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 font-mono"
                    disabled={!isConnected || isTransferring}
                    required
                  />
                  <p className="text-sm text-gray-400">
                    Enter the complete wallet address of the recipient
                  </p>
                </div>

                {/* Token Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-200">Number of Tokens</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter number of tokens to transfer"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                    disabled={!isConnected || isTransferring}
                    required
                  />
                  <p className="text-sm text-gray-400">
                    Specify the number of property tokens to transfer
                  </p>
                </div>

                {/* Transfer Information */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-300 font-medium mb-1">Zero-Knowledge Transfer</h4>
                      <p className="text-blue-200 text-sm">
                        Your transfer will be executed with complete privacy using zero-knowledge proofs. 
                        Transaction details remain confidential while maintaining blockchain security.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isTransferring || !isConnected}
                >
                  {isTransferring ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Transfer...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Transfer Tokens
                    </>
                  )}
                </Button>

                {/* Results */}
                {result && (
                  <Alert className="border-green-500/20 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      <div className="space-y-2">
                        <p className="font-semibold">Transfer Successful!</p>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Transaction Hash:</span></p>
                          <p className="font-mono text-xs break-all bg-slate-700/30 p-2 rounded">{result.txHash}</p>
                          <p><span className="font-medium">Zero-Knowledge Proof:</span></p>
                          <p className="font-mono text-xs break-all bg-slate-700/30 p-2 rounded">{result.proof}</p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Message */}
                {error && (
                  <Alert className="border-red-500/20 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
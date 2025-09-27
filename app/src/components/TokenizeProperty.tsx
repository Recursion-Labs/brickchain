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
  Coins, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Building2,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';

export default function TokenizeProperty() {
  const { isConnected } = useStore();
  const [propertyId, setPropertyId] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [result, setResult] = useState<{ txHash: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyId || !propertyValue || !tokenAmount || !isConnected) return;

    try {
      setIsMinting(true);
      setError(null);
      
      const midnightClient = getMidnightClient();
      const response = await midnightClient.mintTokens(propertyId, parseInt(tokenAmount));
      
      setResult(response);
      
      // Reset form
      setPropertyId('');
      setPropertyValue('');
      setTokenAmount('');
    } catch (err) {
      setError('Failed to tokenize property');
      console.error('Tokenization error:', err);
    } finally {
      setIsMinting(false);
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
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
              <Coins className="w-3 h-3 mr-1" />
              Property Tokenization
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Tokenize Your
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Real Estate
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Convert your registered property into <span className="text-purple-400 font-semibold">digital tokens</span> for 
            <span className="text-blue-400 font-semibold"> fractional ownership</span> and enhanced liquidity.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-purple-500/20 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Tokenize Property</CardTitle>
                  <CardDescription className="text-gray-300">
                    Transform real estate into tradeable digital tokens
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!isConnected && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    Please connect your wallet to tokenize a property.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Property ID */}
                <div className="space-y-2">
                  <Label htmlFor="propertyId" className="text-gray-200">Property ID</Label>
                  <Input
                    id="propertyId"
                    type="text"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    placeholder="Enter registered property ID"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                    disabled={!isConnected || isMinting}
                    required
                  />
                </div>

                {/* Property Value */}
                <div className="space-y-2">
                  <Label htmlFor="propertyValue" className="text-gray-200">Property Value (USD)</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    placeholder="Enter total property value"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                    disabled={!isConnected || isMinting}
                    required
                  />
                </div>

                {/* Token Amount */}
                <div className="space-y-2">
                  <Label htmlFor="tokenAmount" className="text-gray-200">Number of Tokens</Label>
                  <Input
                    id="tokenAmount"
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    placeholder="Enter number of tokens to mint"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                    disabled={!isConnected || isMinting}
                    required
                  />
                  <p className="text-sm text-gray-400">
                    Each token represents a fraction of the property ownership
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isMinting || !isConnected}
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Minting Tokens...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Mint Property Tokens
                    </>
                  )}
                </Button>

                {/* Results */}
                {result && (
                  <Alert className="border-green-500/20 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      <div className="space-y-2">
                        <p className="font-semibold">Tokenization Successful!</p>
                        <div className="text-sm">
                          <p><span className="font-medium">Transaction Hash:</span> {result.txHash}</p>
                          <p><span className="font-medium">Message:</span> {result.message}</p>
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
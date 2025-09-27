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
  ShieldCheck, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Shield, 
  FileSearch,
  Eye,
  Sparkles,
  Verified
} from 'lucide-react';

export default function VerifyOwnership() {
  const { isConnected, walletAddress } = useStore();
  const [propertyId, setPropertyId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{ propertyID: string; owner: string; share: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyId || !isConnected) return;

    try {
      setIsVerifying(true);
      setError(null);
      
      const midnightClient = getMidnightClient();
      const response = await midnightClient.generateProof(propertyId);
      
      setResult(response);
    } catch (err) {
      setError('Failed to verify ownership');
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
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
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verify Ownership
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Verify Property
            <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ownership
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Generate <span className="text-green-400 font-semibold">cryptographic proofs</span> of property ownership 
            with <span className="text-blue-400 font-semibold">zero-knowledge verification</span> on the Midnight Network.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-purple-500/20 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                  <FileSearch className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Verify Ownership</CardTitle>
                  <CardDescription className="text-gray-300">
                    Generate proof of property ownership with zero-knowledge verification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!isConnected && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    Please connect your wallet to verify ownership.
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
                {/* Property ID */}
                <div className="space-y-2">
                  <Label htmlFor="propertyId" className="text-gray-200">Property ID</Label>
                  <Input
                    id="propertyId"
                    type="text"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    placeholder="Enter property ID to verify"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 font-mono"
                    disabled={!isConnected || isVerifying}
                    required
                  />
                  <p className="text-sm text-gray-400">
                    Enter the unique property identifier to generate ownership proof
                  </p>
                </div>

                {/* Verification Information */}
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="text-green-300 font-medium mb-1">Zero-Knowledge Proof</h4>
                      <p className="text-green-200 text-sm">
                        The verification process generates cryptographic proof of ownership without revealing 
                        sensitive property details or transaction history.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isVerifying || !isConnected}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Proof...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-5 w-5" />
                      Verify Ownership
                    </>
                  )}
                </Button>

                {/* Results */}
                {result && (
                  <Alert className="border-green-500/20 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Verified className="h-5 w-5 text-green-400" />
                          <p className="font-semibold">Ownership Verified Successfully!</p>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="space-y-1">
                            <p className="font-medium text-green-200">Property ID:</p>
                            <p className="font-mono text-xs bg-slate-700/30 p-2 rounded break-all">
                              {result.propertyID}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="font-medium text-green-200">Owner Address:</p>
                            <p className="font-mono text-xs bg-slate-700/30 p-2 rounded break-all">
                              {result.owner}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="font-medium text-green-200">Ownership Share:</p>
                            <p className="font-mono text-xs bg-slate-700/30 p-2 rounded">
                              {result.share}
                            </p>
                          </div>
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
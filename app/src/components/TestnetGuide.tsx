'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  ExternalLink, 
  Coins, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Globe,
  Wallet,
  ArrowRight
} from 'lucide-react';

interface TestnetGuideProps {
  currentNetwork?: number | null;
  onNetworkValidated?: () => void;
}

export default function TestnetGuide({ currentNetwork, onNetworkValidated }: TestnetGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isOnTestnet = currentNetwork === 0;
  
  const testnetSteps = [
    {
      title: "Install Lace Wallet",
      description: "Download and install Lace wallet (recommended for Midnight)",
      action: "Download Lace",
      url: "https://www.lace.io/",
      icon: <Wallet className="h-4 w-4" />
    },
    {
      title: "Switch to Testnet",
      description: "In your wallet settings, switch to Cardano Preprod testnet",
      action: "Wallet Settings",
      icon: <Network className="h-4 w-4" />
    },
    {
      title: "Get Test ADA",
      description: "Request test ADA from the Cardano testnet faucet",
      action: "Get Test ADA",
      url: "https://faucet.preprod.cardano.org/faucet",
      icon: <Coins className="h-4 w-4" />
    },
    {
      title: "Connect Wallet",
      description: "Return here and connect your testnet-enabled wallet",
      action: "Connect Now",
      icon: <CheckCircle2 className="h-4 w-4" />
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Network className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Testnet Setup Guide</CardTitle>
              <CardDescription className="text-gray-300">
                Connect to Cardano testnet for Midnight features
              </CardDescription>
            </div>
          </div>
          <Badge variant={isOnTestnet ? "default" : "destructive"}>
            {isOnTestnet ? "Connected" : "Setup Required"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Network Status */}
        <Alert className={`${isOnTestnet ? 'border-green-500/30 bg-green-900/20' : 'border-yellow-500/30 bg-yellow-900/20'}`}>
          {isOnTestnet ? (
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          )}
          <AlertDescription className={isOnTestnet ? 'text-green-300' : 'text-yellow-300'}>
            {isOnTestnet ? (
              <div>
                <p className="font-semibold">✅ Testnet Connected!</p>
                <p className="text-sm">You're connected to Cardano testnet. Midnight features are available.</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold">⚠️ Testnet Required</p>
                <p className="text-sm">
                  {currentNetwork === 1 
                    ? "You're on mainnet. Please switch to testnet to use Midnight features."
                    : "Please connect to Cardano testnet to access Midnight protocol features."
                  }
                </p>
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Setup Steps */}
        {!isOnTestnet && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Setup Steps</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-white"
              >
                {isExpanded ? 'Hide' : 'Show'} Guide
              </Button>
            </div>
            
            {isExpanded && (
              <div className="space-y-3">
                {testnetSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/10">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{step.title}</p>
                      <p className="text-gray-400 text-xs">{step.description}</p>
                    </div>
                    {step.url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(step.url, '_blank')}
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                      >
                        {step.icon}
                        <span className="ml-1 text-xs">{step.action}</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400">
                        {step.icon}
                        <span className="text-xs">{step.action}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://faucet.preprod.cardano.org/faucet', '_blank')}
            className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 flex-1"
          >
            <Coins className="w-4 h-4 mr-2" />
            Get Test ADA
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://docs.midnight.network/', '_blank')}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 flex-1"
          >
            <Globe className="w-4 h-4 mr-2" />
            Midnight Docs
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>

        {/* Network Info */}
        <div className="bg-slate-800/30 p-3 rounded-lg border border-purple-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Network Information</span>
          </div>
          <div className="space-y-1 text-xs text-gray-400">
            <p><strong>Current Network:</strong> {currentNetwork === 0 ? 'Testnet' : currentNetwork === 1 ? 'Mainnet' : 'Unknown'}</p>
            <p><strong>Required:</strong> Cardano Preprod Testnet (Network ID: 0)</p>
            <p><strong>Midnight Compatibility:</strong> {isOnTestnet ? '✅ Ready' : '❌ Not Ready'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
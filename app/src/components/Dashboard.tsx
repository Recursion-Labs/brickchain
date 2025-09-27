'use client';

import { useStore } from '../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Coins, 
  ArrowRightLeft, 
  Shield, 
  Wallet,
  TrendingUp,
  Building,
  Users,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { isConnected, walletAddress, walletInfo } = useStore();

  const features = [
    {
      title: 'Register Property',
      description: 'Upload property documents and register them securely on the blockchain with zero-knowledge proofs.',
      icon: FileText,
      href: '/register',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-900/20 to-cyan-900/20',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Tokenize Property',
      description: 'Convert your registered property into digital tokens for fractional ownership and trading.',
      icon: Coins,
      href: '/tokenize',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-900/20 to-emerald-900/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Transfer Tokens',
      description: 'Securely transfer your property tokens to other wallets with privacy-preserving transactions.',
      icon: ArrowRightLeft,
      href: '/transfer',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-900/20 to-pink-900/20',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'Verify Ownership',
      description: 'Generate cryptographic proofs to verify property ownership without revealing sensitive data.',
      icon: Shield,
      href: '/verify',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-900/20 to-orange-900/20',
      borderColor: 'border-yellow-500/30'
    }
  ];

  const stats = [
    {
      title: 'Properties Registered',
      value: '0',
      icon: Building,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-900/20 to-blue-800/20'
    },
    {
      title: 'Tokens Minted',
      value: '0',
      icon: Coins,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-900/20 to-green-800/20'
    },
    {
      title: 'Total Value',
      value: '0 ADA',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-900/20 to-purple-800/20'
    },
    {
      title: 'Active Users',
      value: '1',
      icon: Users,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-900/20 to-orange-800/20'
    }
  ];

  const formatAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  const formatBalance = (balance: string) => {
    const ada = parseFloat(balance) / 1000000;
    return ada.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <Badge variant="secondary" className="bg-purple-100/20 text-purple-400 border-purple-500/30">
                Midnight Dashboard
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Real Estate Tokenization
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Manage your property tokens with zero-knowledge privacy on the Midnight network
            </p>
          </div>
          
          {/* Wallet Status */}
          {isConnected ? (
            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-purple-500/20 backdrop-blur-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">Wallet Connected</CardTitle>
                      <CardDescription className="text-gray-300">
                        {walletInfo?.name || 'Cardano Wallet'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Connected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Address</p>
                    <p className="font-mono text-sm bg-slate-800/50 p-3 rounded-lg text-gray-300 border border-purple-500/20">
                      {formatAddress(walletAddress || '')}
                    </p>
                  </div>
                  {walletInfo?.balance && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Balance</p>
                      <p className="font-semibold text-lg text-white">
                        {formatBalance(walletInfo.balance)} ADA
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30 backdrop-blur-lg">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Connect Your Wallet to Get Started
                    </h2>
                    <p className="text-gray-300 mt-2">
                      Please connect your Cardano wallet to access the property tokenization features.
                    </p>
                  </div>
                  <Link to="/">
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          {isConnected && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className={`bg-gradient-to-br ${stat.bgGradient} border-purple-500/20 backdrop-blur-lg hover:shadow-2xl transition-all duration-300`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          )}

          <Separator className="bg-purple-500/20" />
          
          {/* Features */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Platform Features</h2>
              <p className="text-gray-300 text-lg">
                Explore all the tools available for property tokenization
              </p>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={`bg-gradient-to-br ${feature.bgGradient} border ${feature.borderColor} backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${!isConnected ? 'opacity-50' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                        <CardDescription className="mt-1 text-gray-300">
                          {feature.description}
                        </CardDescription>
          </div>
        </div>
                  </CardHeader>
                  <CardContent>
                    <Link to={isConnected ? feature.href : '#'}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                        disabled={!isConnected}
                      >
                        {isConnected ? (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Get Started
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Connect Wallet First
                          </>
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Getting Started */}
          {isConnected && (
            <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-xl text-white">Ready to Get Started?</CardTitle>
                <CardDescription className="text-gray-300">
                  Follow these steps to tokenize your first property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { step: 1, title: 'Register Property', color: 'from-blue-500 to-blue-600' },
                    { step: 2, title: 'Tokenize Asset', color: 'from-green-500 to-green-600' },
                    { step: 3, title: 'Transfer Tokens', color: 'from-purple-500 to-purple-600' },
                    { step: 4, title: 'Verify Ownership', color: 'from-yellow-500 to-yellow-600' }
                  ].map((item, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} text-white rounded-2xl flex items-center justify-center font-bold mx-auto shadow-lg`}>
                        {item.step}
                      </div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                    </div>
                  ))}
        </div>
              </CardContent>
            </Card>
      )}
        </div>
      </div>
    </div>
  );
}
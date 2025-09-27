import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Wallet, 
  Home,
  FileText,
  Coins,
  ArrowRightLeft,
  Shield,
  Sparkles
} from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, walletAddress } = useStore();
  const router = useRouter();
  const pathname = router.pathname;

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: Wallet },
    { name: 'Register', href: '/register', icon: FileText },
    { name: 'Tokenize', href: '/tokenize', icon: Coins },
    { name: 'Transfer', href: '/transfer', icon: ArrowRightLeft },
    { name: 'Verify', href: '/verify', icon: Shield },
  ];

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-lg border-b border-purple-500/20 shadow-lg relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" scroll={false} className="flex items-center space-x-3 relative z-10" style={{ pointerEvents: 'auto' }}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Midnight Real Estate
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  scroll={false}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative z-10 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Status */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 flex items-center space-x-2 px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{formatAddress(walletAddress || '')}</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="border-purple-500/30 text-purple-400 flex items-center space-x-2 px-3 py-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm font-medium">Not Connected</span>
              </Badge>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:bg-white/10 relative z-10"
              style={{ pointerEvents: 'auto' }}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-lg border-t border-purple-500/20 relative z-40">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    scroll={false}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 relative z-10 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    style={{ pointerEvents: 'auto' }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Wallet Status */}
              <div className="px-3 py-3">
                {isConnected ? (
                  <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 flex items-center space-x-2 w-full justify-center py-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{formatAddress(walletAddress || '')}</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400 flex items-center space-x-2 w-full justify-center py-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-medium">Not Connected</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
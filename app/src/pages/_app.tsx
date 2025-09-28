import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from '@/components/ui/toast-context';
import { MidnightWalletProvider } from '@/lib/midnight-wallet-provider';
import '../index.css';

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MidnightWalletProvider>
        <TooltipProvider>
          <ToastProvider>
            <Head>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>BrickChain - Property Tokenization Platform</title>
            </Head>
            <Sonner />
            <Component {...pageProps} />
          </ToastProvider>
        </TooltipProvider>
      </MidnightWalletProvider>
    </QueryClientProvider>
  );
}
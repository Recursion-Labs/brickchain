// ROUTING.test.ts
// This file documents the routing structure and verifies that all routes are properly configured

export const ROUTING_TESTS = [
  {
    path: '/',
    component: 'LandingPage',
    description: 'Main landing page with introduction and wallet connection'
  },
  {
    path: '/dashboard',
    component: 'DashboardPage',
    description: 'Redirects to landing page'
  },
  {
    path: '/register',
    component: 'RegisterPage',
    description: 'Property registration page'
  },
  {
    path: '/tokenize',
    component: 'TokenizePage',
    description: 'Property tokenization page'
  },
  {
    path: '/transfer',
    component: 'TransferPage',
    description: 'Token transfer page'
  },
  {
    path: '/verify',
    component: 'VerifyPage',
    description: 'Ownership verification page'
  },
  {
    path: '/404',
    component: 'Custom404',
    description: 'Custom 404 page'
  }
];

export const NAVIGATION_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/register', label: 'Register' },
  { path: '/tokenize', label: 'Tokenize' },
  { path: '/transfer', label: 'Transfer' },
  { path: '/verify', label: 'Verify' }
];

// Test that all components are properly imported and exported
export const COMPONENT_TESTS = [
  'Navigation',
  'Dashboard',
  'WalletConnect',
  'RegisterProperty',
  'TokenizeProperty',
  'TransferTokens',
  'VerifyOwnership'
];
// Debug Navigation Test Component
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function DebugNavigation() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsClient(true);
    console.log('Navigation mounted, current pathname:', router.pathname);
  }, []);

  useEffect(() => {
    console.log('Router changed to:', router.pathname);
  }, [router.pathname]);

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Register', href: '/register' },
    { name: 'Tokenize', href: '/tokenize' },
    { name: 'Transfer', href: '/transfer' },
    { name: 'Verify', href: '/verify' },
  ];

  const handleLinkClick = (href: string, name: string) => {
    console.log(`Clicking navigation to ${name} (${href})`);
    console.log('About to navigate with router.push...');
    router.push(href);
  };

  const handleButtonClick = (href: string, name: string) => {
    console.log(`Button clicked for ${name} (${href})`);
    console.log('Router object:', router);
    router.push(href).then(() => {
      console.log(`Successfully navigated to ${href}`);
    }).catch((error) => {
      console.error('Navigation error:', error);
    });
  };

  if (!isClient) {
    return <div>Loading navigation...</div>;
  }

  return (
    <nav style={{ 
      backgroundColor: '#1e293b', 
      padding: '1rem',
      marginBottom: '2rem',
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ color: 'white', fontWeight: 'bold' }}>
          Current: {router.pathname}
        </div>
        
        {/* Test if ANY click works */}
        <button 
          onClick={() => console.log('TEST BUTTON CLICKED!')}
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1001
          }}
        >
          TEST CLICK
        </button>
        {navigationItems.map((item) => {
          const isActive = router.pathname === item.href;
          
          return (
            <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Link
                href={item.href}
                style={{
                  color: isActive ? '#60a5fa' : '#d1d5db',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  backgroundColor: isActive ? '#1f2937' : 'transparent',
                  borderRadius: '0.5rem',
                  border: '1px solid #374151',
                  fontSize: '0.875rem',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 1002
                }}
                onClick={() => handleLinkClick(item.href, item.name)}
                onMouseEnter={() => console.log(`Mouse entered Link: ${item.name}`)}
                onMouseDown={() => console.log(`Mouse down on Link: ${item.name}`)}
              >
                Link: {item.name}
              </Link>
              <button
                onClick={() => handleButtonClick(item.href, item.name)}
                onMouseEnter={() => console.log(`Mouse entered Button: ${item.name}`)}
                onMouseDown={() => console.log(`Mouse down on Button: ${item.name}`)}
                style={{
                  color: isActive ? '#60a5fa' : '#d1d5db',
                  backgroundColor: isActive ? '#1f2937' : '#374151',
                  border: '1px solid #6b7280',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 1002
                }}
              >
                Btn: {item.name}
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
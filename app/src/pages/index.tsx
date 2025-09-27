'use client';

import { useState, useEffect } from 'react';
import App from '../App';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-bold text-gray-700">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Render the React Router DOM App component
  return <App />;
}
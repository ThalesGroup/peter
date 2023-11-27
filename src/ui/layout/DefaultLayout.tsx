import React from 'react';

import Header from '../components/header/Header';
import ScrollToTop from '../components/ScrollToTop';

interface AppLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <ScrollToTop />
      <main className="my-4xl">
        <div className="mx-auto mb-8 mt-3xl" style={{ width: 1024 }}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default DefaultLayout;

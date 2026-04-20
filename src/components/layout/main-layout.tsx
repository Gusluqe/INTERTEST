'use client';

import { ReactNode } from 'react';
import { Wifi, Globe, Settings, History } from 'lucide-react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
                <Wifi className="relative h-8 w-8 text-primary" />
              </div>
              <span className="text-xl font-bold text-gradient">NetCheck Pro</span>
            </Link>

            <nav className="flex items-center space-x-2">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <Globe className="h-4 w-4 inline-block mr-2" />
                Test
              </Link>
              <Link
                href="/history"
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <History className="h-4 w-4 inline-block mr-2" />
                History
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <Settings className="h-4 w-4 inline-block mr-2" />
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="pt-16">{children}</main>

      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            NetCheck Pro &copy; {new Date().getFullYear()} — Professional Speed Testing
          </p>
          <p>&copy;Si te gustó esta página 🚀 Creá la tuya hoy en 👉 
        <a href="https://luquetech.com/" target="_blank">luquetech.com</a>
      </p>
        </div>
      </footer>
    </div>
  );
}

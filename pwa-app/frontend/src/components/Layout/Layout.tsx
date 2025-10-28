import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-full bg-dark-bg">
      <Header />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

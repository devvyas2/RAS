'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Shield,
  LayoutDashboard,
  MessageSquarePlus,
  Wrench,
  History,
  AlertTriangle,
  Split,
  Home,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/submit', label: 'Report Issue', icon: MessageSquarePlus },
  { href: '/work-order', label: 'Work Orders', icon: Wrench },
  { href: '/asset/COACH-001', label: 'Asset History', icon: History },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/compare', label: 'Legacy vs RAS', icon: Split },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-card animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-foreground">
              Rail-Asset Sentinel
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
              RAS • LIVE
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-amber-500/15 text-amber-400 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0',
                  isActive ? 'text-amber-400' : ''
                )}
              />
              {item.label}
              {item.href === '/alerts' && (
                <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full">
                  !
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          Team Runtime-Terror
          <br />
          DJSW_202 • DJS_26_SW_13
          <br />
          Smart India Hackathon 2026
        </p>
      </div>
    </aside>
  );
}

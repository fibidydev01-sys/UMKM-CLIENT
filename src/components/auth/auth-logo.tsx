import Link from 'next/link';
import { Store } from 'lucide-react';
import { siteConfig } from '@/config/site';

// ==========================================
// AUTH LOGO COMPONENT
// ==========================================

interface AuthLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AuthLogo({ size = 'md' }: AuthLogoProps) {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-xl' },
    md: { icon: 'h-8 w-8', text: 'text-2xl' },
    lg: { icon: 'h-10 w-10', text: 'text-3xl' },
  };

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="flex items-center justify-center rounded-xl bg-primary p-2 group-hover:bg-primary/90 transition-colors">
        <Store className={`${sizes[size].icon} text-primary-foreground`} />
      </div>
      <span className={`font-bold ${sizes[size].text} text-foreground`}>
        {siteConfig.name}
      </span>
    </Link>
  );
}
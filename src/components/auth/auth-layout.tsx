import { AuthLogo } from './auth-logo';

// ==========================================
// AUTH LAYOUT COMPONENT
// Centered card layout for auth pages
// ==========================================

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Logo */}
      <div className="mb-8">
        <AuthLogo size="lg" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-2">
                {description}
              </p>
            )}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Fibidy. Hak cipta dilindungi.
      </p>
    </div>
  );
}
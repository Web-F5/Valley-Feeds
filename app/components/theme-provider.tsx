// app/components/ThemeProvider.tsx

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark'; // What is actually applied
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light');

  // Load saved preference on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme & listen for system changes
  React.useEffect(() => {
    const root = window.document.documentElement;

    // Remove transitions during change to avoid FOUC
    if (disableTransitionOnChange) {
      root.classList.add('[&_*]:!transition-none');
    }

    let effectiveTheme: 'light' | 'dark';

    if (theme === 'system' && enableSystem) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      effectiveTheme = mediaQuery.matches ? 'dark' : 'light';

      const handleChange = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      effectiveTheme = theme === 'dark' ? 'dark' : 'light';
    }

    setResolvedTheme(effectiveTheme);

    // Apply class
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // Persist preference (only if not 'system')
    if (theme !== 'system') {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }

    // Clean up transition disable
    const timer = setTimeout(() => {
      root.classList.remove('[&_*]:!transition-none');
    }, 1);

    return () => clearTimeout(timer);
  }, [theme, enableSystem, disableTransitionOnChange]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value} {...props}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

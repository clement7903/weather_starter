import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = {
  name: string;
  label: string;
  vars: Record<string, string>;
};

type ThemeContextValue = {
  themeName: string;
  setTheme: (name: string) => void;
  themes: Record<string, Theme>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'ws:theme';

const appleTheme: Theme = {
  name: 'apple',
  label: 'Apple',
  vars: {
    '--bg-radial1': 'rgba(255, 255, 255, 0.18)',
    '--bg-radial2': 'rgba(80, 110, 150, 0.55)',
    '--bg-linear1': '#6f8aa8',
    '--bg-linear2': '#5a7591',
    '--bg-linear3': '#4a627c',
    '--bg-linear4': '#3c5066',
    '--text-color': '#ffffff',
    '--card-bg': 'rgba(255,255,255,0.04)',
  },
};

const clearSkyTheme: Theme = {
  name: 'clearSky',
  label: 'Clear Sky',
  vars: {
    '--bg-radial1': 'rgba(255, 255, 255, 0.38)',
    '--bg-radial2': 'rgba(134, 199, 255, 0.42)',
    '--bg-linear1': '#9fd7ff',
    '--bg-linear2': '#78bff2',
    '--bg-linear3': '#4fa0dc',
    '--bg-linear4': '#307cc0',
    '--text-color': '#f8fbff',
    '--card-bg': 'rgba(255, 255, 255, 0.08)',
  },
};

const midnightTheme: Theme = {
  name: 'midnight',
  label: 'Midnight',
  vars: {
    '--bg-radial1': 'rgba(120, 160, 255, 0.16)',
    '--bg-radial2': 'rgba(14, 30, 63, 0.72)',
    '--bg-linear1': '#081226',
    '--bg-linear2': '#0d1a33',
    '--bg-linear3': '#111c35',
    '--bg-linear4': '#040814',
    '--text-color': '#f3f7ff',
    '--card-bg': 'rgba(12, 20, 40, 0.35)',
  },
};

const minimalTheme: Theme = {
  name: 'minimal',
  label: 'Minimal',
  vars: {
    '--bg-radial1': 'rgba(255, 255, 255, 0.02)',
    '--bg-radial2': 'rgba(240, 240, 242, 0.6)',
    '--bg-linear1': '#ffffff',
    '--bg-linear2': '#f7f7f9',
    '--bg-linear3': '#f0f0f2',
    '--bg-linear4': '#e8e8ea',
    '--text-color': '#0b1220',
    '--card-bg': 'rgba(255,255,255,0.9)',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? 'apple';
    } catch {
      return 'apple';
    }
  });

  const themes = useMemo(
    (): Record<string, Theme> => ({
      apple: appleTheme,
      clearSky: clearSkyTheme,
      midnight: midnightTheme,
      minimal: minimalTheme,
    }),
    [],
  );

  useEffect(() => {
    const theme = themes[themeName] ?? themes.apple;
    // apply CSS variables to :root
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v as string));
    try {
      localStorage.setItem(STORAGE_KEY, theme.name);
    } catch {}
  }, [themeName, themes]);

  const value: ThemeContextValue = {
    themeName,
    setTheme: setThemeName,
    themes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

export default ThemeProvider;

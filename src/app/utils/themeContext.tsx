import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  cardBackground: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accentPink: string;
  accentTeal: string;
  accentGold: string;
  /** Use this for gold text on card/page backgrounds — darker in light mode for legibility */
  accentGoldText: string;
  accentMaroon: string;
  accentOrange: string;
  progressBarBg: string;
  hintBoxBg: string;
  hintBoxBorder: string;
}

const lightTheme: ThemeColors = {
  background: '#F9FAFB', // gray-50
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E7EB', // gray-200
  textPrimary: '#111827', // gray-900
  textSecondary: '#6B7280', // gray-500
  accentPink: '#E8547A',
  accentTeal: '#2A8F9B',  // darkened for text contrast on white
  accentGold: '#FFC627',
  accentGoldText: '#7A5200', // dark amber — legible on white backgrounds
  accentMaroon: '#8B1A2E',
  accentOrange: '#D4682A',  // darkened for text contrast on white
  progressBarBg: 'rgba(139,26,46,0.1)',
  hintBoxBg: '#FFF9E6',
  hintBoxBorder: 'rgba(255,198,39,0.3)',
};

const darkTheme: ThemeColors = {
  background: '#000000', // matches the login screen's gradient starting color
  cardBackground: '#1A0C10',
  cardBorder: 'rgba(255,198,39,0.13)',
  textPrimary: '#F0E0E4',
  textSecondary: '#7A5A62',
  accentPink: '#E8547A',
  accentTeal: '#4AB7C4',
  accentGold: '#FFC627',
  accentGoldText: '#FFC627', // full brightness is fine on dark backgrounds
  accentMaroon: '#8B1A2E',
  accentOrange: '#FF8A50',
  progressBarBg: 'rgba(139,26,46,0.3)',
  hintBoxBg: 'rgba(255,198,39,0.1)',
  hintBoxBorder: 'rgba(255,198,39,0.2)',
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('asu_genai_theme');
    return (stored as Theme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('asu_genai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

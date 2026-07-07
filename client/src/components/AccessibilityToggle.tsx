import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Eye, Moon, Sun, Contrast } from 'lucide-react';

export interface AccessibilityTheme {
  id: string;
  name: string;
  icon: React.ReactNode;
  background: string;
  foreground: string;
  accent: string;
  wireframe: string;
  grid: string;
  text: string;
  border: string;
}

interface AccessibilityToggleProps {
  onThemeChange: (theme: AccessibilityTheme) => void;
}

const ACCESSIBILITY_THEMES: AccessibilityTheme[] = [
  {
    id: 'default',
    name: 'Default Dark',
    icon: <Eye className="w-4 h-4" />,
    background: '#0a0a0a',
    foreground: '#ffffff',
    accent: '#00ff88',
    wireframe: '#00ff88',
    grid: '#333333',
    text: '#ffffff',
    border: '#666666'
  },
  {
    id: 'white_bg',
    name: 'White Background',
    icon: <Sun className="w-4 h-4" />,
    background: '#ffffff',
    foreground: '#000000',
    accent: '#000000',
    wireframe: '#000000',
    grid: '#cccccc',
    text: '#000000',
    border: '#999999'
  },
  {
    id: 'black_bg',
    name: 'Pure Black',
    icon: <Moon className="w-4 h-4" />,
    background: '#000000',
    foreground: '#ffffff',
    accent: '#ffffff',
    wireframe: '#ffffff',
    grid: '#333333',
    text: '#ffffff',
    border: '#666666'
  }
];

export default function AccessibilityToggle({ onThemeChange }: AccessibilityToggleProps) {
  const [currentTheme, setCurrentTheme] = useState<AccessibilityTheme>(ACCESSIBILITY_THEMES[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const applyThemeToDocument = (theme: AccessibilityTheme) => {
    const root = document.documentElement;

    // Apply CSS variables for theme colors
    root.style.setProperty('--bg-primary', theme.background);
    root.style.setProperty('--text-primary', theme.foreground);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--wireframe-color', theme.wireframe);
    root.style.setProperty('--grid-color', theme.grid);
    root.style.setProperty('--border-color', theme.border);

    // Apply background to body
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.foreground;
  };

  const handleThemeChange = async (theme: AccessibilityTheme) => {
    setIsTransitioning(true);

    // Apply theme immediately
    applyThemeToDocument(theme);
    setCurrentTheme(theme);
    onThemeChange(theme);

    // Store preference
    localStorage.setItem('accessibility-theme', theme.id);

    // Smooth transition effect
    setTimeout(() => {
      setIsTransitioning(false);
      setIsExpanded(false);
    }, 300);
  };

  // Load saved theme on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('accessibility-theme');
    if (savedThemeId) {
      const savedTheme = ACCESSIBILITY_THEMES.find(t => t.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
        applyThemeToDocument(savedTheme);
        onThemeChange(savedTheme);
      }
    }

    // Keyboard shortcut (Alt+T)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        setIsExpanded(!isExpanded);
      }
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, onThemeChange]);

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="relative">
        {/* Toggle Button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2 transition-all duration-200"
          title="Accessibility Themes (Alt+T)"
        >
          {currentTheme.icon}
        </Button>

        {/* Expanded Menu */}
        {isExpanded && (
          <div className="absolute top-12 right-0 bg-gray-900 border border-gray-600 rounded-lg shadow-xl p-4 min-w-[200px] transition-all duration-300">
            <h3 className="text-white font-semibold mb-3 text-sm">Accessibility Themes</h3>

            <div className="space-y-2">
              {ACCESSIBILITY_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    currentTheme.id === theme.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                  }`}
                  disabled={isTransitioning}
                >
                  {theme.icon}
                  <span className="text-sm font-medium">{theme.name}</span>
                  {currentTheme.id === theme.id && (
                    <span className="ml-auto text-green-300">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-600">
              <button
                onClick={() => setIsExpanded(false)}
                className="w-full p-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 border border-gray-600 rounded"
              >
                Quick Cycle (Alt+T)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
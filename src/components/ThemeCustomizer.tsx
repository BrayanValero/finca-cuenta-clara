
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, RotateCcw } from 'lucide-react';


interface ColorTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    darkPrimary: string;
    lightAccent: string;
  };
}

const colorThemes: ColorTheme[] = [
  {
    name: 'Farm Verde (Original)',
    colors: {
      primary: '#4D5726',
      secondary: '#B8860B', 
      accent: '#6B7B3A',
      background: '#F5F5DC',
      darkPrimary: '#3A4219',
      lightAccent: '#8A9B4A'
    }
  },
  {
    name: 'Océano Azul',
    colors: {
      primary: '#1e40af',
      secondary: '#0369a1',
      accent: '#3b82f6',
      background: '#f0f9ff',
      darkPrimary: '#1e3a8a',
      lightAccent: '#60a5fa'
    }
  },
  {
    name: 'Atardecer Naranja',
    colors: {
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f97316',
      background: '#fff7ed',
      darkPrimary: '#c2410c',
      lightAccent: '#fb923c'
    }
  },
  {
    name: 'Bosque Púrpura',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#8b5cf6',
      background: '#faf5ff',
      darkPrimary: '#6d28d9',
      lightAccent: '#a78bfa'
    }
  },
  {
    name: 'Rosa Elegante',
    colors: {
      primary: '#be185d',
      secondary: '#e11d48',
      accent: '#ec4899',
      background: '#fdf2f8',
      darkPrimary: '#9d174d',
      lightAccent: '#f472b6'
    }
  }
];

const ThemeCustomizer: React.FC = () => {
  
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(colorThemes[0]);

  useEffect(() => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('customTheme');
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      setSelectedTheme(theme);
      applyTheme(theme);
    }
  }, []);

  const applyTheme = (theme: ColorTheme) => {
    const root = document.documentElement;
    
    // Aplicar variables CSS personalizadas
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-dark-primary', theme.colors.darkPrimary);
    root.style.setProperty('--theme-light-accent', theme.colors.lightAccent);
    
    // Actualizar el fondo del body
    document.body.style.backgroundColor = theme.colors.background;
    
    // Actualizar variables CSS principales para compatibilidad con shadcn
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--primary', hexToHsl(theme.colors.primary));
    root.style.setProperty('--secondary', hexToHsl(theme.colors.secondary));
    root.style.setProperty('--background', hexToHsl(theme.colors.background));
    root.style.setProperty('--sidebar-background', hexToHsl(theme.colors.primary));
    root.style.setProperty('--sidebar-primary', hexToHsl(theme.colors.secondary));
    root.style.setProperty('--sidebar-accent', hexToHsl(theme.colors.accent));
  };

  const handleThemeChange = (theme: ColorTheme) => {
    setSelectedTheme(theme);
    applyTheme(theme);
    localStorage.setItem('customTheme', JSON.stringify(theme));
  };

  const resetToDefault = () => {
    const defaultTheme = colorThemes[0];
    setSelectedTheme(defaultTheme);
    applyTheme(defaultTheme);
    localStorage.removeItem('customTheme');
  };

  return (
    <Card className="w-full shadow-xl bg-white/95 dark:bg-theme-primary/95 border-0 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl animate-scale-in">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-bold text-theme-primary dark:text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105">
          <Palette className="animate-pulse" size={20} />
          Personalizar Colores
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {colorThemes.map((theme, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedTheme.name === theme.name
                  ? 'border-theme-primary shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleThemeChange(theme)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-theme-primary dark:text-white">{theme.name}</span>
                <div className="flex gap-1">
                  {Object.values(theme.colors).slice(0, 4).map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm transition-transform duration-200 hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          onClick={resetToDefault}
          variant="outline"
          className="w-full mt-4 transition-all duration-300 hover:scale-105 active:scale-95 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4 transition-transform duration-200 hover:rotate-180" />
          Restaurar Colores Originales
        </Button>
      </CardContent>
    </Card>
  );
};

export default ThemeCustomizer;

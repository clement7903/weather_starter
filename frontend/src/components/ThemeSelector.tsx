import React from 'react';
import { useTheme } from '../state/theme';

export function ThemeSelector() {
  const { themeName, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center gap-2 text-sm text-white">
      <label className="sr-only">Theme</label>
      <select
        className="bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-md"
        value={themeName}
        onChange={(e) => setTheme(e.target.value)}
      >
        {Object.values(themes).map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSelector;

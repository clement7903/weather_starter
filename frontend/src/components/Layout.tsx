import { Sidebar } from './Sidebar';
import { Hero } from './Hero';
import { ThemeSelector } from './ThemeSelector';

export function Layout() {
  return (
    <div className="flex h-full min-h-screen w-full">
      <div className="absolute top-4 right-4 z-50">
        <ThemeSelector />
      </div>
      <Sidebar />
      <Hero />
    </div>
  );
}

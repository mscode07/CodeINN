"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <div className="flex items-center space-x-1 bg-gray-200 dark:bg-dark-200 rounded-lg p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded ${
          theme === "light"
            ? "bg-white dark:bg-dark-200 text-gray-900 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-500"
        }`}
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded ${
          theme === "dark"
            ? "bg-white dark:bg-dark-200 text-gray-900 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      {/* <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded ${
          theme === "system"
            ? "bg-white dark:bg-dark-200 text-gray-900 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-500"
        }`}
        aria-label="System mode"
      >
        <Monitor className="w-4 h-4" />
      </button> */}
    </div>
  );
}

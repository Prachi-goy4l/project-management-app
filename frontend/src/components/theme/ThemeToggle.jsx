import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant={theme === "light" ? "default" : "outline"}
        onClick={() => setTheme("light")}
      >
        <Sun className="h-5 w-5" />
      </Button>

      <Button
        size="icon"
        variant={theme === "dark" ? "default" : "outline"}
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-5 w-5" />
      </Button>
    </div>
  );
}
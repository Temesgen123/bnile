'use client';

import { ChevronDown, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import userColorStore from '@/hooks/use-color-store';
import useIsMounted from '@/hooks/use-is-mounted';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { availableColors, color, setColor } = userColorStore(theme);
  const changeTheme = (value: string) => {
    setTheme(value);
  };
  const isMounted = useIsMounted();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="header-button h-[41px]">
        {theme === 'dark' && isMounted ? (
          <div className="flex items-center gap-1">
            <Moon className="w-4 h-4" /> Dark <ChevronDown />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Sun className="w-4 h-4" />
            Light <ChevronDown />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
          <DropdownMenuRadioItem value="dark">
            <Moon className="w-4 h-4 mr-1" /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <Sun className="w-4 h-4 mr-1" /> Light
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={color.name}
          onValueChange={(value) => setColor(value, true)}
        >
          {availableColors.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.name}>
              <div
                style={{ backgroundColor: c.name }}
                className="w-4 h-4 mr-1 rounded-full"
              >
                {c.name}
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

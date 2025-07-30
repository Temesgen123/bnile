'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import userColorStore from '@/hooks/use-color-store';

export function ColorProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { theme } = useTheme();
  const { color, updateCssVariables } = userColorStore(theme);
  React.useEffect(() => {
    updateCssVariables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, color]);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

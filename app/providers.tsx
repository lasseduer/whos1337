"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <LiveblocksProvider authEndpoint={"/api/liveblocks"}>
          <RoomProvider id={"whos1337"}>
            {children}
          </RoomProvider>
        </LiveblocksProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

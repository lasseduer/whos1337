"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, link as linkStyles } from "@nextui-org/react";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const { user } = useUser();

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">1337</p>
          </NextLink>
        </NavbarBrand>
        <ul className="lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>
      <NavbarContent justify="end">
        <ThemeSwitch />
        {user ? (
          <>
            <p>Welcome, {user.nickname}</p>
            <Button
              color="secondary"
              onClick={() => (window.location.href = "/api/auth/logout")}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            color="secondary"
            onClick={() => (window.location.href = "/api/auth/login")}
          >
            Login
          </Button>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

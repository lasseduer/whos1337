"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  link as linkStyles,
} from "@nextui-org/react";
import NextLink from "next/link";
import clsx from "clsx";
import { User, useSharedContext } from "@/app/store";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { useEffect } from "react";
import { UserDto } from "@/app/models/dtos";

export const Navbar = () => {
  const { user } = useUser();
  const store = useSharedContext();

  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        await fetch("api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((userDto: UserDto) => {
            const storeUser: User = {
              nickname: userDto.nickname ?? "",
              points: `${userDto.points}`,
            };

            store.setUser(storeUser);
          });
      };

      fetchUser();
    } else {
      store.setUser(null);
    }
  }, [user]);

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
      {
        <NavbarContent as="div" justify="end">
          <ThemeSwitch />
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={store.user?.nickname ?? ""}
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  onClick={() => (window.location.href = "/profile")}
                >
                  <p className="font-semibold">{store.user?.nickname}</p>
                </DropdownItem>
                <DropdownItem key="points">
                  {store.user?.points} points
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={() => (window.location.href = "/api/auth/logout")}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <>
              <Button
                color="secondary"
                onClick={() => (window.location.href = "/api/auth/login")}
              >
                Login
              </Button>
            </>
          )}
        </NavbarContent>
      }
    </NextUINavbar>
  );
};

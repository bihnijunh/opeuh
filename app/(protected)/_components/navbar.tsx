"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

// Navbar component
export const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleCloseButtonClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (user !== undefined) {
      setIsLoaded(true);
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <nav className="bg-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">PIEDRA</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {user && user.role === UserRole.ADMIN && (
            <Button
              asChild
              variant={pathname === "/admin" ? "default" : "outline"}
            >
              <Link href="/admin">Admin</Link>
            </Button>
          )}
          <div className="flex space-x-2">
            <Button
              asChild
              variant={pathname === "/home" ? "default" : "outline"}
            >
              <Link href="/home">Home</Link>
            </Button>

            <Button
              asChild
              variant={pathname === "/send" ? "default" : "outline"}
            >
              <Link href="/send">Send</Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/settings" ? "default" : "outline"}
            >
              <Link href="/settings">Settings</Link>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger id="currency">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center py-2 -mx-1 md:mx-0">
            <UserButton />
          </div>
        </div>
        <div className="md:hidden">
          {/* Mobile menu button */}
          <button
            type="button"
            className="bg-gray-200 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
            onClick={handleMobileMenuToggle}
          >
            <span className="sr-only">Open main menu</span>
            {/* Heroicon name: menu */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed top-0 left-0 w-full bg-gray-800 z-10">
              <div className="container mx-auto flex flex-col items-center space-y-4 py-4">
                {/* Close button */}
                <button
                  type="button"
                  className="text-white focus:outline-none"
                  onClick={handleCloseButtonClick}
                >
                  {/* Heroicon name: x */}
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                {/* Adjust the following items as needed */}
                <Button
                  asChild
                  variant={pathname === "/home" ? "default" : "outline"}
                >
                  <Link href="/home">Home</Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/send" ? "default" : "outline"}
                >
                  <Link href="/send">Send</Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/recieve" ? "default" : "outline"}
                >
                  <Link href="/recieve">Recieve</Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/settings" ? "default" : "outline"}
                >
                  <Link href="/settings">Settings</Link>
                </Button>
                <div className="flex items-center py-2 -mx-1 md:mx-0">
                  <UserButton />
                  {user?.role === UserRole.ADMIN && (
                    <Button
                      asChild
                      variant={
                        pathname === "/admin" ? "default" : "outline"
                      }
                      onClick={handleMobileMenuItemClick}
                    >
                      <Link href="/admin">Admin</Link>
                    </Button>
                  )}
                </div>
                {/* ... other mobile menu items */}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

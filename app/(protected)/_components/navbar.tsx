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
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ModeToggle } from "@/components/mode-toggle";

export const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/send", label: "Send" },
    { href: "/exchange", label: "Buy Crypto" },
    { href: "/receive", label: "Receive" },
    { href: "/referrals", label: "Referrals" },
    { href: "/settings", label: "Settings" },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.unshift({ href: "/admin", label: "Admin" });
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/home" className="text-xl font-bold text-primary dark:text-white">
            PIEDRA
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "default" : "ghost"}
                className={`relative text-gray-700 dark:text-white hover:text-primary dark:hover:text-white ${
                  pathname === item.href ? 'dark:bg-gray-700' : ''
                }`}
              >
                <Link href={item.href}>
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-white"
                      layoutId="underline"
                    />
                  )}
                </Link>
              </Button>
            ))}
            <ModeToggle />
            <UserButton />
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-white"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-800"
          >
            <div className="container mx-auto px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={`w-full justify-start text-gray-700 dark:text-white hover:text-primary dark:hover:text-white ${
                    pathname === item.href ? 'dark:bg-gray-700' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
              <div className="flex items-center justify-between pt-2">
                <ModeToggle />
                <UserButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
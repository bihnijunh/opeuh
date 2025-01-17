"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { GoogleTranslate } from "./GoogleTranslate";

export const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState([
    { href: "/settings", label: "Settings" },
  ]);

  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      setNavItems(prevItems => {
        // Filter out any existing admin-related items
        const nonAdminItems = prevItems.filter(item => 
          !item.href.startsWith("/admin")
        );
        
        // Add admin link at the beginning
        return [
          { href: "/admin", label: "Admin" },
          ...nonAdminItems
        ];
      });
    } else {
      // If the user is not an admin, remove all admin-related items
      setNavItems(prevItems => 
        prevItems.filter(item => !item.href.startsWith("/admin"))
      );
    }
  }, [user]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-6">
          <Link href="/home" className="text-2xl font-bold text-primary dark:text-white transition-colors duration-300 hover:text-primary-dark notranslate">
            <Image src="/logo.png" alt="American Airlines" height={100} width={120} />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={`relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors duration-300 ${
                  pathname === item.href ? 'font-semibold' : ''
                }`}
              >
                <Link href={item.href}>
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-white"
                      layoutId="underline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </Button>
            ))}
            <div className="flex items-center space-x-4">
              <GoogleTranslate />
              <ModeToggle />
              <UserButton />
            </div>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={`w-full justify-start text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors duration-300 ${
                    pathname === item.href ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <GoogleTranslate />
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
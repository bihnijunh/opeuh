"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          new (config: any, element: string): void;
          InlineLayout: {
            SIMPLE: string;
          };
        };
      };
    };
  }
}

export const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTranslateReady, setIsTranslateReady] = useState(false);
  const googleTranslateInitialized = useRef(false);

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/send", label: "Send" },
    { href: "/exchange", label: "Buy Crypto" },
    { href: "/giftcard", label: "Gift Card" },
    { href: "/receive", label: "Receive" },
    { href: "/referrals", label: "Referrals" },
    { href: "/settings", label: "Settings" },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.unshift({ href: "/admin", label: "Admin" });
  }

  useEffect(() => {
    document.body.style.paddingTop = '80px';
    return () => {
      document.body.style.paddingTop = '0px';
    };
  }, []);

  useEffect(() => {
    if (googleTranslateInitialized.current) return;

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    window.googleTranslateElementInit = function() {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
      setIsTranslateReady(true);
    }

    document.body.appendChild(script);
    googleTranslateInitialized.current = true;

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window.googleTranslateElementInit = () => {};
    };
  }, []);

  const handleTranslateClick = () => {
    if (isTranslateReady) {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.click();
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-6">
          <Link href="/home" className="text-2xl font-bold text-primary dark:text-white transition-colors duration-300 hover:text-primary-dark">
            PIEDRA
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
              <div id="google_translate_element" className="hidden"></div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTranslateClick}
                className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                <Globe className="h-5 w-5" />
              </Button>
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleTranslateClick}
                  className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  <Globe className="h-5 w-5" />
                </Button>
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
"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  UserIcon, 
  PlaneTakeoffIcon, 
  CalendarCheckIcon, 
  ActivityIcon, 
  CreditCardIcon 
} from "lucide-react";

interface AdminTabProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

const tabVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05, y: -2 },
  tap: { scale: 0.95 }
};

const getTabIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case 'users':
      return UserIcon;
    case 'create flights':
      return PlaneTakeoffIcon;
    case 'booked flights':
      return CalendarCheckIcon;
    case 'flight status':
      return ActivityIcon;
    case 'payment methods':
      return CreditCardIcon;
    default:
      return undefined;
  }
};

export const AdminTab = ({ href, isActive, children, icon: IconProp }: AdminTabProps) => {
  const TabIcon = IconProp || getTabIcon(children?.toString() || '');

  return (
    <motion.div
      variants={tabVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="relative"
    >
      <Link
        href={href}
        className={cn(
          "relative flex min-w-[72px] flex-col items-center gap-1 px-3 py-2 text-sm font-medium transition-all",
          "rounded-lg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "sm:min-w-[100px] sm:flex-row sm:gap-2 sm:px-6 sm:py-3",
          isActive
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        )}
      >
        {TabIcon && (
          <TabIcon className={cn(
            "h-5 w-5 flex-shrink-0",
            "sm:h-4 sm:w-4 md:h-5 md:w-5",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )} />
        )}
        <span className={cn(
          "text-[10px] font-medium leading-tight",
          "sm:text-sm sm:leading-normal",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {children}
        </span>
      </Link>
    </motion.div>
  );
};

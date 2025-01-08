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
  hover: { y: -2 },
  tap: { scale: 0.98 }
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
          "relative flex flex-col items-center gap-1 px-3 py-2 text-sm font-medium transition-all",
          "rounded-lg hover:bg-accent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "sm:flex-row sm:gap-2 sm:px-6 sm:py-3",
          isActive
            ? "bg-primary text-primary-foreground shadow-lg"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {TabIcon && (
          <TabIcon className={cn(
            "h-5 w-5 flex-shrink-0",
            "sm:h-4 sm:w-4 md:h-5 md:w-5"
          )} />
        )}
        <span className={cn(
          "text-[10px] font-medium leading-tight",
          "sm:text-sm sm:leading-normal"
        )}>
          {children}
        </span>
      </Link>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  );
};

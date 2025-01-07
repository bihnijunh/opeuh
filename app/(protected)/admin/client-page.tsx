'use client';

import AdminUsersPage from "./AdminUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon, DollarSignIcon, ActivityIcon, CreditCardIcon, UsersIcon, PlaneIcon, CalendarIcon } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AdminTab = ({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }} 
    whileTap={{ scale: 0.95 }}
    className="relative"
  >
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {children}
    </Link>
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
  </motion.div>
);

const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: number | string; icon: any; trend?: { value: number; isPositive: boolean } }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }} 
    transition={{ type: "spring", stiffness: 300 }}
    className="group"
  >
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className="rounded-full p-2 bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

interface AdminPageProps {
  users: any[];
  totalUsers: number;
}

export default function AdminPageClient({ users, totalUsers }: AdminPageProps) {
  const pathname = usePathname();
  // Mock data for demonstration
  const totalFlights = 150;
  const activeBookings = 45;
  const revenue = "$25,430";

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="p-6 max-w-7xl mx-auto"
    >
      <motion.div 
        variants={fadeInUp}
        className="relative mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5"
      >
        <motion.h1 
          variants={fadeInUp}
          className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          Admin Dashboard
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          className="mt-2 text-muted-foreground"
        >
          Manage your airline operations and monitor key metrics
        </motion.p>
      </motion.div>
      
      <motion.div 
        variants={fadeInUp} 
        className="mb-8 bg-card rounded-xl p-2 shadow-sm"
      >
        <div className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground gap-2">
          <AdminTab href="/admin" isActive={pathname === '/admin'}>
            <UsersIcon className="h-4 w-4 mr-2" />
            Users
          </AdminTab>
          <AdminTab href="/admin/flights" isActive={pathname === '/admin/flights'}>
            <PlaneIcon className="h-4 w-4 mr-2" />
            Create Flights
          </AdminTab>
          <AdminTab href="/admin/booked-flights" isActive={pathname === '/admin/booked-flights'}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Booked Flights
          </AdminTab>
          <AdminTab href="/admin/flight-status" isActive={pathname === '/admin/flight-status'}>
            <ActivityIcon className="h-4 w-4 mr-2" />
            Flight Status
          </AdminTab>
          <AdminTab href="/admin/payment-methods" isActive={pathname === '/admin/payment-methods'}>
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Payment Methods
          </AdminTab>
        </div>
      </motion.div>

      <motion.div 
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatCard 
          title="Total Users" 
          value={totalUsers} 
          icon={UserIcon} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Total Flights" 
          value={totalFlights} 
          icon={PlaneIcon}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Active Bookings" 
          value={activeBookings} 
          icon={CalendarIcon}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Total Revenue" 
          value={revenue} 
          icon={DollarSignIcon}
          trend={{ value: 15, isPositive: true }}
        />
      </motion.div>

      <motion.div variants={fadeInUp} className="flex flex-col space-y-6">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="flex items-center space-x-4 mb-4"
        >
          <Link
            href="/admin/payment-methods"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]"
          >
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Manage Payment Methods
          </Link>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
        >
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Recent Users
            </h2>
            <AdminUsersPage users={users} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
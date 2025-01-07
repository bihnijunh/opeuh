'use client'

import { getDashboardData } from "@/actions/getDashboardData"

import { useCurrentUser } from "@/hooks/use-current-user"
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard as CreditCardIcon, DollarSign, Send, MessageCircle, CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { Navbar } from "@/app/(protected)/_components/navbar"
import { useEffect, useState } from "react"
import { getCardData } from "@/actions/admin-card-data"
import { formatCreditCardNumber, formatExpiryDate } from "@/lib/formatters"
import { Skeleton } from "@/components/ui/skeleton" // Make sure you have this component
import { getAccountDetails } from "@/actions/admin-account-details";
import { Button } from "@/components/ui/button"
import { Toaster, toast } from 'sonner'

export default function DashboardComponent() {
  const user = useCurrentUser()
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    loanBalance: 0,
    wireTransfer: 0,
    domesticTransfer: 0,
  })

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    cardLimit: 0,
  })
  const [cardDataLoading, setCardDataLoading] = useState(true)
  const [cardDataError, setCardDataError] = useState<string | null>(null)

  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    currency: "",
    accountType: "",
    status: "",
    accountLimit: 0,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      const data = await getDashboardData()
      if ('error' in data) {
        console.error(data.error)
      } else {
        setDashboardData(data)
      }
    }
    fetchDashboardData()
  }, [])

  useEffect(() => {
    async function fetchCardData() {
      setCardDataLoading(true)
      setCardDataError(null)
      try {
        const data = await getCardData()
        if ('error' in data) {
          throw new Error(data.error)
        }
        setCardData(data)
      } catch (error) {
        console.error('Error fetching card data:', error)
        setCardDataError(error instanceof Error ? error.message : 'An error occurred while fetching card data')
      } finally {
        setCardDataLoading(false)
      }
    }
    fetchCardData()
  }, [])

  useEffect(() => {
    async function fetchAccountDetails() {
      const data = await getAccountDetails();
      if ('error' in data) {
        console.error(data.error);
      } else {
        setAccountDetails(data);
      }
    }
    fetchAccountDetails();
  }, []);

  // Get the user's name, or use a default if not available
  const userName = user?.name || "Customer"

  // Get the current time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <Navbar />
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Hi, Good {getTimeOfDay()} {userName}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BalanceCard
                  icon={<CreditCardIcon className="h-6 w-6 text-white" />}
                  amount={dashboardData.totalBalance.toFixed(2)}
                  label="Total Balance"
                  color="bg-indigo-900"
                />
                <BalanceCard
                  icon={<DollarSign className="h-6 w-6 text-white" />}
                  amount={dashboardData.loanBalance.toFixed(2)}
                  label="Loan Balance"
                  color="bg-pink-500"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BalanceCard
                  icon={<Send className="h-6 w-6 text-white" />}
                  amount={dashboardData.wireTransfer.toFixed(2)}
                  label="Wire Transfer"
                  color="bg-green-500"
                />
                <BalanceCard
                  icon={<Send className="h-6 w-6 text-white" />}
                  amount={dashboardData.domesticTransfer.toFixed(2)}
                  label="Domestic Transfer"
                  color="bg-red-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Card</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CreditCard cardData={cardData} isLoading={cardDataLoading} />
              {cardDataError && (
                <p className="text-red-500 mt-4">Error: {cardDataError}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDetails accountDetails={accountDetails} />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Latest Wire Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">No recent transactions</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      
    </div>
  )
}

interface BalanceCardProps {
  icon: React.ReactNode;
  amount: string;
  label: string;
  color: string;
}

function BalanceCard({ icon, amount, label, color }: BalanceCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <div className={`${color} p-2 rounded-full`}>
          {icon}
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{amount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  )
}

interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  cardLimit: number;
}

function CreditCard({ cardData, isLoading }: { cardData: CardData; isLoading: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const lastFourDigits = cardData.cardNumber ? cardData.cardNumber.slice(-4) : '****';

  const toggleVisibility = () => setIsVisible(!isVisible);

  const maskedCardNumber = isVisible ? formatCreditCardNumber(cardData.cardNumber) : '•••• •••• •••• ' + lastFourDigits;
  const maskedCVV = isVisible ? cardData.cvv : '***';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    }).catch((err) => {
      console.error('Failed to copy text: ', err)
      toast.error("Failed to copy to clipboard");
    })
  }

  if (isLoading) {
    return <CreditCardSkeleton />;
  }

  return (
    <div className="w-full aspect-[1.586/1] bg-indigo-900 rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col justify-between text-white overflow-hidden relative">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs sm:text-sm opacity-75 mb-1">USD card •••• {lastFourDigits}</p>
          <p className="text-base sm:text-lg font-semibold">Active</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={toggleVisibility} className="text-white hover:text-gray-200 transition-colors">
            {isVisible ? <EyeOffIcon className="h-5 w-5 sm:h-6 sm:w-6" /> : <EyeIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
          <button
            onClick={() => copyToClipboard(cardData.cardNumber, "Card number")}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <CopyIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <p className="text-xs sm:text-sm opacity-75 mb-1">Card number</p>
          <p className="text-lg sm:text-xl font-mono">{maskedCardNumber}</p>
        </div>
        
        <div className="flex justify-between">
          <div>
            <p className="text-xs sm:text-sm opacity-75 mb-1">Expiration</p>
            <p className="text-base sm:text-lg font-semibold">{formatExpiryDate(cardData.expiryDate)}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm opacity-75 mb-1">CVV</p>
            <p className="text-base sm:text-lg font-semibold">{maskedCVV}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-end">
        <div className="relative h-6 w-12 sm:h-8 sm:w-16">
          <Image
            width={50}
            height={30}
            src="/logo.png"
            alt="Logo"
            className="mb-4"
          />
        </div>
      </div>
    </div>
  )
}

function CreditCardSkeleton() {
  return (
    <div className="w-full aspect-[1.586/1] bg-indigo-900 rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col justify-between text-white overflow-hidden relative">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-white/20" />
          <Skeleton className="h-6 w-16 bg-white/20" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-6 rounded-full bg-white/20" />
          <Skeleton className="h-6 w-6 rounded-full bg-white/20" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2 bg-white/20" />
          <Skeleton className="h-8 w-full bg-white/20" />
        </div>
        
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-4 w-16 mb-2 bg-white/20" />
            <Skeleton className="h-6 w-20 bg-white/20" />
          </div>
          <div>
            <Skeleton className="h-4 w-12 mb-2 bg-white/20" />
            <Skeleton className="h-6 w-16 bg-white/20" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-end">
        <Skeleton className="h-8 w-16 bg-white/20" />
      </div>
    </div>
  )
}

interface AccountDetailsProps {
  accountDetails: {
    accountNumber: string;
    currency: string;
    accountType: string;
    status: string;
    accountLimit: number;
  };
}

function AccountDetails({ accountDetails }: AccountDetailsProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    }).catch((err) => {
      console.error('Failed to copy text: ', err)
      toast.error("Failed to copy to clipboard");
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Account Number</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{accountDetails.accountNumber}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => copyToClipboard(accountDetails.accountNumber, "Account number")}
        >
          <CopyIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DetailCard label="Currency" value={accountDetails.currency} color="bg-indigo-900" textColor="text-white" />
        <DetailCard label="Account type" value={accountDetails.accountType} />
        <DetailCard label="Status" value={accountDetails.status} />
        <DetailCard label="Account Limit" value={`$${accountDetails.accountLimit}`} />
      </div>
    </div>
  )
}

interface DetailCardProps {
  label: string;
  value: string;
  color?: string;
  textColor?: string;
}

function DetailCard({ label, value, color = "bg-gray-50", textColor = "text-gray-900" }: DetailCardProps) {
  return (
    <div className={`${color} ${textColor} p-4 rounded-lg`}>
      <p className="text-sm opacity-75">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
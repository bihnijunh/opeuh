"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"

export default function Component() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const cards = [
    {
      image: "/brands/apple.jpg",
      title: "Apple Gift Card",
      prices: ["$15", "$50", "$100", "$250", "$500"],
    },
    {
      image: "/brands/e.avif",
      title: "CashtoCode eVoucher",
      prices: ["$5", "$10", "$25", "$50"],
    },
    {
      image: "/brands/paysafecard.avif",
      title: "paysafecard",
      prices: ["\u20AC10", "\u20AC25", "\u20AC50", "\u20AC100"],
    },
    {
      image: "/brands/amex.avif",
      title: "American Express Gift Card",
      prices: ["\u20AC10", "\u20AC25", "\u20AC50", "\u20AC100"],
    },
    {
      image: "/brands/visa.avif",
      title: "Visa Gift Card",
      prices: ["\u20AC10", "\u20AC25", "\u20AC50", "\u20AC100"],
    },
    {
      image: "/brands/transcash.avif",
      title: "Transcash Ticket",
      prices: ["\u20AC10", "\u20AC25", "\u20AC50", "\u20AC100"],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold mb-4">Gift Cards & Credits</h1>
          <p className="text-lg text-muted-foreground mb-8">
          Digital gift cards and vouchers for online stores and entertainment services to shop online directly or top up your account balance.
          </p>
          <div className="space-y-6">
            {cards.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-between p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
              >
                <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mb-4 sm:mb-0">
                  <div className="w-24 h-24 relative mb-4 sm:mb-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <TruckIcon className="w-4 h-4" />
                      <MailIcon className="w-4 h-4" />
                      <span>Instant delivery</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.prices.map((price, i) => (
                        <Button
                          key={i}
                          variant={selectedCard === `${index}-${i}` ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCard(`${index}-${i}`)}
                        >
                          {price}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="link" className="text-blue-500 mt-4 sm:mt-0">
                  Visit
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <CircleCheckIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Instant delivery</h3>
                <p className="text-muted-foreground">
                  You will receive the code directly by email, so that you can use the credit immediately.
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <GiftIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Gift card design</h3>
                <p className="text-muted-foreground">Choose from more than 10 different templates.</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <LockIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Secure payment</h3>
                <p className="text-muted-foreground mb-4">
                  Complete the checkout process safely and quickly with a choice of more than 60 payment methods.
                </p>
                <div className="flex flex-wrap gap-4">
                  <ShoppingCartIcon className="w-6 h-6" />
                  <ViewIcon className="w-6 h-6" />
                  <CreditCardIcon className="w-6 h-6" />
                  <BitcoinIcon className="w-6 h-6" />
                  <AppleIcon className="w-6 h-6" />
                  <ImageIcon className="w-6 h-6" />
                  <BadgeIcon className="w-6 h-6" />
                  <EraserIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Payment Cards</h3>
            <p className="text-muted-foreground">
              Online payment cards are an easy and affordable alternative to debit and credit cards. All you have to do
              is choose the amount that you would like to load and we will email the prepaid gift card to you instantly!
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AppleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  )
}

function BadgeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    </svg>
  )
}

function BitcoinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  )
}

function CircleCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function CreditCardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function EraserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
      <path d="M22 21H7" />
      <path d="m5 11 9 9" />
    </svg>
  )
}

function GiftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  )
}

function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

function LockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function MailIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function ShoppingCartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function TruckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

function ViewIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
      <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    </svg>
  )
}
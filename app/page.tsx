"use client";

import React from "react";
import {
  ArrowPathIcon,
  Bars3Icon,
  CalendarDaysIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  HandRaisedIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import {
  footerProductLinks,
  footerSupportLinks,
  footercompanyLinks,
} from "./data";
import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import TrustedBy from "@/components/auth/trustedby";
import CountryChanger from "@/components/auth/country-changer";

function PageApp() {
  // Initialize Firebase and get the auth instance

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Company", href: "#" },
  ];

  const features = [
    {
      name: "Bank-Grade Security",
      description:
        "We manage your digital assets using piedra proprietary offline cold storage systems, meaning your funds are protected",
      icon: CloudArrowUpIcon,
    },
    {
      name: "User-Centered Design",
      description:
        "Intuitive experiences are rooted in user-centered design principles.",
      icon: LockClosedIcon,
    },
    {
      name: "24/7 Support",
      description:
        "We provide bi-lingual support around the clock and guarantee you will always talk to a human, whether in live-chat or emails. ",
      icon: ArrowPathIcon,
    },
    {
      name: "Advanced security",
      description:
        "Advanced security measures include continuous monitoring and auditing of systems and networks to identify security vulnerabilities, anomalies, or breaches.",
      icon: FingerPrintIcon,
    },
  ];
  return (
    <>
      <div className="space-y-10 ">
        <div className="bg-white">
          <header className="absolute inset-x-0 top-0 z-90">
            <nav
              className="flex items-center justify-between p-6 lg:px-8"
              aria-label="Global"
            >
              <div className="flex lg:flex-1">
                <Link href="/" passHref>
                  <div className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                  </div>
                </Link>
                <div className="p-5">
                  <Link href="/">
                    <div className="text-[#FDD6B0] font-[600] ">PIEDRA</div>
                  </Link>
                </div>
              </div>

              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <LoginButton asChild>
                      <Button variant="secondary" size="lg">
                        Sign in
                      </Button>
                    </LoginButton>
              </div>
            </nav>
            <Dialog
              as="div"
              className="lg:hidden"
              open={mobileMenuOpen}
              onClose={setMobileMenuOpen}
            >
              <div className="fixed inset-0 z-50" />
              <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                  </a>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <LoginButton asChild>
                      <Button variant="secondary" size="lg">
                        Sign in
                      </Button>
                    </LoginButton>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </header>

          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  Announcing our next round of funding.{" "}
                  <a href="#" className="font-semibold text-indigo-600">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Read more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  PIEDRA THE SIMPLEST WAY TRADING CRYPTO IN <CountryChanger />
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 font-[600]">
                  is here to guide you on your journey to buy and sell Bitcoin
                  and other <br />
                  cryptocurrencies online with 100% smooth transaction. With
                  you, every step of the way.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="#"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </a>
                </div>
              </div>
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
          <div></div>
        </div>
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                The most trusted cryptocurrency platform
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Intuitive experience managing your personal budgets.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 font-[400]">
                Piedra is a cryptocurrency brokerage that allows you to buy,
                sell, swap and store Bitcoin, Ethereum, And{" "}
                <span className="text-[#6366F1] font-[400]">70+</span>
                other cryptocurrencies online. With offices across the North
                America, Piedra provides its services at financial institution
                standard.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <TrustedBy />

        <div className="bg-[#000] text-white">
          <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                <div className="max-w-xl lg:max-w-lg">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Subscribe to our newsletter.
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-gray-300">
                    Nostrud amet eu ullamco nisi aute in ad minim nostrud
                    adipisicing velit quis. Duis tempor incididunt dolore.
                  </p>
                  <div className="mt-6 flex max-w-md gap-x-4">
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Enter your email"
                    />
                    <button
                      type="submit"
                      className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                  <div className="flex flex-col items-start">
                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                      <CalendarDaysIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <dt className="mt-4 font-semibold text-white">
                      Weekly articles
                    </dt>
                    <dd className="mt-2 leading-7 text-gray-400">
                      Non laboris consequat cupidatat laborum magna. Eiusmod non
                      irure cupidatat duis commodo amet.
                    </dd>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                      <HandRaisedIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <dt className="mt-4 font-semibold text-white">No spam</dt>
                    <dd className="mt-2 leading-7 text-gray-400">
                      Officia excepteur ullamco ut sint duis proident non
                      adipisicing. Voluptate incididunt anim.
                    </dd>
                  </div>
                </dl>
              </div>
              <div
                className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
                aria-hidden="true"
              >
                <div
                  className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:gird-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm:text-center">
            <ul className="px-2 text-center sm:text-start flex sm:block flex-col items-center">
              <div>
                <Link href="/">
                  <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between text-[#FDD6B0] font-[600] ">
                    PIEDRA
                  </div>
                </Link>
              </div>

              <p className="text-[#818CF8]">
                Cash is accepted here too - no bank account needed.{" "}
                <span className="text-[#EFB909]"> Only in Cuba.</span>
              </p>
              <div className="flex items-center mt-[15px]">
                <AiFillFacebook size={25} className="cursor-pointer" />
                <AiOutlineTwitter
                  size={25}
                  style={{ marginLeft: "15px", cursor: "pointer" }}
                />
                <AiFillInstagram
                  size={25}
                  style={{ marginLeft: "15px", cursor: "pointer" }}
                />
                <AiFillYoutube
                  size={25}
                  style={{ marginLeft: "15px", cursor: "pointer" }}
                />
              </div>
            </ul>

            <ul className="text-center sm:text-start">
              <h1 className="mb-1 font-semibold">Company</h1>
              {footerProductLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                    href={link.link}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="text-center sm:text-start">
              <h1 className="mb-1 font-semibold">Others</h1>
              {footercompanyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                    href={link.link}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="text-center sm:text-start">
              <h1 className="mb-1 font-semibold">Support</h1>
              {footerSupportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                    href={link.link}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
         text-center pt-2 text-gray-400 text-sm pb-8"
          >
            <span className="!align-middle">
              World Trade Center Luis Alberto de Herrera 1248, tower 2, 7th
              floor, office 710, Montevideo, Uruguay.
            </span>
            <span>Terms · Privacy Policy</span>
            <div className="sm:block flex items-center justify-center w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageApp;

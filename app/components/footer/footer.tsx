"use client";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const footerSections = {
    help: {
      title: "Help",
      links: [
        { text: "Contact American", href: "#" },
        { text: "Receipts and refunds", href: "#" },
        { text: "FAQs", href: "#" },
        { text: "Agency reference", href: "#", isExternal: true },
        { text: "American Airlines Cargo", href: "#", isExternal: true },
        { text: "Bag and optional fees", href: "#" },
        { text: "Customer service and contingency plans", href: "#" },
        { text: "Conditions of carriage", href: "#" },
      ],
    },
    about: {
      title: "About American",
      links: [
        { text: "About us", href: "#" },
        { text: "We're hiring! Join our team", href: "#", isExternal: true },
        { text: "Investor relations", href: "#", isExternal: true },
        { text: "Newsroom", href: "#", isExternal: true },
        { text: "Legal, privacy, copyright", href: "#" },
        { text: "Environmental, social and governance", href: "#", isExternal: true },
        { text: "Modern Slavery Report", href: "#" },
        { text: "Browser compatibility", href: "#" },
        { text: "Web accessibility", href: "#" },
      ],
    },
    extras: {
      title: "Extras",
      links: [
        { text: "Business programs", href: "#" },
        { text: "Gift cards", href: "#", isExternal: true },
        { text: "Trip insurance", href: "#" },
      ],
    },
  };

  return (
    <footer className="bg-[#E5E8EB] dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Help Section */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              {footerSections.help.title}
            </h2>
            <ul className="space-y-2.5">
              {footerSections.help.links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="inline-flex text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {link.text}
                    {link.isExternal && (
                      <span className="ml-1 text-[10px] text-gray-400">↗</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About American Section */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              {footerSections.about.title}
            </h2>
            <ul className="space-y-2.5">
              {footerSections.about.links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="inline-flex text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {link.text}
                    {link.isExternal && (
                      <span className="ml-1 text-[10px] text-gray-400">↗</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Extras Section */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              {footerSections.extras.title}
            </h2>
            <ul className="space-y-2.5">
              {footerSections.extras.links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="inline-flex text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {link.text}
                    {link.isExternal && (
                      <span className="ml-1 text-[10px] text-gray-400">↗</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Buy Miles and Car Rental Section */}
          <div className="space-y-4">
            {/* Buy Miles Image */}
            <Link href="#" className="block">
              <div className="relative h-[120px]">
                <Image
                  src="/buymiles.png"
                  alt="Buy Miles"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Car Rental Banner */}
            <Link href="#" className="block">
              <div className="relative h-[120px]">
                <Image
                  src="/footerimg.png"
                  alt="Car Rental Offer"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
              Link opens in new window. Site may not meet accessibility guidelines.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span className="sr-only">X (Twitter)</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
